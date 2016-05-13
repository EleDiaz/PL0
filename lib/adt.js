class Base {
    // Location of code in file
    // Childrens, descendents of Abstract Data Tree
    constructor(location) {
        this.location = location;
    }
    // Generate code from AST
    generateCode() {
        console.log("undefined? generation of code");
        return "";
    }
}
// Basic program is a list of blocks
class Program extends Base {
    constructor(location, block) {
        super(location);
        this.name = "$main";
        this.block = block;
    }
    generateCode() {
        return "Program";
    }
}
// BEGIN Block
class Block extends Base {
    constructor(location, variables, constants, functions, main) {
        super(location);
        this.variables = variables;
        this.constants = constants;
        this.functions = functions;
        this.main = main;
    }
}
class Const extends Base {
    constructor(location, name, value, type) {
        super(location);
        this.value = value;
        this.name = name;
    }
}
class Var extends Base {
    constructor(location, name, value, type) {
        super(location);
        this.value = value;
        this.name = name;
    }
}
class FunctionBlock extends Base {
    constructor(location, name, params, block) {
        super(location);
        this.name = name;
        this.params = params;
        this.block = block;
    }
}
// END Block
// BEGIN Statament
class Compound extends Base {
    constructor(location, statements) {
        super(location);
        this.statements = statements;
    }
}
class Assign extends Base {
    constructor(location, name, value) {
        super(location);
        this.name = name;
        this.value = value;
    }
}
class IfThenElse extends Base {
    constructor(location, cond, thenSt, elseSt) {
        super(location);
        this.cond = cond;
        this.thenSt = thenSt;
        this.elseSt = elseSt;
    }
}
class While extends Base {
    constructor(location, cond, statement) {
        super(location);
        this.cond = cond;
        this.statement = statement;
    }
}
class Return extends Base {
    constructor(location, returnSt) {
        super(location);
        this.returnSt = returnSt;
    }
}
class Operation extends Base {
    constructor(location, operation, operands) {
        super(location);
        this.operation = operation;
        this.operands = operands;
    }
}
class Literal extends Base {
    constructor(location, value, type) {
        super(location);
        this.value = value;
        this.type = type;
    }
}
