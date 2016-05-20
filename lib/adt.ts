
export class Base {
    // Location of code in file
    location : Location
    constructor(location) {
      this.location = location;
    }

    // Generate code from AST
    generateCode() : String {
      console.log("undefined? generation of code");
      return ""
    }
}

// BEGIN Block
export class Block extends Base {
    variables : [Var]
    constants : [Const]
    functions : [FunctionBlock]
    main : Block

    constructor(location, variables, constants, functions, main) {
      super(location)
      this.variables = variables
      this.constants = constants
      this.functions = functions
      this.main = main
    }

    eachBlockPre(callbackAction : (program : Block, any) => any, args : any) {
      let newArgs = callbackAction(this, args)
      this.functions.map(fun => fun.eachBlockPre(callbackAction, newArgs))
     }
}

// Basic program is a list of blocks
export class Program extends Block {
    name : String

    constructor(location, block : Block) {
      super(location, block.variables, block.constants, block.functions, block.main)
      this.name = "$main"
    }

    generateCode() : String {
      return "Program"
    }
}

export class Const extends Base {
    name : String
    value : Object
    type : String

    constructor(location, name, value, type) {
      super(location)
      this.value = value
      this.name = name
    }
}

export class Var extends Base {
    name : String
    value : Object
    type : String

    constructor(location, name, value, type) {
      super(location)
      this.value = value
      this.name = name
    }
}

export class FunctionBlock extends Block {
    name : String
    params : [String]

    constructor(location, name, params, block : Block) {
      super(location, block.variables, block.constants, block.functions, block.main)
      this.name = name
      this.params = params
    }

}
// END Block

// BEGIN Statament
export class Compound extends Base {
    statements : [Object]

    constructor(location, statements) {
      super(location)
      this.statements = statements
    }
}

export class Assign extends Base {
    name : String
    value : Object

    constructor(location, name, value) {
      super(location)
      this.name = name
      this.value = value
    }
}

export class IfThenElse extends Base {
    cond : Object
    thenSt : Object
    elseSt : Object

    constructor(location, cond, thenSt, elseSt) {
      super(location)
      this.cond = cond
      this.thenSt = thenSt
      this.elseSt = elseSt
    }
}

export class While extends Base {
    cond : Object
    statement : Object

    constructor(location, cond, statement) {
      super(location)
      this.cond = cond
      this.statement = statement
    }
}

export class Return extends Base {
    returnSt : Object | void
    constructor(location, returnSt) {
      super(location)
      this.returnSt = returnSt
    }
}

export class Operation extends Base {
    operation : String
    operands : [Operation]

    constructor(location, operation, operands) {
      super(location)
      this.operation = operation
      this.operands = operands
    }
}

export class Apply extends Base {
    name : String
    params : [Object]

    constructor(location, name, params) {
      super(location)
      this.name = name
      this.params = params
    }
}

export enum BasicTypes {
	Int,
	Arr
}

export class Literal extends Base {
    value : Object
    type : String

    constructor(location, value, type) {
      super(location)
      this.value = value
      this.type = type
    }
}
