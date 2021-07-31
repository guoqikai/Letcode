import { CodeMapper, TypeMapper } from "../mapper"

const mapDict = (val: Map<string, string>) => {
    const pairs: String[] = []
    val.forEach((v, k) => pairs.push(k + ":" + v))
    return "{" + pairs.join(",") + "}"
}

const mapList = (val: string[]) => {
    return "[" + val.join(",") + "]";
}

const mapBool = (val: string) => {
    if (val === "true")
        return "True";
    return "False";
}

const LetCodeToPythonCodeMapper =
    new CodeMapper(
        (val: string) => val,
        (val: string) => val,
        (val: string) => val,
        mapBool,
        mapDict,
        mapList
    );

const PythonTypeMapper =
    new TypeMapper(
        () => "int",
        () => "float",
        () => "str",
        () => "bool",
        (key, val) => "[" + key + "," + val + "]",
        (val) => "[" + val + "]"
    );

const PythonLetCodeCodeMapperFuncName = "____letcode_code_mapper____"

const PythonToLetCodeCodeMapper =
`def ${PythonLetCodeCodeMapperFuncName}(python_object: any) -> str:
    if type(python_object) == dict:
        return "{" + ",".join([${PythonLetCodeCodeMapperFuncName}(k) + ":" + ${PythonLetCodeCodeMapperFuncName}(v) for (k, v) in python_object.items()]) + "}"
    if type(python_object) == list:
        return "[" + ",".join([${PythonLetCodeCodeMapperFuncName}(v) for v in python_object])  + "]"
    if type(python_object) == bool:
        if python_object:
            return "true"
        return "false"
    return str(python_object)
    `;


export { LetCodeToPythonCodeMapper, PythonTypeMapper, PythonToLetCodeCodeMapper, PythonLetCodeCodeMapperFuncName}