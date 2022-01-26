/*const createToken = chevrotain.createToken;
const Lexer = chevrotain.Lexer;
const CstParser = chevrotain.CstParser;*/
const { CstParser, Lexer, createToken } = require("chevrotain")

const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const LineComment = createToken({ name: "WhiteSpace", pattern: /\/\/.*/, group: Lexer.SKIPPED });
const MultiLineComment = createToken({ name: "WhiteSpace", pattern: /\/\*[\s\S]*?\*\//, group: Lexer.SKIPPED });

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

const Natural = createToken({ name: "Natural", pattern: /0|[1-9]\d*/ });
const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });
const Boolean = createToken({ name: "Boolean", pattern: /verdad|falso/, longer_alt: Identifier });
const String =createToken({ name: "String", pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/ });

const Else = createToken({ name: "Else", pattern: /sino/, longer_alt: Identifier });
const If = createToken({ name: "If", pattern: /si/, longer_alt: Identifier });
const For = createToken({ name: "For", pattern: /repetir/, longer_alt: Identifier });
const While = createToken({ name: "While", pattern: /mientras/, longer_alt: Identifier });

const Comma = createToken({ name: "Comma", pattern: /,/ });
const DotComma = createToken({ name: "DotComma", pattern: /;/ });
const DDot = createToken({ name: "DDot", pattern: /:/ });

const LParen = createToken({ name: "LParen", pattern: /\(/ });
const RParen = createToken({ name: "RParen", pattern: /\)/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });

const GET = createToken({ name: "GET", pattern: />=/ });
const LET = createToken({ name: "LET", pattern: /<=/ });
const GT = createToken({ name: "GT", pattern: />/ });
const LT = createToken({ name: "LT", pattern: /</ });
const NotEqual = createToken({ name: "NotEqual", pattern: /\!=/ });
const Equal = createToken({ name: "Equal", pattern: /==/ });

const Asignation = createToken({ name: "Asignation", pattern: Lexer.NA });
const SimpleAssign = createToken({ name: "SimpleAssign", pattern: /:=/, categories: Asignation });


const AdditionOperator = createToken({ name: "AdditionOperator", pattern: Lexer.NA });
const Plus = createToken({ name: "Plus", pattern: /\+/, categories: AdditionOperator });
const Minus = createToken({ name: "Minus", pattern: /\-/, categories: AdditionOperator });

const MultiplicationOperator = createToken({ name: "MultiplicationOperator", pattern: Lexer.NA });
const Mult = createToken({ name: "Multi", pattern: /\*/, categories: MultiplicationOperator });
const Div = createToken({ name: "Div", pattern: /\//, categories: MultiplicationOperator });

const Or = createToken({ name: "Or", pattern: /\|/ });
const And = createToken({ name: "And", pattern: /\&/ });
const Not = createToken({ name: "Not", pattern: /\!/ });

const Begin = createToken({ name: "Begin", pattern: /comenzar/, longer_alt: Identifier });
const End = createToken({ name: "End", pattern: /fin/, longer_alt: Identifier });

const Program = createToken({ name: "Program", pattern: /programa/, longer_alt: Identifier });

const Procedures = createToken({ name: "Procedures", pattern: /procesos/, longer_alt: Identifier });
const Procedure = createToken({ name: "Procedure", pattern: /proceso/, longer_alt: Identifier });
const TypeParameter = createToken({ name: "TypeParameter", pattern: /ES|E/, longer_alt: Identifier });

const Variables = createToken({ name: "Variables", pattern: /variables/, longer_alt: Identifier });
const TypeValue = createToken({ name: "TypeValue", pattern: /boolean|numero/, longer_alt: Identifier });

const Areas = createToken({ name: "Areas", pattern: /areas/, longer_alt: Identifier });
const AreaType = createToken({ name: "AreaType", pattern: /AreaPC|AreaP|AreaC/, longer_alt: Identifier });

const Robots = createToken({ name: "Robots", pattern: /robots/, longer_alt: Identifier });
const Robot = createToken({ name: "Robot", pattern: /robot/, longer_alt: Identifier });

const AsignArea = createToken({ name: "AsignArea", pattern: /AsignarArea/, longer_alt: Identifier });
const InitRobot = createToken({ name: "InitRobot", pattern: /Iniciar/, longer_alt: Identifier });

const StateMethod = createToken({ name: "StateMethod", pattern: Lexer.NA });
const ConsultItem = createToken({ name: "ConsultItem", pattern: /Hay(Papel)|(Flor)EnLa(Esquina)|(Bolsa)/, longer_alt: Identifier, categories: StateMethod });
const ConsultPosition = createToken({ name: "ConsultPosition", pattern: /Pos(Ca)|(Av)/, longer_alt: Identifier, categories: StateMethod });

const ActionMethod = createToken({ name: "ActionMethod", pattern: Lexer.NA });
const TakeItem = createToken({ name: "TakeItem", pattern: /tomar(Flor)|(Papel)/, longer_alt: Identifier, categories: StateMethod });
const DepositItem = createToken({ name: "DepositItem", pattern: /depositar(Flor)|(Papel)/, longer_alt: Identifier, categories: StateMethod });
const Movement = createToken({ name: "Movement", pattern: /mover/, longer_alt: Identifier, categories: StateMethod });
const ChangeOrientation = createToken({ name: "ChangeOrientation", pattern: /derecha/, longer_alt: Identifier, categories: StateMethod });


const ChangePosition = createToken({ name: "ChangePosition", pattern: /Pos/, longer_alt: Identifier });

const Inform = createToken({ name: "Inform", pattern: /Informar/, longer_alt: Identifier });

const GenerateNumber = createToken({ name: "GenerateNumber", pattern: /Random/, longer_alt: Identifier });

const Message = createToken({ name: "Message", pattern: /RecibirMensaje|EnviarMensaje/, longer_alt: Identifier });
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

    StateMethod,
    ConsultItem,
    ConsultPosition,

    
    Message,
    
    ActionMethod,
    TakeItem,
    DepositItem,
    ChangePosition,
    Movement,
    ChangeOrientation,
    Inform,
    GenerateNumber,
    ControlCorner,

    String,

    Identifier,

    Comma,
    DotComma,
    Asignation,
    SimpleAssign,
    DDot,

    LParen,
    RParen,
    LCurly,
    RCurly,

    GET,
    LET,
    GT,
    LT,
    NotEqual,
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

        $.RULE("section_Variables", () => {
            $.CONSUME(Variables)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_Variable)
            })
        });
        $.RULE("declaration_Variable", () => {
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
                { ALT: () => $.SUBRULE($.complexActionMethod) },
                { ALT: () => $.SUBRULE($.callProcedure) },
                { ALT: () => $.SUBRULE($.actionMethod) },
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
            $.AT_LEAST_ONE(() => {
              $.SUBRULE($.statement)
            })
            $.CONSUME(RCurly)
        })
        $.RULE("assignStatement", () => {
            $.CONSUME(Identifier)
            $.CONSUME(Asignation)
            $.SUBRULE($.expression)
        });

        $.RULE("callProcedure", () => {
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

        $.RULE("complexActionMethod", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.changePosition) },
                { ALT: () => $.SUBRULE($.generateNumber) },
                { ALT: () => $.SUBRULE($.inform) },
                { ALT: () => $.SUBRULE($.message) },
                { ALT: () => $.SUBRULE($.controlCorner) },
            ])
        });
        $.RULE("changePosition", () => {
            $.CONSUME(ChangePosition)
            $.CONSUME(LParen)
            $.SUBRULE1($.expression)
            $.CONSUME(Comma)
            $.SUBRULE2($.expression)
            $.CONSUME(RParen)
        });
        $.RULE("generateNumber", () => {
            $.CONSUME(GenerateNumber)
            $.CONSUME(LParen)
            $.CONSUME(Identifier)
            $.CONSUME1(Comma)
            $.SUBRULE1($.expression)
            $.CONSUME2(Comma)
            $.SUBRULE2($.expression)
            $.CONSUME(RParen)
        });
        $.RULE("inform", () => {
            $.CONSUME(Inform)
            $.CONSUME(LParen)
            $.OR([
                { ALT : () => {
                    $.CONSUME1(String)
                    $.CONSUME(Comma)
                    $.SUBRULE1($.expression)
                }},
                { ALT : () => $.SUBRULE2($.expression)},
                { ALT : () => $.CONSUME2(String)}
            ])
            $.CONSUME(RParen)
        });
        $.RULE("message", () => {
            $.CONSUME(Message)
            $.CONSUME(LParen)
            $.SUBRULE($.expression)
            $.CONSUME(Comma)
            $.OR([
                { ALT : () => $.CONSUME(Identifier, { LABEL : "who"})},
                { ALT : () => $.CONSUME(Mult, { LABEL : "who"})}
            ])
            $.CONSUME(RParen)
        });
        $.RULE("controlCorner", () => {
            $.CONSUME(ControlCorner)
            $.CONSUME(LParen)
            $.SUBRULE1($.expression)
            $.CONSUME(Comma)
            $.SUBRULE2($.expression)
            $.CONSUME(RParen)
        });

        $.RULE("actionMethod", () => {
            $.OR([
                { ALT: () => $.CONSUME(Movement, { LABEL : "actionMethod"}) },
                { ALT: () => $.CONSUME(TakeItem, { LABEL : "actionMethod"}) },
                { ALT: () => $.CONSUME(DepositItem, { LABEL : "actionMethod"}) },
                { ALT: () => $.CONSUME(ChangeOrientation, { LABEL : "actionMethod"}) },
            ])
        })

        $.RULE("stateMethod", () => {
            $.CONSUME(StateMethod)
        })


        //Expressions
        $.RULE("expression", () => {
            $.SUBRULE($.equality)
        });

        $.RULE("equality", () => {
            $.SUBRULE1($.comparison)
            $.MANY(() => {
                $.OR([
                    { ALT : () => $.CONSUME(NotEqual, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(Equal, { LABEL : "operator" })},
                ])
                $.SUBRULE2($.comparison)
            })
        });

        $.RULE("comparison", () => {
            $.SUBRULE1($.term)
            $.MANY(() => {
                $.OR([
                    { ALT : () => $.CONSUME(GT, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(GET, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(LT, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(LET, { LABEL : "operator" })},
                ])
                $.SUBRULE2($.term)
            })
        });

        $.RULE("term", () => {
            $.SUBRULE1($.factor)
            $.MANY(() => {
                $.OR([
                    { ALT : () => $.CONSUME(Minus, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(Plus, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(Or, { LABEL : "operator" })},
                ])
                $.SUBRULE2($.factor)
            })
        });

        $.RULE("factor", () => {
            $.SUBRULE1($.unary)
            $.MANY(() => {
                $.OR([
                    { ALT : () => $.CONSUME(Div, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(Mult, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(And, { LABEL : "operator" })},
                ])
                $.SUBRULE2($.unary)
            })
        });

        $.RULE("unary", () => {
            $.OR1([
                { ALT: () => {
                    $.OR2([
                        { ALT: () => $.CONSUME(Not) },
                        { ALT: () => $.CONSUME(Minus) },
                    ])
                    $.SUBRULE($.unary)
                }},
                { ALT : () => $.SUBRULE($.primary) }
            ])
        });
        
        $.RULE("primary", () => {
            $.OR([
                { ALT: () => $.CONSUME(Integer)},
                { ALT: () => $.CONSUME(Boolean)},
                { ALT: () => $.CONSUME(Identifier)},
                { ALT: () => $.SUBRULE($.stateMethod)},
                { ALT: () => $.SUBRULE($.paren_expr)}
            ])
        });

        $.RULE("paren_expr", () => {
            $.CONSUME(LParen);
            $.SUBRULE($.expression);
            $.CONSUME(RParen);
        });

        
        //Program Estructure
        $.RULE("program", () => {
            $.SUBRULE($.section_Name)
            $.OPTION(() => {
                $.SUBRULE($.section_Procedures)
            })
            $.SUBRULE($.section_Areas)
            $.SUBRULE($.section_Robots)
            $.SUBRULE($.section_Instances)
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
                $.SUBRULE($.section_Variables)
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
                $.SUBRULE($.section_Variables)
            })
            $.CONSUME(Begin)
            $.MANY(() => {
                $.SUBRULE($.statement)
            })
            $.CONSUME(End)
        });

        $.RULE("section_Instances", () => {
            $.CONSUME(Variables)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_Instance)
            })
        });
        $.RULE("declaration_Instance", () => {
            $.CONSUME(Identifier)
            $.CONSUME(DDot)
            $.CONSUME1(Identifier)
        });

        $.RULE("section_Main", () => {
            $.CONSUME(Begin)
            $.MANY(() => {
                $.OR([
                    { ALT: () => {$.SUBRULE($.asignArea)}},
                    { ALT: () => {$.SUBRULE($.initialPosition)}}
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
        $.RULE("initialPosition", () => {
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

    section_Variables(ctx) {
        const variables = [];

        ctx.declaration_Variable.forEach( dec => {
            const variable = this.visit(dec);
            variables.push(variable);
        })

        return variables;
    };
    declaration_Variable(ctx) {
        const identifier = ctx.Identifier[0].image;
        const type_value = ctx.TypeValue[0].image;

        return {
            type_value: type_value,
            identifier: identifier
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
        if (ctx.callProcedure){
            return this.visit(ctx.callProcedure)
        }
        if (ctx.actionMethod){
            return this.visit(ctx.actionMethod)
        }
        if (ctx.complexActionMethod){
            return this.visit(ctx.complexActionMethod)
        }
        console.log("No existe visitor para este statement")
    };

    ifStatement(ctx) {
        const condition = this.visit(ctx.paren_expr);

        const bodyIf = this.visit(ctx.statement[0]);

        let bodyElse = {};
        if (ctx.Else) {
            bodyElse = this.visit(ctx.statement[1]);
        }
        
        return {
            category: "STATEMENT_CONTROL",
            type: "IF",
            condition: condition,
            body: bodyIf,
            else: bodyElse
        }
    };
    forStatement(ctx) {
        const condition = this.visit(ctx.paren_expr);

        const body = this.visit(ctx.statement);
        
        return {
            category: "STATEMENT_CONTROL",
            type: "FOR",
            condition: condition,
            body: body
        }
    };
    whileStatement(ctx) {
        const condition = this.visit(ctx.paren_expr);

        const body = this.visit(ctx.statement);

        return {
            category: "STATEMENT_CONTROL",
            type: "WHILE",
            condition: condition,
            body: body
        }
    };
    blockStatement(ctx) {
        let body = [];
        if (ctx.statement){
            ctx.statement.forEach( dec => {
                const statement = this.visit(dec);
                body.push(statement);
            })
        }

        return {
            type: "STATEMENT_BLOCK",
            body: body
        }
    };
    assignStatement(ctx) {
        const identifier = ctx.Identifier[0].image;

        const value = this.visit(ctx.expression);

        return {
            type: "STATEMENT_ASSIGN",
            identifier: identifier,
            value: value
        }
    };
    callProcedure(ctx) {
        const identifier = ctx.Identifier[0].image;

        let parameters = [];
        if (ctx.expression) {
            ctx.expression.forEach( dec => {
                const parameter = this.visit(dec);
                parameters.push(parameter);
            })
        }

        return {
            type: "STATEMENT_CALL_PROCEDURE",
            identifier : identifier,
            parameters : parameters
        }
    }
    
    complexActionMethod(ctx) {
        if (ctx.changePosition){
            return this.visit(ctx.changePosition);
        } 
        else if (ctx.generateNumber){
            return this.visit(ctx.generateNumber);
        } 
        else if (ctx.inform){
            return this.visit(ctx.inform);
        } 
        else if (ctx.message){
            return this.visit(ctx.message);
        } 
        else if (ctx.controlCorner){
            return this.visit(ctx.controlCorner);
        }
    }
    changePosition(ctx) {
        const xVal = this.visit(ctx.expression[0]);
        const yVal = this.visit(ctx.expression[1]);

        return {
            type : "CHANGE_POSITION",
            x : xVal,
            y : yVal
        }
    }
    generateNumber(ctx) {
        const identifier = ctx.Identifier[0].image;

        const min = this.visit(ctx.expression[0]);
        const max = this.visit(ctx.expression[1]);

        return {
            type : "GENERATE_NUMBER",
            identifier : identifier,
            min : min,
            max : max
        }
    }
    inform(ctx) {
        let arg1 = {};
        let arg2 = {};

        if (ctx.String) {
            arg1 = {
                type : "STRING_LITERAL",
                val : ctx.String[0].image
            }
            if (ctx.expression) {
                arg2 = this.visit(ctx.expression)
            }
        }
        else {
            arg1 = this.visit(ctx.expression)
        }

        return {
            type : "INFORM",
            arg1 : arg1,
            arg2: arg2
        }
    }
    message(ctx) {
        console.log(ctx)
        let mode = "";
        const identifier = ctx.Message[0].image;
        if (identifier === "EnviarMensaje") {
            mode = "SEND"
        } else if (identifier === "RecibirMensaje") {
            mode = "RECIVE"
        }

        const val = this.visit(ctx.expression[0]);
        const who = ctx.who[0].image;

        return {
            type : "MESSAGE",
            mode : mode,
            val : val,
            who : who
        }
    }
    controlCorner(ctx) {
        let mode = "";
        const identifier = ctx.ControlCorner[0].image;
        if (identifier === "BloquearEsquina") {
            mode = "BLOCK"
        } else if (identifier === "LiberarEsquina") {
            mode = "UNBLOCK"
        }

        const xVal = this.visit(ctx.expression[0]);
        const yVal = this.visit(ctx.expression[0]);

        return {
            type : "CONTROL_CORNER",
            mode : mode,
            x : xVal,
            y : yVal
        }
    }

    actionMethod(ctx) {
        const identifier = ctx.actionMethod[0].image;

        return {
            type : "ACTION_METHOD",
            identifier : identifier
        }
    }

    stateMethod(ctx) {
        const identifier = ctx.stateMethod[0].image;

        return {
            type : "STATE_METHOD",
            identifier : identifier
        }
    }


    expression(ctx) {
        return this.visit(ctx.equality);
    }
    equality(ctx) {
        let res = this.visit(ctx.comparison[0]);
        for (let i=1; i< ctx.comparison.length; i++){
            res = {
                type : "BINARY_OPERATION",
                operator : ctx.operator[i-1].image,
                lhs : res,
                rhs : this.visit(ctx.comparison[i])
            }
        }
        return res;
    }
    comparison(ctx) {
        let res = this.visit(ctx.term[0]);
        for (let i=1; i< ctx.term.length; i++){
            res = {
                type : "BINARY_OPERATION",
                operator : ctx.operator[i-1].image,
                lhs : res,
                rhs : this.visit(ctx.term[i])
            }
        }
        return res;
    }
    term(ctx) {
        let res = this.visit(ctx.factor[0]);
        for (let i=1; i< ctx.factor.length; i++){
            res = {
                type : "BINARY_OPERATION",
                operator : ctx.operator[i-1].image,
                lhs : res,
                rhs : this.visit(ctx.factor[i])
            }
        }
        return res;
    }
    factor(ctx) {
        let res = this.visit(ctx.unary[0]);
        for (let i=1; i< ctx.unary.length; i++){
            res = {
                type : "BINARY_OPERATION",
                operator : ctx.operator[i-1].image,
                lhs : res,
                rhs : this.visit(ctx.unary[i])
            }
        }
        return res;
    }
    unary(ctx) {
        if (ctx.unary) {
            let operator = "";
            if (ctx.Not) {
                operator = ctx.Not[0].image;
            } else if (ctx.Minus) {
                operator = ctx.Minus[0].image;
            }
            return {
                type : "UNARY_OPERATION",
                operator : operator,
                rhs : this.visit(ctx.unary)
            }
        }
        return this.visit(ctx.primary)
    }
    primary(ctx) {
        if (ctx.Integer){
            return {
                type : "LITERAL_INTEGER",
                value : ctx.Integer[0].image
            }
        } else if (ctx.Boolean){
            return {
                type : "LITERAL_BOOLEAN",
                value : ctx.Boolean[0].image
            }
        } else if (ctx.StateMethod){
            return {
                type : "STATE_METHOD",
                identifier : ctx.StateMethod[0].image
            }
        } else if (ctx.Identifier){
            return {
                type : "VARIABLE",
                identifier : ctx.Identifier[0].image
            }
        } else if (ctx.paren_expr){
            return this.visit(ctx.paren_expr)
        }
    }
    paren_expr(ctx) {
        return this.visit(ctx.expression);
    };


    //Program estructure
    program(ctx) {
        const name = this.visit(ctx.section_Name);
        const procedures = ctx.section_Procedures != null? this.visit(ctx.section_Procedures) : null;
        const areas = this.visit(ctx.section_Areas);
        const robots = this.visit(ctx.section_Robots);
        const instances = this.visit(ctx.section_Instances);
        const main = this.visit(ctx.section_Main);

        return {
            type: "PROGRAM",
            value: {
                NAME: name,
                PROCEDURES: procedures,
                AREAS: areas,
                ROBOT_TYPES: robots,
                ROBOT_INSTANCES: instances,
                INITIALIZATION: main
            }
        };
    };

    section_Name(ctx) {
        const identifier = ctx.Identifier[0].image;

        return {
            type: "IDENTIFIER",
            identifier: identifier
        };
    };

    section_Procedures(ctx) {
        const procedures = [];

        ctx.declaration_Procedure.forEach( dec => {
            const procedure = this.visit(dec);
            procedures.push(procedure);
        })

        return procedures;
    };
    declaration_Procedure(ctx) {
        const identifier = ctx.Identifier[0].image;

        let parameters = [];
        if (ctx.declaration_Parameter) {
            ctx.declaration_Parameter.forEach( dec => {
                const parameter = this.visit(dec);
                parameters.push(parameter);
            })
        }

        let variables = [];
        if (ctx.section_Variables) {
            variables = this.visit(ctx.section_Variables)
        }

        let body = [];
        if (ctx.statement){
            ctx.statement.forEach( dec => {
                const statement = this.visit(dec);
                body.push(statement);
            })
        }

        return {
            identifier: identifier,
            parameters: parameters,
            local_variables: variables,
            body: body
        }
    };
    declaration_Parameter(ctx) {
        const type_parameter = ctx.TypeParameter[0].image;
        const identifier = ctx.Identifier[0].image;
        const type_value = ctx.TypeValue[0].image;

        return {
            type_parameter: type_parameter,
            identifier: identifier,
            type_value: type_value
        }
    };

    section_Areas(ctx) {
        const areas = [];

        ctx.declaration_Area.forEach( dec => {
            const area = this.visit(dec);
            areas.push(area);
        })

        return areas;
    };
    declaration_Area(ctx) {
        const identifier = ctx.Identifier[0].image;
        const area_type = ctx.AreaType[0].image;

        let coords = []
        if (ctx.Integer) {
            ctx.Integer.forEach( int => {
                const integer = Number(int.image);
                coords.push(integer);
            })
        }

        return {
            type: area_type,
            identifier : identifier,
            coords : coords
        }
    };

    section_Robots(ctx) {
        let robot_types = [];

        ctx.declaration_Robot.forEach( dec => {
            const robot = this.visit(dec);
            robot_types.push(robot);
        })

        return robot_types;
    };
    declaration_Robot(ctx) {
        const identifier = ctx.Identifier[0].image;

        let variables = [];
        if (ctx.section_Variables) {
            variables = this.visit(ctx.section_Variables)
        }

        let body = [];
        if (ctx.statement){
            ctx.statement.forEach( dec => {
                const statement = this.visit(dec);
                body.push(statement);
            })
        }

        return {
            identifier: identifier,
            local_variables: variables,
            body : body
        }
    };

    section_Instances(ctx) {
        let instances = [];

        ctx.declaration_Instance.forEach( dec => {
            const instance = this.visit(dec);
            instances.push(instance);
        })

        return instances;
    };
    declaration_Instance(ctx) {
        let robot_type = "";
        let identifier = "";

        if (ctx.Identifier && ctx.Identifier.length === 2) {
            identifier = ctx.Identifier[0].image;
            robot_type = ctx.Identifier[1].image;
        }

        return {
            type : robot_type,
            identifier : identifier
        }
    };

    section_Main(ctx) {
        let areas_asignation = [];
        if (ctx.asignArea) {
            ctx.asignArea.forEach( dec => {
                const area = this.visit(dec);
                areas_asignation.push(area);
            })
        }

        let positions = [];
        if (ctx.initialPosition) {
            ctx.initialPosition.forEach( dec => {
                const position = this.visit(dec);
                positions.push(position);
            })
        }

        return {
            assign_areas: areas_asignation,
            initial_positions: positions
        }
    };
    asignArea(ctx) {
        let area_type = "";
        let identifier = "";

        if (ctx.Identifier && ctx.Identifier.length === 2) {
            identifier = ctx.Identifier[0].image;
            area_type = ctx.Identifier[1].image;
        }

        return {
            type : area_type,
            identifier : identifier
        }
    };
    initialPosition(ctx) {
        let identifier= "";
        if (ctx.Identifier) {
            identifier= ctx.Identifier[0].image;
        };
        
        let xVal = -1, yVal = -1;
        if (ctx.Integer && ctx.Integer.length === 2) {
            xVal = Number(ctx.Integer[0].image)
            yVal = Number(ctx.Integer[1].image)
        }

        return {
            identifier : identifier,
            x : xVal,
            y : yVal
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
        };
    };

    // Visiting
    const ast = toAstVisitorInstance.visit(cst);
    return {
        ast : ast,
        error : false,
        errors : null
    };
};


const program = `programa Prueba4
areas
  ciudad1: AreaP(1,1,1,10)
  ciudad2: AreaP(2,11,2,20)
robots
  robot tipo1
  variables
    flores: numero
    floresR: numero
  comenzar
    flores:= 0
    RecibirMensaje(floresR, robot2)
    flores := flores + 1
    EnviarMensaje (flores,robot2)
  fin
variables
  robot2: tipo2
comenzar
  AsignarArea(robot2, ciudad2)
  Iniciar(robot1, 1, 1)
fin`

const lexResult = RInfoLexer.tokenize(program);
parserInstance.input = lexResult.tokens;
console.log(lexResult.tokens);
const cst = parserInstance.program();
//console.log(JSON.stringify(cst, null, "   "));
console.log(JSON.stringify(parserInstance.errors, null, "   "));
const ast = toAstVisitorInstance.visit(cst);
//console.log(JSON.stringify(ast, null, "   "))

/*
programa Prueba3
    procesos
      proceso juntarFlorPapel(ES papel: numero; ES flor: numero)
      variables
        florE: numero
        papelE: numero
      comenzar  
        florE:= 0
        papelE:= 0
        mientras (HayFlorEnLaEsquina){
          tomarFlor()
          florE:= florE + 1
        }
        repetir (florE)
          depositarFlor()
        mientras (HayPapelEnLaEsquina){
          tomarPapel()
          papelE:= papelE + 1
        }
        repetir (papelE)
          depositarPapel()
        flor:= flor + florE
        papel:= papel + papelE
      fin
      proceso escalon(E tamano: numero; ES cantE: numero)
      variables
        papel: numero
        flor: numero
      comenzar
        papel:= 0
        flor:= 0
        repetir (2){
          repetir (tamano){
            juntarFlorPapel(papel, flor)
            mover()
          }
          juntarFlorPapel(papel, flor)
          derecha()
        }
        repetir (2)
          derecha()
        // under 2 line: si ((papel - flor) = 1)
        papel:= papel - flor
        si (papel)
          cantE:= cantE + 1
      fin
    areas
      ciudad : AreaC(1,1,100,100)
    robots 
      robot tipo1
      variables
        tamano: numero
        cantE: numero
      comenzar
        tamano:= 1
        cantE:= 0
        repetir (4){
          escalon(tamano, cantE)
          tamano:= tamano + 1
        }
        Informar(cantE)
      fin
    variables 
      robot1: tipo1
      robot2: tipo1
      robot3: tipo1
    comenzar 
      AsignarArea(robot1,ciudad)
      AsignarArea(robot2,ciudad)
      AsignarArea(robot3,ciudad)
      Iniciar(robot1, 12, 14)
      Iniciar(robot2, 17, 10)
      Iniciar(robot3, 22, 6)
    fin
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