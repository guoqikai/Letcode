
export class Type { 
    static readonly INT: Type = new Type("int");
    static readonly FLOAT: Type = new Type("float");
    static readonly STRING: Type = new Type("string");
    static readonly BOOL: Type = new Type("bool");
    static DICT(keyType: Type, valueType: Type): Type { 
        if (![Type.INT, Type.FLOAT, Type.STRING, Type.BOOL].includes(keyType)) { 
            throw new Error("key must be immutable type");
        }
        if (!keyType || !valueType) { 
            throw new Error("key and value type must be specified!");
        }
        return new Type("dict", keyType, valueType);
    }
    static LIST(valueType: Type): Type { 
        if (!valueType) {
            throw new Error("value type must be specified!");
        }
        return new Type("list", undefined, valueType);
    }

    private constructor(public readonly selfType: string, public readonly keyType?: Type , public readonly valueType?: Type) { } 
}


export class VariableType {
    constructor(public readonly name: string, public readonly type: Type) { }
}

export class FunctionType {
    constructor(public readonly name: string, public readonly paramsType: VariableType[], public readonly returnType: VariableType) { }
}
