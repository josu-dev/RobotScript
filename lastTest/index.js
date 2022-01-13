const { RIlexer, parser } = require("./parser");
const testPrograms = require("./testPrograms");

const lexResult = RIlexer.tokenize(testPrograms[1]);
parser.input(lexResult);
const testResult = parser.parse();

console.log(testResult);