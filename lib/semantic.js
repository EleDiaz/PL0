/*jshint esversion: 6 */
/*jshint node:true */
"use strict";
// SymbolTable [id, type]
// { vars:[string, "type"] }
const ADT = require('./adt');

exports.semantic = (tree) => {
    tree.eachBlockPre(generateSymbolTable, null);
};

let generateSymbolTable = (block, symbolTable) => {
    let baseSymbolTable = new SymbolTable();
    symbolTable && (baseSymbolTable.father = symbolTable);

	block.generateSymbolTableWith(baseSymbolTable);

    block.variables.map((varE) => baseSymbolTable.addToSymbol(varE, "Var"));
    block.constants.map((varE) => baseSymbolTable.addToSymbol(varE, "Const"));
    block.functions.map((varE) => baseSymbolTable.addToSymbol(varE, "Function"));
    block["symbolTable"] = baseSymbolTable;
    console.log(baseSymbolTable);
    return baseSymbolTable;
};
