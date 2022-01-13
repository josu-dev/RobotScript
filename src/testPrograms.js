const testPrograms = [
    `programa P1_1
    procesos
      proceso juntarFlor (ES flor: numero; ES noFlor: numero)
      comenzar
        si (HayFlorEnLaEsquina) {
          mientras (HayFlorEnLaEsquina){
            tomarFlor()
            flor:= flor + 1
          }
        }
        sino {
          noFlor:= noFlor +1
        }
      fin
    areas
        cuadrante : AreaC(5,5,5,5)
      ciudad : AreaP(1,1,1,100)
    robots 
      robot tipo1
      variables
        flor: numero
        noFlor: numero
      comenzar
        flor:= 0
        noFlor:= 0
        juntarFlor(flor, noFlor)
        repetir (99){
          mover()
          juntarFlor(flor, noFlor)}
        repetir (flor){
          depositarFlor()}
        Informar(flor)
        Informar(noFlor)
      fin
    variables 
      robot1: tipo1
      ro: tipo3
    comenzar 
    AsignarArea(robot1,ciudad)
      AsignarArea(robot1,ciudad)
      Iniciar(robot1, 1, 1)
    fin`,
    `programa P1_1
    areas
      ciudad : AreaP(1,1,1,100)
    variables 
      robot1: tipo1
    comenzar 
      AsignarArea(robot1,ciudad)
      Iniciar(robot1, 1, 1)
    fin`,
    `programa P1_1
    procesos
      proceso juntarFlor (ES flor: numero; ES noFlor: numero)
      comenzar
        si (HayFlorEnLaEsquina) {
          mientras (HayFlorEnLaEsquina){
            tomarFlor()
            flor:= flor + 1
          }
        }
        sino {
          noFlor:= noFlor +1
        }
      fin
    areas
      ciudad : AreaP(1,1,1,100)
    robots 
      robot tipo1
      variables
        flor: numero
        noFlor: numero
      comenzar
        flor:= 0
        noFlor:= 0
        juntarFlor(flor, noFlor)
        repetir (99){
          mover()
          juntarFlor(flor, noFlor)}
        repetir (flor){
          depositarFlor()}
        Informar(flor)
        Informar(noFlor)
      fin
    variables 
      robot1: tipo1
    comenzar 
      AsignarArea(robot1,ciudad)
      Iniciar(robot1, 1, 1)
    fin`,
    ``
];
module.exports = {
    testPrograms
}

const inputText = `programa P1_1
procesos
  proceso juntarFlor (ES flor: numero; ES noFlor: numero)
  comenzar
    si (HayFlorEnLaEsquina) {
      mientras (HayFlorEnLaEsquina){
        tomarFlor()
        flor:= flor + 1
      }
    }
    sino {
      noFlor:= noFlor +1
    }
  fin
areas
  ciudad : AreaP(1,1,1,100)
robots 
  robot tipo1
  variables
    flor: numero
    noFlor: numero
  comenzar
    flor:= 0
    noFlor:= 0
    juntarFlor(flor, noFlor)
    repetir (99){
      mover()
      juntarFlor(flor, noFlor)}
    repetir (flor){
      depositarFlor()}
    Informar(flor)
    Informar(noFlor)
  fin
variables 
  robot1: tipo1
comenzar 
  AsignarArea(robot1,ciudad)
  Iniciar(robot1, 1, 1)
fin`;
/*
const lexResult = RInfoLexer.tokenize(inputText);
parserInstance.input = lexResult.tokens;

console.log(lexResult.tokens);
const cst = parserInstance.program();

console.log(parserInstance.errors);
console.log(JSON.stringify(cst,null," "));
*/
/*
class RInfoToAstVisitor extends BaseRInfoVisitor {
    constructor(){
        super();
        this.validateVisitor();
    }

    section_Name(ctx) {
        return ctx.Identifier[0].image
    };

    section_Procedures(ctx) {
        let procedures = this.visit(ctx.declaration_Procedure)
        return {
            type : "PROCEDURES",
            value : procedures
        }
    };
    declaration_Procedure(ctx) {
        const reference = ctx.Identifier[0].image;
        let parameters = this.visit(ctx.declaration_Parameter);
        const localVariables = this.visit(ctx.section_Vars_Value);
        const instructions = this.visit(ctx.statement)

        return {
            type : "PROCEDURE",
            value : {
                reference : reference,
                parameters : parameters,
                variables : localVariables,
                body : instructions
            }
        }
    }


    parse(ctx) {
        const PROGRAM_NAME = this.visit(ctx.section_Name);
        let PROCEDURES;
        if (ctx.section_Procedures) {
            PROCEDURES = this.visit(ctx.section_Procedures)
        };
        const AREAS = this.visit(ctx.section_Areas);
        const ROBOTS = this.visit(ctx.section_Robots);
        const VARIABLES = this.visit(ctx.section_Vars_Robot);
        const MAIN = this.visit(ctx.section_main);

        return {
            type: "program",
            value: {
                PROGRAM_NAME,
                PROCEDURES,
                AREAS,
                ROBOTS,
                VARIABLES,
                MAIN
            }
        };
    }

}

const toAstVisitorInstance = new RInfoToAstVisitor();

function toAst(inputText) {
    // Lexing
    const lexResult = RInfoLexer.tokenize(inputText);
    parserInstance.input = lexResult.tokens;

    // Parsing
    const cst = parserInstance.parse();
    if (parserInstance.errors.length > 0) {
        return parserInstance.errors;
    }

    // Visiting
    const ast = toAstVisitorInstance.visit(cst)
    return ast
}
*/

/*

const inputText = `programa P1_1
procesos
  proceso juntarFlor (ES flor: numero; ES noFlor: numero)
  comenzar
    si (HayFlorEnLaEsquina) {
      mientras (HayFlorEnLaEsquina){
        tomarFlor()
        flor:= flor + 1
      }
    }
    sino {
      noFlor:= noFlor +1
    }
  fin
areas
    cuadrante : AreaC(5,5,5,5)
  ciudad : AreaP(1,1,1,100)
robots 
  robot tipo1
  variables
    flor: numero
    noFlor: numero
  comenzar
    flor:= 0
    noFlor:= 0
    juntarFlor(flor, noFlor)
    repetir (99){
      mover()
      juntarFlor(flor, noFlor)}
    repetir (flor){
      depositarFlor()}
    Informar(flor)
    Informar(noFlor)
  fin
variables 
  robot1: tipo1
  ro: tipo3
comenzar 
AsignarArea(robot1,ciudad)
  AsignarArea(robot1,ciudad)
  Iniciar(robot1, 1, 1)
fin`;

const astResult = toAst(inputText);

//console.log(astResult);
console.log(JSON.stringify(astResult, null, " "));
*/