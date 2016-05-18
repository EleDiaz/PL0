"use strict";
class Base {
    constructor(location) {
        this.location = location;
    }
    generateCode() {
        console.log("undefined? generation of code");
        return "";
    }
}
exports.Base = Base;
class Block extends Base {
    constructor(location, variables, constants, functions, main) {
        super(location);
        this.variables = variables;
        this.constants = constants;
        this.functions = functions;
        this.main = main;
    }
    eachBlockPre(callbackAction, args) {
        let newArgs = callbackAction(this, args);
        this.functions.map(fun => fun.eachBlockPre(callbackAction, newArgs));
    }
}
exports.Block = Block;
class Program extends Block {
    constructor(location, block) {
        super(location, block.variables, block.constants, block.functions, block.main);
        this.name = "$main";
    }
    generateCode() {
        return "Program";
    }
}
exports.Program = Program;
class Const extends Base {
    constructor(location, name, value, type) {
        super(location);
        this.value = value;
        this.name = name;
    }
}
exports.Const = Const;
class Var extends Base {
    constructor(location, name, value, type) {
        super(location);
        this.value = value;
        this.name = name;
    }
}
exports.Var = Var;
class FunctionBlock extends Block {
    constructor(location, name, params, block) {
        super(location, block.variables, block.constants, block.functions, block.main);
        this.name = name;
        this.params = params;
    }
}
exports.FunctionBlock = FunctionBlock;
class Compound extends Base {
    constructor(location, statements) {
        super(location);
        this.statements = statements;
    }
}
exports.Compound = Compound;
class Assign extends Base {
    constructor(location, name, value) {
        super(location);
        this.name = name;
        this.value = value;
    }
}
exports.Assign = Assign;
class IfThenElse extends Base {
    constructor(location, cond, thenSt, elseSt) {
        super(location);
        this.cond = cond;
        this.thenSt = thenSt;
        this.elseSt = elseSt;
    }
}
exports.IfThenElse = IfThenElse;
class While extends Base {
    constructor(location, cond, statement) {
        super(location);
        this.cond = cond;
        this.statement = statement;
    }
}
exports.While = While;
class Return extends Base {
    constructor(location, returnSt) {
        super(location);
        this.returnSt = returnSt;
    }
}
exports.Return = Return;
class Operation extends Base {
    constructor(location, operation, operands) {
        super(location);
        this.operation = operation;
        this.operands = operands;
    }
}
exports.Operation = Operation;
class Apply extends Base {
    constructor(location, name, params) {
        super(location);
        this.name = name;
        this.params = params;
    }
}
exports.Apply = Apply;
class Literal extends Base {
    constructor(location, value, type) {
        super(location);
        this.value = value;
        this.type = type;
    }
}
exports.Literal = Literal;
