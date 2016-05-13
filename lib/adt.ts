
class Base {
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
class Program extends Base {
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
class Block extends Base {
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

class Const extends Base {
    name : String
    value : Object
    type : String

    constructor(location, name, value, type) {
      super(location)
      this.value = value
      this.name = name
    }
}

class Var extends Base {
    name : String
    value : Object
    type : String

    constructor(location, name, value, type) {
      super(location)
      this.value = value
      this.name = name
    }
}

class FunctionBlock extends Base {
    name : String
    params : [String]
    block : Block

    constructor(location, name, params, block) {
      super(location)
      this.name = name
      this.params = params
      this.block = block
    }
}
// END Block

// BEGIN Statament
class Compound extends Base {
    statements : [Object]

    constructor(location, statements) {
      super(location)
      this.statements = statements
    }
}

class Assign extends Base {
    name : String
    value : Object

    constructor(location, name, value) {
      super(location)
      this.name = name
      this.value = value
    }
}

class IfThenElse extends Base {
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

class While extends Base {
    cond : Object
    statement : Object

    constructor(location, cond, statement) {
      super(location)
      this.cond = cond
      this.statement = statement
    }
}

class Return extends Base {
    returnSt : Object | void
    constructor(location, returnSt) {
      super(location)
      this.returnSt = returnSt
    }
}

class Operation extends Base {
    operation : String
    operands : [Operation]

    constructor(location, operation, operands) {
      super(location)
      this.operation = operation
      this.operands = operands
    }
}

class Literal extends Base {
    value : Object
    type : String

    constructor(location, value, type) {
      super(location)
      this.value = value
      this.type = type
    }
}
