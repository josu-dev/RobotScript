const toAst = require("./parser");

const { testPrograms } = require("./testPrograms")

const testResult = toAst(testPrograms[0]);

//console.log(testResult);
console.log(JSON.stringify(testResult, null, " "));