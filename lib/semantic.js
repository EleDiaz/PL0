"use strict";
let addToSymbol = (symbolTable, elem, type) => {
    if (symbolTable[elem]) {
        console.log("Warning: Overwriting variable");
    }
    symbolTable[elem] = type;
};
let semantic = (tree) => {
    let baseSymbolTable = {};
    exports.eachBlockPre(tree, generateSymbolTable, baseSymbolTable);
};
let generateSymbolTable = (block, symbolTable) => {
    block.variables.map((varE) => addToSymbol(symbolTable, block, symbolTable));
    block.constants.map((varE) => addToSymbol(symbolTable, block, symbolTable));
};
exports.eachBlockPre = (tree, callbackAction, args) => {
    callbackAction(tree, args);
    tree.functions.map((value) => exports.eachBlockPre(value, callbackAction, args));
};
