/*jshint esversion: 6 */
/*jshint node:true */

/**
 * TODO: Buscar en la biblio, algun preview para mas info
 * Types and Programming Languages -- Benjamin C. Pierce
 *
 * Los Constraints tambien se deben poner por aquí
 */


//data Type = Type String [Types] | Any String

class Type {
    constructor(nameIdentifier, childTypes) {
        this.name = nameIdentifier;
        this.childTypes = childTypes;
    }

    /**
     * Unifica los tipos, tiene en cuenta el "any"
     */
    unifyWith(otherType) {
        if (otherType.name === "any" || this.name === "any") {
            return true;
        }
        else {
            if (this.name !== otherType.name) {
                return false;
            }
            else {
                for (let i = 0; i < this.childTypes.length; i++) {
                    if (this.childTypes[i] !== otherType.childTypes[i]) {
                        return false;
                    }
                }
                return true;
            }
        }
    }
}


/**
 * La decision de que "any" sea un objeto de tipo conlleva sus riesgos
 * no es la mejor implementación
 */
let idAny = 0; // permite identificar diferentes any's ej: a -> a or a -> a1
exports.Any = () => new Type("any",[idAny++]);

/**
 * Implementa el tipo de una función input el tipo de entrada, y output el de salida
 */
exports.Func = (input, output) => new Type("Func", [input, output]);

/**
 * Un entero
 */
exports.Int  = new Type("Int", []);

/**
 * Booleano
 */
exports.Bool = new Type("Bool", []);

/**
 * Un caracter solo, es practicamente un int de 8bits sin signo
 * (o eso es lo que se pretende)
 */
exports.Char = new Type("Char", []);

/**
 * String representa una string en crudo
 */
exports.StringT = new Type("String");

/**
 * Representa un array que puede contener cualquier otro tipo, pero estos
 * elementos son todos del mismo tipo
 */
exports.ArrayT = (contains) => new Type("Array", [contains]);

/**
 * Se trata de un tipo nulo para expresiones que no devuelven nada, tales como el while
 */
exports.Void = new Type("()", []);
