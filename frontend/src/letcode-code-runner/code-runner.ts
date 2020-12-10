import { FunctionType } from "./type"

export enum RunnerState { 
    READY = "ready",
    UNINIT = "uninitialized",
    INITING = "initializing",
    COMPILING = "compiling",
    RUNNING = "runing",
    ERROR = "error"
}

export interface CodeRunner { 
    readonly state: RunnerState;

    init(notifyRunnerState: (state: RunnerState) => void, config?: Map<string, string>): void;
    setConsole(onStdout?: (out: string) => void, onError?: (err: string) => void): void
    canSupportFunctionType(functionType: FunctionType): boolean;
    getStarterCode(functionType: FunctionType): string;
    runTest(functionType: FunctionType, testCases: TestCase[], userCode: string): Promise<TestTracker>
}

export class TestTracker {
    public testCompletionTime: string = "";
    public testPassed: number = 0;

    constructor(public readonly userCode: string,
        public readonly testCases: TestCase[],
        public readonly generatedCode: string,
        ) { }

}

export class TestCase { 
    constructor(public readonly inputs: string[],
        public readonly expectedOutput: string,
        public readonly onSuceess: (info: string) => void,
        public readonly onFailure: (err: string) => void) { }

}