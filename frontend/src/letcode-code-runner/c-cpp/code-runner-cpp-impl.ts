import { CodeRunner, TestTracker, RunnerState, TestCase } from "../code-runner"
import { FunctionType } from "../type";

export class CoderunnerCppImpl implements CodeRunner {
    state: RunnerState = RunnerState.UNINIT;
    init(notifyRunnerState: (state: import("../code-runner").RunnerState) => void, config?: Map<string, string> | undefined): void {
        throw new Error("Method not implemented.");
    }
    setConsole(onStdout?: ((out: string) => void) | undefined, onError?: ((err: string) => void) | undefined): void {
        throw new Error("Method not implemented.");
    }
    canSupportFunctionType(functionType: FunctionType): boolean {
        throw new Error("Method not implemented.");
    }
    getStarterCode(functionType: FunctionType): string {
        throw new Error("Method not implemented.");
    }
    runTest(functionType: FunctionType, testCases: TestCase[], userCode: string): Promise<TestTracker>  {
        throw new Error("Method not implemented.");
    }

}