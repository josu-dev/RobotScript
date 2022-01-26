//import toAst, {RInfoLexer, RInfoParser} from "../ast-generator.js";
const {RInfoLexer, RInfoParser} = require("../ast-generator");
const { test1 } = require("./testPrograms");
const program = `(3 + 4) * 2 >= 10`

const lexResult = RInfoLexer.tokenize(program);
const parser = new RInfoParser();
parser.input = lexResult;
const cst = parser.expression();
console.log(cst);
/*
for (t of test1) {
    const testResult = toAst(t.test);

    if (testResult.error) {
        console.log(`Error: ${testResult.errors}`);
        break;
    } else {
        console.log(`Test: ${t.name}, exitoso`);
    };
};*/

/*
    TODO
        agregar funciones como tipos elementales en expresiones
            fix test n2
        definitivamente mejorar las expresiones
            fix test n3
*/

/*
const testResult = toAst(test1[0].test);
console.log(testResult);
console.log(JSON.stringify(testResult, null, " "));
*/