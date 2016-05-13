
export class Base {
    location : Location
    // Location of code in file
    // Childrens, descendents of Abstract Data Tree
    constructor(location) {
      this.location = location;
    }

    // Generate code from AST
    generateCode() : String {
      console.log("undefined? generation of code");
      return ""
    }
}

// Basic program is a list of blocks
export class Program extends Base {
    name : String
    block : Block

    constructor(location, block : Block) {
      super(location)
      this.name = "$main"
      this.block = block
    }

    generateCode() : String {
      return "Program"
    }
}

// BEGIN Block
export class Block extends Base {
    variables : [Var]
    constants : [Const]
    functions : [Function]
    main : Block

    constructor(location, variables, constants, functions, main) {
      super(location)
      this.variables = variables
      this.constants = constants
      this.functions = functions
      this.main = main
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

export class Literal extends Base {
    value : Object
    type : String

    constructor(location, value, type) {
      super(location)
      this.value = value
      this.type = type
    }
}
