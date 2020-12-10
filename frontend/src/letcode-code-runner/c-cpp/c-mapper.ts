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

const LetCodeToCCodeMapper =
    new CodeMapper(
        (val: string) => val,
        (val: string) => val,
        (val: string) => val,
        mapBool,
        mapDict,
        mapList
    );

const CTypeMapper =
    new TypeMapper(
        () => "int",
        () => "float",
        () => "str",
        () => "bool",
        // (key, val) => "[" + key + "," + val + "]",
        (val) => "[" + val + "]"
    );

const CLetCodeCodeMapperFuncName = "____letcode_code_mapper____"

const CToLetCodeCodeMapper =
`any ${CLetCodeCodeMapperFuncName}(c_object):
    if (type(c_object) == array{
        str code = "["
        for (i=0; i<=c_object.size(), i++)
            code += ${CLetCodeCodeMapperFuncName}(i) + ","
        code[-1] = "]"
        return code
    }
        
    if (type(c_object) == bool){
        if (c_object){
            return "true"
        }         
        return "false"
    }  
    return str(c_object)
    `;


export { LetCodeToCCodeMapper, CTypeMapper, CToLetCodeCodeMapper, CLetCodeCodeMapperFuncName}