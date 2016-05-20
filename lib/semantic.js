"use strict";
// SymbolTable [id, type]
// { vars:[string, "type"] }
const ADT = require('./adt');
class SymbolTable {
    constructor() {
        this.symbolTable = {};
        this.father = null;
    }
    addToSymbol(elem, type) {
        if (this.symbolTable[elem["name"]]) {
            console.log("Warning: Overwriting variable");
        }
        this.symbolTable[elem["name"]] = type; //Object.create(elem.name, {type: type})
    }
}
exports.semantic = (tree) => {
    tree.eachBlockPre(generateSymbolTable, null);
};
let generateSymbolTable = (block, symbolTable) => {
    let baseSymbolTable = new SymbolTable();
    symbolTable && (baseSymbolTable.father = symbolTable);
    if (block instanceof ADT.FunctionBlock) {
        block.params.map((varE) => baseSymbolTable.addToSymbol(varE, "Param"));
    }
    block.variables.map((varE) => baseSymbolTable.addToSymbol(varE, "Var"));
    block.constants.map((varE) => baseSymbolTable.addToSymbol(varE, "Const"));
    block.functions.map((varE) => baseSymbolTable.addToSymbol(varE, "Function"));
    block["symbolTable"] = baseSymbolTable;
    console.log(baseSymbolTable);
    return baseSymbolTable;
};
