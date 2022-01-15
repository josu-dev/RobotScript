const toAst = require("./parser");

const { test1 } = require("./testPrograms");


for (t of test1) {
    const testResult = toAst(t.test);

    if (testResult.error) {
        console.log(`Error: ${testResult.errors}`);
        break;
    } else {
        console.log(JSON.stringify(testResult.ast,null,"   "));
    };
};

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