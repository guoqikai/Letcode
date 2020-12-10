import { Type } from "./type"

export class CodeMapperAccumulator {
    vars: string[] = [];
    code: string = ""
}

// The accumlator(acc) can be useful if one line initialization of val is not supported by the target language
// i.e let's say user's input is {"a": 1, "b": 2} and the target language don't support one line init of dict
// we can only init a empty dict first, then insert all entries. Therefore we need append "user_dict = new dict()",
// "user_dict.insert("a", 1)" "user_dict.insert("b", "2")" to acc.code; Append "user_dict" to acc.vars and return 
// "user_dict". However, if one line init is supported we can just return "new dict {"a": 1, "b": 2}" and don't use 
// the accmulator at all.
export class CodeMapper {
    [key: string]: any;
    constructor(public int_?: (val: string, acc: CodeMapperAccumulator) => string,
        public float_?: (val: string, acc: CodeMapperAccumulator) => string,
        public string_?: (val: string, acc: CodeMapperAccumulator) => string,
        public bool_?: (val: string, acc: CodeMapperAccumulator) => string,
        public dict_?: (val: Map<string, string>, acc: CodeMapperAccumulator) => string,
        public list_?: (val: string[], acc: CodeMapperAccumulator) => string,
    ) { }

    mapCode(input: string, type: Type, acc?: CodeMapperAccumulator): string {
        if (!acc)
            acc = new CodeMapperAccumulator();
        if (input.length === 0)
            throw new Error("input is empty");

        if (!this[type.selfType + "_"])
            throw new Error(type.toString() + " is not supported");

        if (type.selfType === "dict") {
            if (input[0] !== "{" || input[input.length - 1] !== "}")
                throw new Error("expect dict, got " + input);
            const codeMap = new Map<string, string>();
            if (input.length === 2) 
                return this.dict_!(codeMap, acc);
            for (let kv of splitOutterMost(input.slice(1, -1), ",")) {
                const key_value = splitOutterMost(kv, ":");
                if (key_value.length !== 2)
                    throw new Error("expect key value pair but got " + kv);
                codeMap.set(this.mapCode(key_value[0], type.keyType!, acc),
                    this.mapCode(key_value[1], type.valueType!, acc));
            }
            return this.dict_!(codeMap, acc);
        }
        if (type.selfType === "list") {
            if (input[0] !== "[" || input[input.length - 1] !== "]")
                throw new Error("expect list, got " + input);
            if (input.length === 2) 
                return this.list_!([], acc);
            const codeList = splitOutterMost(input.slice(1, -1), ",")
                .map<string>(x => this.mapCode(x, type.valueType!, acc));
            return this.list_!(codeList, acc);
        }
        return this[type.selfType + "_"](input, acc);
    }
}

export class TypeMapper {
    [key: string]: any;
    constructor(public int_?: () => string,
        public float_?: () => string,
        public string_?: () => string,
        public bool_?: () => string,
        public dict_?: (key: string, value: string) => string,
        public list_?: (value: string) => string,
    ) { }

    mapType(type: Type): string {
        if (!this[type.selfType + "_"])
            throw new Error(type.selfType + " is not supported");

        if (type.selfType === "dict") {
            return this.dict_!(this.mapType(type.keyType!), this.mapType(type.valueType!));
        }
        if (type.selfType === "list") {
            return this.list_!(this.mapType(type.valueType!));
        }
        return this[type.selfType + "_"]();
    }

    canBeMapped(type: Type): boolean {
        if (type.selfType === "dict") {
            return this.dict_ !== undefined && this.canBeMapped(type.keyType!) && this.canBeMapped(type.valueType!);
        }
        if (this.selfType === "list") {
            return this.list_ !== undefined && this.canBeMapped(type.valueType!);
        }
        return this[type.selfType + "_"] !== undefined;
    }
}

function isPair(str1: string, str2: string) { 
    let l = [str1, str2];
    if (l.includes("{") && l.includes("}"))
        return true;
    if (l.includes("[") && l.includes("]"))
        return true;
    if (l.includes("(") && l.includes(")"))
        return true;
    return false;
}

function splitOutterMost(str: string, by: string): string[] {
    const strList: string[] = [];
    const brackets: string[] = [];
    let last = 0;
    for (let i = 0; i < str.length; i++) { 
        if (str[i] === by && brackets.length === 0) { 
            strList.push(str.slice(last, i).trim());
            last = i + 1;
        }
        else if (["[", "]", "{", "}", "(", ")"].includes(str[i])) {
            if (isPair(str[i], brackets[brackets.length - 1]))
                brackets.pop()
            else brackets.push(str[i]);
        }
    }
    strList.push(str.slice(last).trim());
    return strList
}
