"use strict";

// SymbolTable [id, type]
// { vars:[string, "type"] }
import ADT = require('./adt')

interface ISymbol {
  value : Object
  id : string
  symbolTable? : SymbolTable
}

class SymbolTable {
  symbolTable : {}
  father : SymbolTable

  constructor() {
    this.symbolTable = {}
    this.father = null
  }

  addToSymbol(elem : Object, type : string) {
    if (this.symbolTable[elem["name"]]) {
        console.log("Warning: Overwriting variable");
    }
    this.symbolTable[elem["name"]] = type //Object.create(elem.name, {type: type})
  }
}

export let semantic = (tree : ADT.Program) => {
  tree.eachBlockPre(generateSymbolTable, null)
};

let generateSymbolTable = (block : ADT.Block, symbolTable) : SymbolTable => {
    let baseSymbolTable = new SymbolTable()
    symbolTable && (baseSymbolTable.father = symbolTable)
    block.variables.map((varE) => baseSymbolTable.addToSymbol(varE, "Var"))
    block.constants.map((varE) => baseSymbolTable.addToSymbol(varE, "Const"))
    block.functions.map((varE) => baseSymbolTable.addToSymbol(varE, "Function"))
    block["symbolTable"] = baseSymbolTable;
    console.log(baseSymbolTable)
    return baseSymbolTable
};
