import { RunnerState, CodeRunner, TestTracker, TestCase } from "../code-runner"
import { FunctionType } from "../type";
import { LetCodeToPythonCodeMapper, PythonTypeMapper, PythonToLetCodeCodeMapper, PythonLetCodeCodeMapperFuncName } from "./python-mapper"

const testWarpingFunctionName: string = "___LETCODE_PYTHON_TEST_WARPING_FUNC"

export default class CoderunnerPythonImpl implements CodeRunner {
    //We need to warp user's code in a function scope before passing it to the interpretor
    //so we can clean user defined vars after tests completed.
    state: RunnerState = RunnerState.UNINIT;
    private interpreter_webworker?: Worker; 
    private onStdout?: (out: string) => void;
    private onError?: (err: string) => void;
    // sould bind to something that the run button and disable the run button when state is not READY
    private notifyRunnerState?: (state: RunnerState) => void;
    private currentTestTracker: TestTracker | null = null;
    private resolveCurrentTracker: ((tt: TestTracker) => void) | null = null;

    init(notifyRunnerState: (state: RunnerState) => void): void {
        this.notifyRunnerState = notifyRunnerState;
        if (this.interpreter_webworker) {
            notifyRunnerState(this.state);
            return;
        }
        if (this.onStdout)
            this.onStdout("Loading Python interpreter..");
        this.updateState(RunnerState.INITING);
        import("worker-loader!./webworker/pyodide.worker").then(worker => {
            this.interpreter_webworker = new worker.default();
            this.interpreter_webworker .addEventListener("error", (e) => console.log(), false);

            this.interpreter_webworker!.onmessage = () => {
                if (this.onStdout)
                    this.onStdout("Python interpreter loadded! Loading modules and output mapping function..");
                this.interpreter_webworker!.onmessage = (e) => {
                    if (e.data.type === "runCompleted") { 
                        if (this.onStdout)
                            this.onStdout("Python runner is ready!")
                        this.updateState(RunnerState.READY);
                        this.interpreter_webworker!.onmessage = this.handleMessage.bind(this);
                        this.interpreter_webworker!.onerror = this.handleError.bind(this);
                    }
                }
                this.interpreter_webworker?.postMessage({
                    type: "run",
                    code: `import gc\n${PythonToLetCodeCodeMapper}`
                });
            }
            this.interpreter_webworker!.onerror = (err) => {
                this.updateState(RunnerState.ERROR);
            }
        })
    }

    setConsole(onStdout?: (out: string) => void, onError?: (err: string) => void): void {
        this.onStdout = onStdout;
        this.onError = onError;
    }

    canSupportFunctionType(functionType: FunctionType): boolean {
        for (let varType of functionType.paramsType) { 
            if (!PythonTypeMapper.canBeMapped(varType.type))
                return false;
        }
        return PythonTypeMapper.canBeMapped(functionType.returnType.type)
    }
    getStarterCode(functionType: FunctionType): string {
        return `
def ${functionType.name}(${functionType.paramsType.map(varType => varType.name + ":" + PythonTypeMapper.mapType(varType.type))
                .join(", ")}) -> ${PythonTypeMapper.mapType(functionType.returnType.type)}:
    # Input your code here:
    return      `;
    }

    runTest(functionType: FunctionType, testCases: TestCase[], userCode: string): Promise<TestTracker>{
        if (this.state !== RunnerState.READY)  
            throw new Error("Runner is not ready!");
        
        this.updateState(RunnerState.COMPILING);
        let generatedCode = `def ${testWarpingFunctionName}() -> list:\n` + userCode.split("\n").map(s => "    " + s).join("\n");
        const testCasesInternalName: string[] = []
        for (let tc of testCases) { 
            let args: string[] = [];
            for (let i = 0; i < tc.inputs.length; i++) { 
                args.push(LetCodeToPythonCodeMapper.mapCode(tc.inputs[i], functionType.paramsType[i].type));
            }
            const tcName = getVariableName("testcase" + testCases.indexOf(tc), generatedCode)
            testCasesInternalName.push(tcName);
            generatedCode += 
            `
    def ${tcName}() -> str:
        return ${PythonLetCodeCodeMapperFuncName}(${functionType.name}(${args.join(", ")}))
            `;
        }
        generatedCode +=
            `
    return [${testCasesInternalName.join(", ")}]
            `
        console.log("generated code:\n", generatedCode)
        this.currentTestTracker = new TestTracker(userCode, testCases, generatedCode);
        this.interpreter_webworker!.postMessage({
            type: "runTest",
            code: generatedCode,
            numTest: testCases.length,
            testWarperName: testWarpingFunctionName
        });
        return new Promise(resolve => { 
            this.resolveCurrentTracker = resolve;
        });
    }

    private handleMessage(msg: MessageEvent): void { 
        if (!msg.data) return;
        if (msg.data.type === "stdout") {
            if (this.onStdout && this.state === RunnerState.RUNNING) this.onStdout(msg.data.value);
        }
        else if (msg.data.type === "compilationError") {
            this.currentTestTracker!.testCompletionTime = new Date().toString()
            this.resolveCurrentTracker!(this.currentTestTracker!);
            this.currentTestTracker!.testCases.forEach(tc => tc.onFailure("Compilation Failed"))
            this.currentTestTracker = null;
            this.updateState(RunnerState.READY);
            if (this.onError) this.onError(msg.data.value);
        }
        else if (msg.data.type === "compilationSuccess") { 
            this.updateState(RunnerState.RUNNING);
        }
           
        else if (msg.data.type === "testCaseResult") {
            if (!this.currentTestTracker)
                return;
            if (msg.data.error || msg.data.result !== this.currentTestTracker.testCases[msg.data.testCaseNum].expectedOutput)
                this.currentTestTracker.testCases[parseInt(msg.data.testCaseNum)].onFailure(msg.data.result);
            else if (this.currentTestTracker){
                this.currentTestTracker.testCases[parseInt(msg.data.testCaseNum)].onSuceess(msg.data.result);
                this.currentTestTracker.testPassed += 1;
            }
                
        }
        else if (msg.data.type === "testingCompeleted") {
            this.updateState(RunnerState.READY);
            this.currentTestTracker!.testCompletionTime = new Date().toString();
            this.resolveCurrentTracker!(this.currentTestTracker!);
            this.currentTestTracker = null;
        }
    }

    private handleError(err: ErrorEvent): void { 
        if (this.onError) {
            this.onError(err.message);
            this.updateState(RunnerState.ERROR);
        }
    }

    private updateState(state: RunnerState): void { 
        this.state = state;
        if (this.notifyRunnerState) this.notifyRunnerState(state);
    } 
}


// get a varible name thta's close to nameWanted but not refrenced in userCode
// It's a naive implimentation
function getVariableName(nameWanted: string, userCode: string): string {
    let outputName = "____GENERATED_" + nameWanted;
    while (userCode.includes(outputName)) {
        outputName += "_";
    }
    return outputName;
}
