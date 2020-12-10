import { CodeRunner } from "./code-runner";
import CoderunnerPythonImpl from "./python/code-runner-python-impl";
import { FunctionType } from "./type"

const codeRuners: Map<string, CodeRunner> = new Map();
codeRuners.set("Python", new CoderunnerPythonImpl());

export function getCodeRunner(lang: string): CodeRunner|undefined { 
    return codeRuners.get(lang)
}

export function getSupportedLang(func: FunctionType): string[] { 
    const langs:string[] = []
    codeRuners.forEach((value: CodeRunner, key: string) => {
        if (value.canSupportFunctionType(func)) { 
            langs.push(key);
        }
    });
    return langs;
}

export function getVersion(): string { 
    return "Ver 1.0.0";
}