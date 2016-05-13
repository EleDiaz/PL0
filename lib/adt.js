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
class Function extends Base {
    constructor(location, name, params, block) {
        super(location);
        this.name = name;
        this.params = params;
        this.block = block;
    }
}
// END Block
// BEGIN Statament
class Statement extends Base {
}
class Assign extends Statement {
}
class Call extends Statement {
}
class IfThenElse extends Statement {
}
class While extends Statement {
}
// END statement
// BEGIN condition
class Condition extends Base {
}
// END condition
class Expresion extends Base {
}
class Term extends Base {
}
class Factor extends Base {
}
