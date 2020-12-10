import { RunnerState, CodeRunner, TestTracker, TestCase } from "../code-runner"
import { FunctionType } from "../type";
import { LetCodeToCCodeMapper, CTypeMapper, CToLetCodeCodeMapper, CLetCodeCodeMapperFuncName } from "./c-mapper"

const testWarpingFunctionName: string = "___LETCODE_C_TEST_WARPING_FUNC"

export class CoderunnerCImpl implements CodeRunner {
    state: RunnerState = RunnerState.UNINIT;
    private interpreter_webworker?: Worker; 
    private onStdout?: (out: string) => void;
    private onError?: (err: string) => void;
    // sould bind to something that the run button and disable the run button when state is not READY
    private notifyRunnerState?: (state: RunnerState) => void;
    private currentTestTracker: TestTracker | null = null;
    init(notifyRunnerState: (state: RunnerState) => void, config?: Map<string, string> | undefined): void {
        this.notifyRunnerState = notifyRunnerState;
        //import webassembly
    }

    setConsole(onStdout?: (out: string) => void, onError?: (err: string) => void): void {
        this.onStdout = onStdout;
        this.onError = onError;
    }
    
    canSupportFunctionType(functionType: FunctionType): boolean {
        for (let varType of functionType.paramsType) { 
            if (!CTypeMapper.canBeMapped(varType.type))
                return false;
        }
        return CTypeMapper.canBeMapped(functionType.returnType.type)
    }

    getStarterCode(functionType: FunctionType): string {
        return `
        ${CTypeMapper.mapType(functionType.returnType.type)} ${functionType.name}(${functionType.paramsType.map(varType => CTypeMapper.mapType(varType.type) + ' ' + varType.name)
                            .join(", ")}):
                # Input your code here:
                return      `;
                }
                
    runTest(functionType: FunctionType, testCases: TestCase[], userCode: string): Promise<TestTracker> {
        throw new Error("Method not implemented.");
    }


    private updateState(state: RunnerState): void { 
        this.state = state;
        if (this.notifyRunnerState) this.notifyRunnerState(state);
    } 
    //We need to warp user's code in a function scope before passing it to the interpretor
    //so we can clean user defined vars after tests completed.

}