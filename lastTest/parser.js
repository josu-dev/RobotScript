const { CstParser, Lexer, createToken } = require("chevrotain")

const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED
});

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

const Natural = createToken({ name: "Natural", pattern: /0|[1-9]\d*/ });
const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });
const Boolean = createToken({
    name: "Boolean",
    pattern: /V|F/,
    longer_alt: Identifier
});
const String =createToken({
    name: "String",
    pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
});

const Else = createToken({
    name: "Else",
    pattern: /sino/,
    longer_alt: Identifier
  });
const If = createToken({
  name: "If",
  pattern: /si/,
  longer_alt: Identifier
});
const For = createToken({
  name: "For",
  pattern: /repetir/,
  longer_alt: Identifier
});
const While = createToken({
  name: "While",
  pattern: /mientras/,
  longer_alt: Identifier
});

const Comma = createToken({ name: "Comma", pattern: /,/ });
const DotComma = createToken({ name: "DotComma", pattern: /;/ });
const Asignation = createToken({ name: "Asignation", pattern: /:=/ });
const DDot = createToken({ name: "DDot", pattern: /:/ });

const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });

const GET = createToken({ name: "GET", pattern: />=/ });
const LET = createToken({ name: "LET", pattern: /<=/ });
const GT = createToken({ name: "GT", pattern: />/ });
const LT = createToken({ name: "LT", pattern: /</ });
const Equal = createToken({ name: "Equal", pattern: /=/ });


const AdditionOperator = createToken({
    name: "AdditionOperator",
    pattern: Lexer.NA
});
const Plus = createToken({
    name: "Plus",
    pattern: /\+/,
    categories: AdditionOperator
});
const Minus = createToken({
    name: "Minus",
    pattern: /-/,
    categories: AdditionOperator
});
const MultiplicationOperator = createToken({
    name: "MultiplicationOperator",
    pattern: Lexer.NA
});
const Mult = createToken({
    name: "Multi",
    pattern: /\*/,
    categories: MultiplicationOperator
});
const Div = createToken({
    name: "Div",
    pattern: /\//,
    categories: MultiplicationOperator
});

const Or = createToken({ name: "Or", pattern: /\|/ });
const And = createToken({ name: "And", pattern: /\&/ });
const Not = createToken({ name: "Not", pattern: /\~/ });

const Begin = createToken({
    name: "Begin",
    pattern: /comenzar/,
    longer_alt: Identifier
});
const End = createToken({
    name: "End",
    pattern: /fin/,
    longer_alt: Identifier
});

const Program = createToken({
    name: "Program",
    pattern: /programa/,
    longer_alt: Identifier
});

const Procedures = createToken({
    name: "Procedures",
    pattern: /procesos/,
    longer_alt: Identifier
});
const Procedure = createToken({
    name: "Procedure",
    pattern: /proceso/,
    longer_alt: Identifier
});
const TypeParameter = createToken({
    name: "TypeParameter",
    pattern: /ES|E/,
    longer_alt: Identifier
});

const Variables = createToken({
    name: "Variables",
    pattern: /variables/,
    longer_alt: Identifier
});
const TypeValue = createToken({
    name: "VariableType",
    pattern: /boolean|numero/,
    longer_alt: Identifier
});

const Areas = createToken({
    name: "Areas",
    pattern: /areas/,
    longer_alt: Identifier
});
const AreaType = createToken({
    name: "AreaType",
    pattern: /AreaPC|AreaP|AreaC/,
    longer_alt: Identifier
});

const Robots = createToken({
    name: "Robots",
    pattern: /robots/,
    longer_alt: Identifier
});
const Robot = createToken({
    name: "Robot",
    pattern: /robot/,
    longer_alt: Identifier
});

const AsignArea = createToken({
    name: "AsignArea",
    pattern: /AsignarArea/,
    longer_alt: Identifier
});
const InitRobot = createToken({
    name: "InitRobot",
    pattern: /Iniciar/,
    longer_alt: Identifier
});

const ReservedFunction = createToken({
    name: "ReservedFunction",
    pattern: Lexer.NA
});
const ConsultItem = createToken({
    name: "ConsultItem",
    pattern: /[Hay][Papel]|[Flor][EnLa][Esquina]|[Bolsa]/,
    longer_alt: Identifier,
    categories: ReservedFunction
});
const ConsultPosition = createToken({
    name: "ConsultPosition",
    pattern: /[Pos][Ca]|[Av]/,
    longer_alt: Identifier,
    categories: ReservedFunction
});

const TakeItem = createToken({
    name: "TakeItem",
    pattern: /tomar(Flor)|(Papel)/,
    longer_alt: Identifier
});
const DepositItem = createToken({
    name: "DepositItem",
    pattern: /depositarFlor|depositarPapel/,
    longer_alt: Identifier
});

const ChangePosition = createToken({
    name: "ChangePosition",
    pattern: /Pos/,
    longer_alt: Identifier
});

const Movement = createToken({
    name: "Movement",
    pattern: /mover/,
    longer_alt: Identifier
});

const ChangeOrientation = createToken({
    name: "ChangeOrientation",
    pattern: /derecha/,
    longer_alt: Identifier
});

const Inform = createToken({
    name: "Inform",
    pattern: /Informar/,
    longer_alt: Identifier
});

const GenerateNumber = createToken({
    name: "GenerateNumber",
    pattern: /Random/,
    longer_alt: Identifier
});

const Message = createToken({
    name: "Message",
    pattern: /[Enviar]|[Recibir]Mensaje/,
    longer_alt: Identifier
});
const ControlCorner = createToken({
    name: "ControlCorner",
    pattern: /[Bloquear]|[Liberar]Esquina/,
    longer_alt: Identifier
});

const allTokens = [
    WhiteSpace,

    Program,

    Procedures,
    Procedure,
    TypeParameter,

    Areas,
    Variables,
    TypeValue,

    AreaType,

    Robots,
    Robot,

    Begin,
    End,

    Else,
    If,
    For,
    While,

    AsignArea,
    InitRobot,

    Boolean,
    Integer,

    ReservedFunction,
    ConsultItem,
    ConsultPosition,
    TakeItem,
    DepositItem,
    ChangePosition,
    Movement,
    ChangeOrientation,
    Inform,
    GenerateNumber,
    Message,
    ControlCorner,

    String,

    Identifier,

    Comma,
    DotComma,
    Asignation,
    DDot,

    LParen,
    RParen,
    LCurly,
    RCurly,

    GET,
    LET,
    GT,
    LT,
    Equal,

    Plus,
    Minus,
    AdditionOperator,
    Mult,
    Div,
    MultiplicationOperator,

    Or,
    And,
    Not
];


const lexerConfig = ({
    positionTracking: "onlyStart"
});
const RInfoLexer = new Lexer(allTokens, lexerConfig);


class RInfoParser extends CstParser {
    constructor() {
        super(allTokens);
        
        const $ = this;

        $.RULE("section_Vars_Value", () => {
            $.CONSUME(Variables)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_Var_Value)
            })
        });
        $.RULE("declaration_Var_Value", () => {
            $.CONSUME(Identifier)
            $.CONSUME(DDot)
            $.CONSUME(TypeValue)
        });

        $.RULE("statement", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.ifStatement) },
                { ALT: () => $.SUBRULE($.forStatement) },
                { ALT: () => $.SUBRULE($.whileStatement) },
                { ALT: () => $.SUBRULE($.blockStatement) },
                { ALT: () => $.SUBRULE($.assignStatement) },
                { ALT: () => $.SUBRULE($.callStatement) }
            ])
        })
        $.RULE("ifStatement", () => {
            $.CONSUME(If)
            $.SUBRULE($.paren_expr)
            $.SUBRULE($.statement)
            $.OPTION(() => {
                $.CONSUME(Else)
                $.SUBRULE2($.statement)
            })
        })
        $.RULE("forStatement", () => {
            $.CONSUME(For)
            $.SUBRULE($.paren_expr)
            $.SUBRULE($.statement)
        })
        $.RULE("whileStatement", () => {
            $.CONSUME(While)
            $.SUBRULE($.paren_expr)
            $.SUBRULE($.statement)
        })
        $.RULE("blockStatement", () => {
            $.CONSUME(LCurly)
            $.MANY(() => {
              $.SUBRULE($.statement)
            })
            $.CONSUME(RCurly)
        })
        $.RULE("assignStatement", () => {
            $.CONSUME(Identifier)
            $.CONSUME(Asignation)
            $.SUBRULE($.expression)
        });
        $.RULE("callStatement", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.reservedProcedure) },
                { ALT: () => $.SUBRULE($.userProcedure) }
            ])
        });
        $.RULE("reservedProcedure", () => {
            $.OR([
                { ALT: () => $.CONSUME(Movement) },
                { ALT: () => $.CONSUME(TakeItem) },
                { ALT: () => $.CONSUME(DepositItem) },
                { ALT: () => $.CONSUME(ChangeOrientation) },
                { ALT: () => $.CONSUME(ChangePosition) },
                { ALT: () => $.CONSUME(GenerateNumber) },
                { ALT: () => $.CONSUME(Inform) },
            ])
            $.CONSUME(LParen)
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.SUBRULE($.expression)
                }
            })
            $.CONSUME(RParen)
        });
        $.RULE("userProcedure", () => {
            $.CONSUME(Identifier)
            $.CONSUME(LParen)
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.SUBRULE($.expression)
                }
            })
            $.CONSUME(RParen)
        });
      
        $.RULE("expression", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.assignExpression) },
                { ALT: () => $.SUBRULE($.relationExpression) }
            ])
        })
        $.RULE("relationExpression", () => {
            $.SUBRULE($.AdditionExpression)
            $.MANY(() => {
                $.CONSUME(LT)
                $.SUBRULE2($.AdditionExpression)
            })
        })
        $.RULE("AdditionExpression", () => {
            $.SUBRULE($.term)
            $.MANY(() => {
                $.OR([
                    { ALT: () => $.CONSUME(Plus) },
                    { ALT: () => $.CONSUME(Minus) }
                ])
                $.SUBRULE2($.term)
            })
        })
        $.RULE("assignExpression", () => {
            $.CONSUME(Identifier)
            $.CONSUME(Equal)
            $.SUBRULE($.expression)
          })
        $.RULE("term", () => {
            $.OR([
                { ALT: () => $.CONSUME(Identifier) },
                { ALT: () => $.CONSUME(Integer) },
                { ALT: () => $.SUBRULE($.paren_expr) }
            ])
        })
        $.RULE("paren_expr", () => {
            $.CONSUME(LParen)
            $.SUBRULE($.expression)
            $.CONSUME(RParen)
        })

        // Main
        $.RULE("parse", () => {
            $.SUBRULE($.section_Name)
            $.OPTION(() => {
                $.SUBRULE($.section_Procedures)
            })
            $.SUBRULE($.section_Areas)
            $.SUBRULE($.section_Robots)
            $.SUBRULE($.section_Vars_Robot)
            $.SUBRULE($.section_Main)
        });

        $.RULE("section_Name", () => {
            $.CONSUME(Program)
            $.CONSUME(Identifier)
        });

        $.RULE("section_Procedures", () => {
            $.CONSUME(Procedures)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_Procedure)
            })
        })
        $.RULE("declaration_Procedure", () => {
            $.CONSUME(Procedure)
            $.CONSUME(Identifier)
            $.CONSUME(LParen)
            $.MANY_SEP({
                SEP: DotComma,
                DEF: () => {
                    $.SUBRULE($.declaration_Parameter)
                }
            })
            $.CONSUME(RParen)
            $.OPTION(() => {
                $.SUBRULE($.section_Vars_Value)
            })
            $.CONSUME(Begin)
            $.MANY(() => {
                $.SUBRULE($.statement)
            })
            $.CONSUME(End)
        })
        $.RULE("declaration_Parameter", () => {
            $.CONSUME(TypeParameter)
            $.CONSUME(Identifier)
            $.CONSUME(DDot)
            $.CONSUME(TypeValue)
        })

        $.RULE("section_Areas", () => {
            $.CONSUME(Areas)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_Area)
            })
        })
        $.RULE("declaration_Area", () => {
            $.CONSUME(Identifier)
            $.CONSUME(DDot)
            $.CONSUME(AreaType)
            $.CONSUME(LParen)
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Integer)
                }
            })
            $.CONSUME(RParen)
        });

        $.RULE("section_Robots", () => {
            $.CONSUME(Robots)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_Robot)
            })
        });
        $.RULE("declaration_Robot", () => {
            $.CONSUME(Robot)
            $.CONSUME(Identifier)
            $.OPTION(() => {
                $.SUBRULE($.section_Vars_Value)
            })
            $.CONSUME(Begin)
            $.MANY(() => {
                $.SUBRULE($.statement)
            })
            $.CONSUME(End)
        });

        $.RULE("section_Vars_Robot", () => {
            $.CONSUME(Variables)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_Var_Robot)
            })
        });
        $.RULE("declaration_Var_Robot", () => {
            $.CONSUME(Identifier)
            $.CONSUME(DDot)
            $.CONSUME1(Identifier)
        });

        $.RULE("section_Main", () => {
            $.CONSUME(Begin)
            $.MANY(() => {
                $.OR([
                    { ALT: () => {$.SUBRULE($.asignArea)}},
                    { ALT: () => {$.SUBRULE($.initRobot)}}
                ])
            })
            $.CONSUME(End)
        });
        $.RULE("asignArea", () => {
            $.CONSUME(AsignArea)
            $.CONSUME(LParen)
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier)
                }
            })
            $.CONSUME(RParen)
        });
        $.RULE("initRobot", () => {
            $.CONSUME(InitRobot)
            $.CONSUME(LParen)
            $.CONSUME(Identifier)
            $.CONSUME(Comma)
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Integer)
                }
            })
            $.CONSUME(RParen)
        });

        this.performSelfAnalysis()
    }
}

const parserInstance = new RInfoParser();

const BaseRInfoVisitor = parserInstance.getBaseCstVisitorConstructor();

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
const lexResult = RInfoLexer.tokenize(inputText);
parserInstance.input = lexResult.tokens;

console.log(lexResult.tokens);
const cst = parserInstance.parse();

console.log(parserInstance.errors);
console.log(JSON.stringify(cst,null," "));
