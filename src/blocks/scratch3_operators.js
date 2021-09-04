const Cast = require('../util/cast.js');
const MathUtil = require('../util/math-util.js');

class Scratch3OperatorsBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            operator_add: this.add,
            operator_subtract: this.subtract,
            operator_multiply: this.multiply,
            operator_divide: this.divide,
            operator_lt: this.lt,
            operator_equals: this.equals,
            operator_gt: this.gt,
            operator_and: this.and,
            operator_or: this.or,
            operator_not: this.not,
            operator_random: this.random,
            operator_join: this.join,
            operator_letter_of: this.letterOf,
            operator_length: this.length,
            operator_contains: this.contains,
            operator_mod: this.mod,
            operator_round: this.round,
            operator_mathop: this.mathop
        };
    }

    add (args) {
        console.log(Cast.toNumber(args.NUM1) +"+"+ Cast.toNumber(args.NUM2));
        return Cast.toNumber(args.NUM1) + Cast.toNumber(args.NUM2);
    }

    subtract (args) {
        console.log(Cast.toNumber(args.NUM1) +"-"+ Cast.toNumber(args.NUM2));
        return Cast.toNumber(args.NUM1) - Cast.toNumber(args.NUM2);
    }

    multiply (args) {
        console.log(Cast.toNumber(args.NUM1) +"*"+ Cast.toNumber(args.NUM2));
        return Cast.toNumber(args.NUM1) * Cast.toNumber(args.NUM2);
    }

    divide (args) {
        console.log(Cast.toNumber(args.NUM1) +"/"+ Cast.toNumber(args.NUM2));
        return Cast.toNumber(args.NUM1) / Cast.toNumber(args.NUM2);
    }

    lt (args) {
        console.log(args.OPERAND1+"<"+args.OPERAND2);
        return Cast.compare(args.OPERAND1, args.OPERAND2) < 0;
    }

    equals (args) {
        console.log(args.OPERAND1+"="+args.OPERAND2);
        return Cast.compare(args.OPERAND1, args.OPERAND2) === 0;
    }

    gt (args) {
        console.log(args.OPERAND1+">"+args.OPERAND2);
        return Cast.compare(args.OPERAND1, args.OPERAND2) > 0;
    }

    and (args) {
        console.log(args.OPERAND1+"かつ"+args.OPERAND2);
        return Cast.toBoolean(args.OPERAND1) && Cast.toBoolean(args.OPERAND2);
    }

    or (args) {
        console.log(args.OPERAND1+"または"+args.OPERAND2);
        return Cast.toBoolean(args.OPERAND1) || Cast.toBoolean(args.OPERAND2);
    }

    not (args) {
        console.log(args.OPERAND+"ではない");
        return !Cast.toBoolean(args.OPERAND);
    }

    random (args) {
        const nFrom = Cast.toNumber(args.FROM);
        const nTo = Cast.toNumber(args.TO);
        const low = nFrom <= nTo ? nFrom : nTo;
        const high = nFrom <= nTo ? nTo : nFrom;
        if (low === high) return low;
        console.log(args.FROM+"から"+args.TO+"までの乱数");
        // If both arguments are ints, truncate the result to an int.
        if (Cast.isInt(args.FROM) && Cast.isInt(args.TO)) {
            return low + Math.floor(Math.random() * ((high + 1) - low));
        }
        return (Math.random() * (high - low)) + low;
    }

    join (args) {
        console.log(args.STRING1+"と"+args.STRING2);
        return Cast.toString(args.STRING1) + Cast.toString(args.STRING2);
    }

    letterOf (args) {
        console.log(args.STRING+"の"+args.LETTER+"番目の文字");
        const index = Cast.toNumber(args.LETTER) - 1;
        const str = Cast.toString(args.STRING);
        // Out of bounds?
        if (index < 0 || index >= str.length) {
            return '';
        }
        return str.charAt(index);
    }

    length (args) {
        console.log(args.STRING+"の長さ");
        return Cast.toString(args.STRING).length;
    }

    contains (args) {
        console.log(args.STRING1+"に"+args.STRING+"が含まれる");
        const format = function (string) {
            return Cast.toString(string).toLowerCase();
        };
        return format(args.STRING1).includes(format(args.STRING2));
    }

    mod (args) {
        console.log(args.NUM1+"を"+arguments.NUM2+"で割った余り");
        const n = Cast.toNumber(args.NUM1);
        const modulus = Cast.toNumber(args.NUM2);
        let result = n % modulus;
        // Scratch mod uses floored division instead of truncated division.
        if (result / modulus < 0) result += modulus;
        return result;
    }

    round (args) {
        console.log(args.NUM+"を四捨五入");
        return Math.round(Cast.toNumber(args.NUM));
    }

    mathop (args) {
        const operator = Cast.toString(args.OPERATOR).toLowerCase();
        const n = Cast.toNumber(args.NUM);
        switch (operator) {
        case 'abs': return Math.abs(n);
        case 'floor': return Math.floor(n);
        case 'ceiling': return Math.ceil(n);
        case 'sqrt': return Math.sqrt(n);
        case 'sin': return parseFloat(Math.sin((Math.PI * n) / 180).toFixed(10));
        case 'cos': return parseFloat(Math.cos((Math.PI * n) / 180).toFixed(10));
        case 'tan': return MathUtil.tan(n);
        case 'asin': return (Math.asin(n) * 180) / Math.PI;
        case 'acos': return (Math.acos(n) * 180) / Math.PI;
        case 'atan': return (Math.atan(n) * 180) / Math.PI;
        case 'ln': return Math.log(n);
        case 'log': return Math.log(n) / Math.LN10;
        case 'e ^': return Math.exp(n);
        case '10 ^': return Math.pow(10, n);
        }
        console.log(args.NUM+"の"+args.OPERATOR);
        return 0;
    }
}

module.exports = Scratch3OperatorsBlocks;
