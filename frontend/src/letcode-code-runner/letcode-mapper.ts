import { CodeMapper, TypeMapper } from "./mapper"

// this is an example of how code mapping work, we are mapping user's input to LetCode standard form(it's syntex is similar to python)
// It checkes if user's input can be mapped to this type during the mapping.
const mapDict = (val: Map<string, string>) => {
    const pairs: String[] = []
    val.forEach((v, k) => pairs.push(k + ":" + v))
    return "{" + pairs.join(",") + "}"
}

const mapList = (val: string[]) => {
    return "[" + val.join(",") + "]";
}

const mapInt = (val: string) => {
    if (!(/^\-?(0|[1-9]\d*)$/).test(val))
        throw new Error("expect int, got " + val);
    return val
}

const mapFloat = (val: string) => {
    if (!(/^\-?[\d]*(\.[\d]+)?$/g).test(val))
        throw new Error("expect float, got " + val);
    const f = String(parseInt(val));
    if (f === val)
        return f + ".0";
    return String(parseFloat(val));
}

const mapString = (val: string) => {
    if (val.length < 2 || (val[0] !== val[val.length - 1])|| (val[0] !== "\'" && val[0] !== "\""))
        throw new Error("expect string, got " + val);
    return "'" + val.slice(1, -1) + "'";
}

const mapBool = (val: string) => {
    if (!["True", "False", "true", "false"].includes(val))
        throw new Error("expect boolean, got " + val);
    if (["True", "true"].includes(val))
        return "true";
    return "false";
}

const StringToLetCodeCodeMapper = new CodeMapper(mapInt, mapFloat, mapString, mapBool, mapDict, mapList)
 
// This is the type annotations mapping of LetCode standard form
const LetCodeTypeMapper =
    new TypeMapper(
        () => "int",
        () => "float",
        () => "string",
        () => "bool",
        (key, val) => "dict<" + key + "," + val + ">",
        (val) => "list<" + val + ">"
    )

export { StringToLetCodeCodeMapper, LetCodeTypeMapper }
 
