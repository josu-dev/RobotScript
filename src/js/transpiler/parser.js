import { CstParser, Lexer, createToken } from "../../lib/chevrotain.js"


const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const LineComment = createToken({ name: "WhiteSpace", pattern: /\/\/.*/, group: Lexer.SKIPPED });
const MultiLineComment = createToken({ name: "WhiteSpace", pattern: /\/\*[\s\S]*?\*\//, group: Lexer.SKIPPED });

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

const Natural = createToken({ name: "Natural", pattern: /0|[1-9]\d*/ });
const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });
const Boolean = createToken({ name: "Boolean", pattern: /V|F/, longer_alt: Identifier });
const String =createToken({ name: "String", pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/ });

const Else = createToken({ name: "Else", pattern: /sino/, longer_alt: Identifier });
const If = createToken({ name: "If", pattern: /si/, longer_alt: Identifier });
const For = createToken({ name: "For", pattern: /repetir/, longer_alt: Identifier });
const While = createToken({ name: "While", pattern: /mientras/, longer_alt: Identifier });

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


const AdditionOperator = createToken({ name: "AdditionOperator", pattern: Lexer.NA });
const Plus = createToken({ name: "Plus", pattern: /\+/, categories: AdditionOperator });
const Minus = createToken({ name: "Minus", pattern: /-/, categories: AdditionOperator });

const MultiplicationOperator = createToken({ name: "MultiplicationOperator", pattern: Lexer.NA });
const Mult = createToken({ name: "Multi", pattern: /\*/, categories: MultiplicationOperator });
const Div = createToken({ name: "Div", pattern: /\//, categories: MultiplicationOperator });

const Or = createToken({ name: "Or", pattern: /\|/ });
const And = createToken({ name: "And", pattern: /\&/ });
const Not = createToken({ name: "Not", pattern: /\~/ });

const Begin = createToken({ name: "Begin", pattern: /comenzar/, longer_alt: Identifier });
const End = createToken({ name: "End", pattern: /fin/, longer_alt: Identifier });

const Program = createToken({ name: "Program", pattern: /programa/, longer_alt: Identifier });

const Procedures = createToken({ name: "Procedures", pattern: /procesos/, longer_alt: Identifier });
const Procedure = createToken({ name: "Procedure", pattern: /proceso/, longer_alt: Identifier });
const TypeParameter = createToken({ name: "TypeParameter", pattern: /ES|E/, longer_alt: Identifier });

const Variables = createToken({ name: "Variables", pattern: /variables/, longer_alt: Identifier });
const TypeValue = createToken({ name: "VariableType", pattern: /boolean|numero/, longer_alt: Identifier });

const Areas = createToken({ name: "Areas", pattern: /areas/, longer_alt: Identifier });
const AreaType = createToken({ name: "AreaType", pattern: /AreaPC|AreaP|AreaC/, longer_alt: Identifier });

const Robots = createToken({ name: "Robots", pattern: /robots/, longer_alt: Identifier });
const Robot = createToken({ name: "Robot", pattern: /robot/, longer_alt: Identifier });

const AsignArea = createToken({ name: "AsignArea", pattern: /AsignarArea/, longer_alt: Identifier });
const InitRobot = createToken({ name: "InitRobot", pattern: /Iniciar/, longer_alt: Identifier });

const ReservedFunction = createToken({ name: "ReservedFunction", pattern: Lexer.NA });
const ConsultItem = createToken({ name: "ConsultItem", pattern: /Hay(Papel)|(Flor)EnLa(Esquina)|(Bolsa)/, longer_alt: Identifier, categories: ReservedFunction });
const ConsultPosition = createToken({ name: "ConsultPosition", pattern: /Pos(Ca)|(Av)/, longer_alt: Identifier, categories: ReservedFunction });

const TakeItem = createToken({ name: "TakeItem", pattern: /tomar(Flor)|(Papel)/, longer_alt: Identifier });
const DepositItem = createToken({ name: "DepositItem", pattern: /depositar(Flor)|(Papel)/, longer_alt: Identifier });

const ChangePosition = createToken({ name: "ChangePosition", pattern: /Pos/, longer_alt: Identifier });

const Movement = createToken({ name: "Movement", pattern: /mover/, longer_alt: Identifier });

const ChangeOrientation = createToken({ name: "ChangeOrientation", pattern: /derecha/, longer_alt: Identifier });

const Inform = createToken({ name: "Inform", pattern: /Informar/, longer_alt: Identifier });

const GenerateNumber = createToken({ name: "GenerateNumber", pattern: /Random/, longer_alt: Identifier });

const Message = createToken({ name: "Message", pattern: /(Enviar)|(Recibir)Mensaje/, longer_alt: Identifier });
const ControlCorner = createToken({ name: "ControlCorner", pattern: /(Bloquear)|(Liberar)Esquina/, longer_alt: Identifier });

const allTokens = [
    WhiteSpace,
    LineComment,
    MultiLineComment,

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
            $.SUBRULE($.additionExpression, { LABEL: "lhs" })
            $.MANY(() => {
                $.CONSUME(LT)
                $.SUBRULE2($.additionExpression, { LABEL: "rhs" })
            })
        })
        $.RULE("additionExpression", () => {
            $.SUBRULE($.term, { LABEL: "lhs" })
            $.MANY(() => {
                $.CONSUME(AdditionOperator)
                $.SUBRULE2($.term, { LABEL: "rhs" })
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
        $.RULE("program", () => {
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

class RInfoToAstVisitor extends BaseRInfoVisitor {
    constructor(){
        super();
        this.validateVisitor();
    };

    section_Vars_Value(ctx) {
        const variables = this.visit(ctx.declaration_Var_Value);

        return {
            type: "VARIABLES",
            value: variables
        }
    };
    declaration_Var_Value(ctx) {
        const reference = ctx.Identifier[0].image;
        const type_value = ctx.TypeValue;

        return {
            type: "DECLARATION_VARIABLE",
            value: {
                id1: reference,
                type: type_value
            }
        }
    };

    // possible change to this
    statement(ctx) {
        if (ctx.ifStatement){
            return this.visit(ctx.ifStatement)
        }
        if (ctx.forStatement){
            return this.visit(ctx.forStatement)
        }
        if (ctx.whileStatement){
            return this.visit(ctx.whileStatement)
        }
        if (ctx.blockStatement){
            return this.visit(ctx.blockStatement)
        }
        if (ctx.assignStatement){
            return this.visit(ctx.assignStatement)
        }
        if (ctx.callStatement){
            return this.visit(ctx.callStatement)
        }
    };
    // possible change to this
    ifStatement(ctx) {
        const condition = this.visit(ctx.paren_expr);
        const statementsIf = this.visit(ctx.statement[0]);
        let statementsElse = [];
        if (ctx.statement[1]){
            statementsElse = this.visit(ctx.statement[1]);
        }
        
        return {
            type: "STATEMENT_CONTROL",
            value: {
                type: "IF",
                condition: condition,
                body: statementsIf,
                else: statementsElse
            }
        }
    };
    // possible change to this
    forStatement(ctx) {
        const condition = this.visit(ctx.paren_expr);
        const statements = this.visit(ctx.statement);
        
        return {
            type: "STATEMENT_CONTROL",
            value: {
                type: "FOR",
                condition: condition,
                body: statements
            }
        }
    };
    // possible change to this
    whileStatement(ctx) {
        const condition = this.visit(ctx.paren_expr);
        const statements = this.visit(ctx.statement);

        return {
            type: "STATEMENT_CONTROL",
            value: {
                type: "WHILE",
                condition: condition,
                body: statements
            }
        }
    };
    // possible change to this
    blockStatement(ctx) {
        const statements = this.visit(ctx.statement);
        return {
            type: "STATEMENT_BLOCK",
            value: statements
        }
    };
    // possible change to this
    assignStatement(ctx) {
        const reference = ctx.Identifier[0].image;

        return {
            type: "STATEMENT_ASSIGN",
            value: {
                id1: reference,
                value: this.visit(ctx.expression)
            }
        }
    };
    // possible change to this
    callStatement(ctx) {
        if (ctx.reservedProcedure){
            return this.visit(ctx.reservedProcedure)
        }
        if (ctx.userProcedure){
            return this.visit(ctx.userProcedure)
        }
    };
    // possible change to this
    reservedProcedure(ctx) {
        let reference = "";
        if (ctx.Movement){
            reference = ctx.Movement[0].image;
        } else if (ctx.TakeItem){
            reference = ctx.TakeItem[0].image;
        } else if (ctx.DepositItem){
            reference = ctx.DepositItem[0].image;
        } else if (ctx.ChangeOrientation){
            reference = ctx.ChangeOrientation[0].image;
        } else if (ctx.GenerateNumber){
            reference = ctx.GenerateNumber[0].image;
        } else if (ctx.Inform){
            reference = ctx.Inform[0].image;
        }

        let args = [];
        if (ctx.expression) {
            args = this.visit(ctx.expression)
        }

        return {
            type: "PROCEDURE_CALL_RESERVED",
            value: {
                id1: reference,
                arguments: args
            }
        }
    }
    // possible change to this
    userProcedure(ctx) {
        const reference = ctx.Identifier[0].image;
        let args = [];
        if (ctx.expression) {
            args = this.visit(ctx.expression)
        }

        return {
            type: "PROCEDURE_CALL_USER",
            value: {
                id1: reference,
                arguments: args
            }
        }
    }

    // possible change to this
    expression(ctx) {
        if (ctx.assignExpression){
            return this.visit(ctx.assignExpression)
        }
        if (ctx.relationExpression){
            return this.visit(ctx.relationExpression)
        }
    };
    // possible change to this
    relationExpression(ctx) {
        let result = {
            type: "OPERATION_RELATIONAL",
            lhs: this.visit(ctx.lhs),
            rhs: null
        }

        if (ctx.rhs) {
            let parcialResult = [];
            ctx.rhs.forEach((rhsOperand, idx) => {
                // there will be one operator for each rhs operand
                let rhsValue = this.visit(rhsOperand)
                let operator = ctx.additionOperator[idx]
                    
                parcialResult.push({
                    operator: operator,
                    rhs: rhsValue
                })
            })
            result.rhs = parcialResult;
        }

        return {
            type: "OPERATION_BINARI",
            value: result
        }
    };
    // possible change to this
    additionExpression(ctx) {
        let result = this.visit(ctx.lhs);

        /*
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
              // there will be one operator for each rhs operand
              let rhsValue = this.visit(rhsOperand)
              let operator = ctx.additionOperator
      
              if (tokenMatcher(operator, Plus)) {
                result += rhsValue
              } else {
                // Minus
                result -= rhsValue
              }
            })
          }
        */
        return {
            type: "OPERATION_BINARI",
            value: result
        }
    };
    // possible change to this
    assignExpression(ctx) {
        const lhs = ctx.Identifier[0].image;
        const operator = cta.Equal[0].image;
        const rhs = this.visit(ctx.expression);

        return {
            type: "OPERATION_BINARI",
            value: {
                operator: operator,
                lhs: lhs,
                rhs: rhs
            }
        }
    };
    // possible change to this
    term(ctx) {
        if (ctx.paren_expr){
            return this.visit(ctx.paren_expr)
        }
        if (ctx.Integer) {
            return {
                type: "LITERAL_NUMBER",
                value: parseInt(ctx.Integer[0].image, 10)}
        }
        if (ctx.Identifier) {
            return {
                type: "VARIABLE",
                value: ctx.Identifier[0].image
            }
        }
    };
    // possible change to this
    paren_expr(ctx) {
        return this.visit(ctx.expression);
    };

    program(ctx) {
        const name = this.visit(ctx.section_Name);
        let procedures;
        if (ctx.section_Procedures) {
            procedures = this.visit(ctx.section_Procedures)
        };
        const areas = this.visit(ctx.section_Areas);
        const robots = this.visit(ctx.section_Robots);
        const variables = this.visit(ctx.section_Vars_Robot);
        const main = this.visit(ctx.section_Main);

        return {
            type: "PROGRAM",
            value: {
                name: name,
                procedures: procedures,
                areas: areas,
                robots: robots,
                instances: variables,
                main: main
            }
        };
    };

    section_Name(ctx) {
        const name = ctx.Identifier[0].image;

        return {
            type: "PROGRAM_NAME",
            value: name
        };
    };

    section_Procedures(ctx) {
        const procedures = this.visit(ctx.declaration_Procedure);

        return {
            type: "PROGRAM_PROCEDURES",
            value: procedures
        }
    };
    declaration_Procedure(ctx) {
        const reference = ctx.Identifier[0].image;
        let parameters = [];
        if (ctx.declaration_Parameter) {
            parameters = this.visit(ctx.declaration_Parameter)
        }
        let variables;
        if (ctx.section_Vars_Value) {
            variables = this.visit(ctx.section_Vars_Value)
        }
        let body = [];
        if (ctx.statement){
            body = this.visit(ctx.statement)
        }

        return {
            type: "DECLARATION_PROCEDURE",
            value: {
                id1: reference,
                parameters: parameters,
                local_variables: variables,
                body: body
            }
        }
    };
    declaration_Parameter(ctx) {
        const type_parameter = ctx.TypeParameter[0].image;
        const reference = ctx.Identifier[0].image;
        const type_value = ctx.TypeValue;

        return {
            type: "DECLARATION_PARAMETER",
            value: {
                type_parameter: type_parameter,
                id1: reference,
                type_value: type_value
            }
        }
    };

    section_Areas(ctx) {
        const areas_type = this.visit(ctx.declaration_Area);

        return {
            type: "PROGRAM_AREAS_TYPES",
            value: areas_type
        }
    };
    declaration_Area(ctx) {
        const reference = ctx.Identifier[0].image;
        const area_type = ctx.AreaType[0].image;

        let xVal1= -1,yVal1= -1,xVal2= -1,yVal2= -1;
        if (ctx.Integer) {
            if (ctx.Integer[0]) {
                xVal1= Number(ctx.Integer[0].image)
            }
            if (ctx.Integer[1]) {
                yVal1= Number(ctx.Integer[1].image)
            }
            if (ctx.Integer[2]) {
                xVal2= Number(ctx.Integer[2].image)
            }
            if (ctx.Integer[3]) {
                yVal2= Number(ctx.Integer[3].image)
            }
        }

        return {
            type: "DECLARATION_AREA",
            value: {
                id1: reference,
                type: area_type,
                x1: xVal1,
                y1: yVal1,
                x2: xVal2,
                y2: yVal2
            }
        }
    };

    section_Robots(ctx) {
        let robots_types = [];
        if (ctx.declaration_Robot) {
            robots_types = this.visit(ctx.declaration_Robot)
        }

        return {
            type: "PROGRAM_ROBOTS_TYPES",
            value: robots_types
        }
    };
    declaration_Robot(ctx) {
        const reference = ctx.Identifier[0].image;
        let variables;
        if (ctx.section_Vars_Value) {
            variables= this.visit(ctx.section_Vars_Value)
        }
        let algoritm= [];
        if (ctx.statement){
            algoritm= this.visit(ctx.statement)
        }

        return {
            type: "DECLARATION_ROBOT_TYPE",
            value: {
                id1: reference,
                local_variables: variables,
                algoritm: algoritm
            }
        }
    };

    section_Vars_Robot(ctx) {
        let robots_instances = [];
        if (ctx.declaration_Var_Robot) {
            ctx.declaration_Var_Robot.forEach(x => robots_instances.push(this.visit(x)))
            //robots_instances = this.visit(ctx.declaration_Var_Robot)
        }

        return {
            type: "PROGRAM_ROBOTS_INSTANCES",
            value: robots_instances
        }
    };
    declaration_Var_Robot(ctx) {
        let reference1= "", reference2= "";
        if (ctx.Identifier) {
            if (ctx.Identifier[0]) {
                reference1= ctx.Identifier[0].image;
            }
            if (ctx.Identifier[1]) {
                reference2= ctx.Identifier[1].image;
            }
        }

        return {
            type: "DECLARATION_ROBOT_INSTANCE",
            value: {
                id1: reference1,
                id2: reference2
            }
        }
    };

    section_Main(ctx) {
        let areas_asignation = [];
        if (ctx.asignArea) {
            ctx.asignArea.forEach(x => areas_asignation.push(this.visit(x)))
            //areas_asignation = this.visit(ctx.asignArea)
        }
        let robots_initialization = [];
        if (ctx.initRobot) {
            ctx.initRobot.forEach(x => robots_initialization.push(this.visit(x)))
        }
        return {
            type: "PROGRAM_MAIN",
            val: {
                assign_area: areas_asignation,
                init_instance: robots_initialization
            }
        }
    };
    asignArea(ctx) {
        let reference1= "", reference2= "";
        if (ctx.Identifier) {
            if (ctx.Identifier[0]) {
                reference1= ctx.Identifier[0].image;
            }
            if (ctx.Identifier[1]) {
                reference2= ctx.Identifier[1].image;
            }
        }

        return {
            type: "ASSIGN_AREA",
            value: {
                id1: reference1,
                id2: reference2
            }
        }
    };
    initRobot(ctx) {
        let xVal=-1, yVal=-1;
        if (ctx.Integer) {
            if (ctx.Integer[0]) {
                xVal= Number(ctx.Integer[0].image)
            }
            if (ctx.Integer[1]) {
                yVal= Number(ctx.Integer[1].image)
            }
        }
        let reference= "";
        if (ctx.Identifier) {
            reference= ctx.Identifier[0].image;
        };
        return {
            type: "INIT_ROBOT",
            value: {
                id1: reference,
                x1: xVal,
                y1: yVal
            }
        }
    };
};

const toAstVisitorInstance = new RInfoToAstVisitor();


function toAst(inputText) {
    // Lexing
    const lexResult = RInfoLexer.tokenize(inputText);
    parserInstance.input = lexResult.tokens;

    // Parsing
    const cst = parserInstance.program();
    if (parserInstance.errors.length > 0) {
        return {
            ast : null,
            error : true,
            errors : parserInstance.errors
        }
    }

    // Visiting
    const ast = toAstVisitorInstance.visit(cst)
    return {
        ast : ast,
        error : false,
        errors : null
    }
};

export default toAst;

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
