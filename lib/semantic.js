/*jshint esversion: 6 */
/*jshint node:true */
"use strict";
// SymbolTable [id, type]
// { vars:[string, "type"] }
const ADT = require('./adt');

/**
 * A symbol table its storage information of differents scopes into tree.
 * This structure should into a tree
 */
class SymbolTable {
    constructor() {
        this.symbolTable = {};
        this.father = null;
    }

    findSymbol(symbol) {
        return true;
    }

    findSymbolInCurrentTable(a) {
        return false;
    }

    /**
     * Add a new symbol into symbol table and checks, overriding
     */
    addToSymbol(elem, type, properties) {
        if (this.findSymbolInCurrentTable(elem)) {
            throw new Error("Redifinition of symbol: " + elem);
        }
        if (this.findSymbol(elem)) {
            console.log("Shawdow a variable previously declared: " + elem);
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
