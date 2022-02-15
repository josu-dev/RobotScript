"use strict";

import RSLexer from "./RSLexer.js";

const CstParser = chevrotain.CstParser;


const allTokens = RSLexer.tokensArray;
const {
    Newline, Outdent, Indent, Spaces,
    LineComment, MultiLineComment,

    Message, SendMessage, ReciveMessage,
    Begin, End, Else, If, While, For,
    Program,
    Procedures, Procedure,
    TypeParameter, ReferenceParameter, ValueParameter,
    
    Variables, TypeValue, TypeBoolean, TypeNumber,

    Areas, TypeArea, AreaSemiPrivate, AreaPrivate, AreaShared,

    Robots, Robot,

    AssignArea, AssignItem, AssignOrigin,

    StateMethod,
    ConsultFC, ConsultFI, ConsultPC, ConsultPI, ConsultX, ConsultY,

    ActionMethod,
    TakeItem, TakeFlower, TakePaper,
    DepositItem, DepositFlower, DepositPaper,
    Movement,
    ChangeDirection,

    ChangePosition, Inform, GenerateNumber,
    ControlCorner, BlockCorner, UnblockCorner,

    Integer, Boolean, LiteralString,

    Identifier,

    NotEqual, Equal, SimpleAssign,
    Comma, Colon, SemiColon,
    GET, LET, GT, LT,
    Or, And, Not,
    AdditionOperator, Plus, Minus,
    MultiplicationOperator, Mult, Div,
    LParen, RParen
} = RSLexer.tokensObject;


const RSParserErrorProvider = {
    // improve mismatch type handling
    buildMismatchTokenMessage: function (options) {
        return (
            `Se esperaba '${options.expected.LABEL}' en la Ln ${options.actual.startLine}, Col ${options.actual.startColumn} pero se encontro '${options.actual.tokenType.LABEL}', en la ${options.ruleName}`
        );
    },

    buildNotAllInputParsedMessage: function (options) {
        return (
            `Existe codigo extra despues de la inicializacion de los robots, en Ln ${options.firstRedundant.startLine}, Col ${options.firstRedundant.startColumn}`
        );
    },

    buildNoViableAltMessage: function (options) {
        let posiblePaths = "";
        options.expectedPathsPerAlt.forEach(path => {
            path.forEach(path => {
                if (path[0].LABEL)
                posiblePaths = posiblePaths.concat(`${path[0].LABEL}, `);
            })
        });
        if (posiblePaths !== "") posiblePaths = posiblePaths.substring(0, posiblePaths.length -2);
        return (
            `Se esperaba: ${posiblePaths}\nEn la Ln ${options.actual[0].startLine}, Col ${options.actual[0].startColumn} pero se encontro '${options.actual[0].image}', en la ${options.ruleName}`
        );
    },

    buildEarlyExitMessage: function (options) {
        return (
            `Se esperaba por lo menos un: '${options.expectedIterationPaths[0][0].LABEL}' en la Ln ${options.actual[0].startLine}, Col ${options.actual[0].startColumn} pero se encontro '${options.actual[0].tokenType.LABEL}' en la ${options.ruleName}`
        );
    }
};
const parserConfig = {
    errorMessageProvider: RSParserErrorProvider
}
class RobotScriptParser extends CstParser {
    constructor() {
        super(
            allTokens,
            parserConfig
        );
        
        const $ = this;

        $.RULE("section_variables", () => {
            $.CONSUME(Variables)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_variable)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("declaration_variable", () => {
            $.CONSUME1(Identifier)
            $.MANY(() => {
                $.CONSUME(Comma)
                $.CONSUME2(Identifier)
            })
            $.CONSUME(Colon)
            $.CONSUME(TypeValue)
        })

        $.RULE("statement", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.statement_if) },
                { ALT: () => $.SUBRULE($.statement_for) },
                { ALT: () => $.SUBRULE($.statement_while) },
                { ALT: () => $.SUBRULE($.statement_block) },
                { ALT: () => $.SUBRULE($.statement_assign) },
                { ALT: () => $.SUBRULE($.action_method_complex) },
                { ALT: () => $.SUBRULE($.call_procedure) },
                { ALT: () => $.SUBRULE($.action_method) },
            ])
        })
        $.RULE("statement_if", () => {
            $.CONSUME(If)
            $.SUBRULE($.paren_expr)
            $.SUBRULE1($.statement)
            $.OPTION(() => {
                $.CONSUME(Else)
                $.SUBRULE2($.statement)
            })
        })
        $.RULE("statement_for", () => {
            $.CONSUME(For)
            $.SUBRULE($.paren_expr)
            $.SUBRULE($.statement)
        })
        $.RULE("statement_while", () => {
            $.CONSUME(While)
            $.SUBRULE($.paren_expr)
            $.SUBRULE($.statement)
        })
        $.RULE("statement_block", () => {
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
              $.SUBRULE($.statement)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("statement_assign", () => {
            $.CONSUME(Identifier)
            $.CONSUME(SimpleAssign)
            $.SUBRULE($.expression)
        })

        $.RULE("call_procedure", () => {
            $.CONSUME(Identifier)
            $.CONSUME(LParen)
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.SUBRULE($.expression)
                }
            })
            $.CONSUME(RParen)
        })

        $.RULE("action_method_complex", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.change_position) },
                { ALT: () => $.SUBRULE($.generate_number) },
                { ALT: () => $.SUBRULE($.inform) },
                { ALT: () => $.SUBRULE($.message) },
                { ALT: () => $.SUBRULE($.control_corner) },
            ])
        })
        $.RULE("change_position", () => {
            $.CONSUME(ChangePosition)
            $.CONSUME(LParen)
            $.SUBRULE1($.expression)
            $.CONSUME(Comma)
            $.SUBRULE2($.expression)
            $.CONSUME(RParen)
        })
        $.RULE("generate_number", () => {
            $.CONSUME(GenerateNumber)
            $.CONSUME(LParen)
            $.CONSUME(Identifier)
            $.CONSUME1(Comma)
            $.SUBRULE1($.expression)
            $.CONSUME2(Comma)
            $.SUBRULE2($.expression)
            $.CONSUME(RParen)
        })
        $.RULE("inform", () => {
            $.CONSUME(Inform)
            $.CONSUME(LParen)
            $.OR([
                { ALT : () => {
                    $.CONSUME1(LiteralString)
                    $.CONSUME(Comma)
                    $.SUBRULE1($.expression)
                }},
                { ALT : () => $.SUBRULE2($.expression)},
                { ALT : () => $.CONSUME2(LiteralString)}
            ])
            $.CONSUME(RParen)
        })
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
        })
        $.RULE("control_corner", () => {
            $.CONSUME(ControlCorner)
            $.CONSUME(LParen)
            $.SUBRULE1($.expression)
            $.CONSUME(Comma)
            $.SUBRULE2($.expression)
            $.CONSUME(RParen)
        })

        $.RULE("action_method", () => {
            $.OR([
                { ALT: () => $.CONSUME(Movement, { LABEL : "action_method"}) },
                { ALT: () => $.CONSUME(TakeItem, { LABEL : "action_method"}) },
                { ALT: () => $.CONSUME(DepositItem, { LABEL : "action_method"}) },
                { ALT: () => $.CONSUME(ChangeDirection, { LABEL : "action_method"}) },
            ])
        })

        $.RULE("state_method", () => {
            $.CONSUME(StateMethod, { LABEL : "state_method"})
        })


        //Expressions
        $.RULE("expression", () => {
            $.SUBRULE($.equality)
        })

        $.RULE("equality", () => {
            $.SUBRULE1($.comparison)
            $.MANY(() => {
                $.OR([
                    { ALT : () => $.CONSUME(NotEqual, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(Equal, { LABEL : "operator" })},
                ])
                $.SUBRULE2($.comparison)
            })
        })

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
        })

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
        })

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
        })

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
        })
        
        $.RULE("primary", () => {
            $.OR([
                { ALT: () => $.CONSUME(Integer)},
                { ALT: () => $.CONSUME(Boolean)},
                { ALT: () => $.CONSUME(Identifier)},
                { ALT: () => $.SUBRULE($.state_method)},
                { ALT: () => $.SUBRULE($.paren_expr)}
            ])
        })

        $.RULE("paren_expr", () => {
            $.CONSUME(LParen);
            $.SUBRULE($.expression);
            $.CONSUME(RParen);
        })

        
        //Program Estructure
        $.RULE("program", () => {
            $.SUBRULE($.section_name)
            $.OPTION(() => {
                $.SUBRULE($.section_procedures)
            })
            $.SUBRULE($.section_areas)
            $.SUBRULE($.section_robots)
            $.SUBRULE($.section_instances)
            $.SUBRULE($.section_main)
        })

        $.RULE("section_name", () => {
            $.CONSUME(Program)
            $.CONSUME(Identifier)
        })

        $.RULE("section_procedures", () => {
            $.CONSUME(Procedures)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_procedure)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("declaration_procedure", () => {
            $.CONSUME(Procedure)
            $.CONSUME(Identifier)
            $.CONSUME(LParen)
            $.MANY_SEP({
                SEP: SemiColon,
                DEF: () => {
                    $.SUBRULE($.declaration_parameter)
                }
            })
            $.CONSUME(RParen)
            $.OPTION(() => {
                $.SUBRULE($.section_variables)
            })
            $.CONSUME(Begin)
            $.CONSUME(Indent)
            $.MANY(() => {
                $.SUBRULE($.statement)
            })
            $.CONSUME(Outdent)
            $.CONSUME(End)
        })
        $.RULE("declaration_parameter", () => {
            $.CONSUME(TypeParameter)
            $.CONSUME(Identifier)
            $.CONSUME(Colon)
            $.CONSUME(TypeValue)
        })

        $.RULE("section_areas", () => {
            $.CONSUME(Areas)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_area)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("declaration_area", () => {
            $.CONSUME(Identifier)
            $.CONSUME(Colon)
            $.CONSUME(TypeArea)
            $.CONSUME(LParen)
            $.CONSUME1(Integer)
            $.CONSUME1(Comma)
            $.CONSUME2(Integer)
            $.CONSUME2(Comma)
            $.CONSUME3(Integer)
            $.CONSUME3(Comma)
            $.CONSUME4(Integer)
            $.CONSUME(RParen)
        })

        $.RULE("section_robots", () => {
            $.CONSUME(Robots)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_robot)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("declaration_robot", () => {
            $.CONSUME(Robot)
            $.CONSUME(Identifier)
            $.OPTION(() => {
                $.SUBRULE($.section_variables)
            })
            $.CONSUME(Begin)
            $.CONSUME(Indent)
            $.MANY(() => {
                $.SUBRULE($.statement)
            })
            $.CONSUME(Outdent)
            $.CONSUME(End)
        })

        $.RULE("section_instances", () => {
            $.CONSUME(Variables)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.declaration_instance)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("declaration_instance", () => {
            $.CONSUME(Identifier)
            $.CONSUME(Colon)
            $.CONSUME1(Identifier)
        })

        $.RULE("section_main", () => {
            $.CONSUME(Begin)
            $.CONSUME(Indent)
            $.MANY(() => {
                $.OR([
                    { ALT: () => {$.SUBRULE($.assign_area)}},
                    { ALT: () => {$.SUBRULE($.assign_item)}},
                    { ALT: () => {$.SUBRULE($.assign_origin)}},
                ])
            })
            $.CONSUME(Outdent)
            $.CONSUME(End)
        })
        $.RULE("assign_area", () => {
            $.CONSUME(AssignArea)
            $.CONSUME(LParen)
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier)
                }
            })
            $.CONSUME(RParen)
        })
        $.RULE("assign_item", () => {
            $.CONSUME(AssignItem)
            $.CONSUME(LParen)
            $.CONSUME(Identifier)
            $.CONSUME1(Comma)
            $.CONSUME1(LiteralString)
            $.OPTION(() => {
                $.CONSUME2(Comma)
                $.CONSUME2(LiteralString)
            })
            $.CONSUME3(Comma)
            $.CONSUME(Integer)
            $.CONSUME(RParen)
        })
        $.RULE("assign_origin", () => {
            $.CONSUME(AssignOrigin)
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
        })

        this.performSelfAnalysis()
    }
}
const RSParserInstance = new RobotScriptParser();


const BaseRSVisitor = RSParserInstance.getBaseCstVisitorConstructor();
class RSToAstVisitor extends BaseRSVisitor {
    constructor(){
        super();
        this.validateVisitor();
    };

    section_variables(ctx) {
        let variables = [];

        ctx.declaration_variable.forEach( dec => {
            const newVariables = this.visit(dec);
            variables = variables.concat(newVariables);
        })
        
        return variables;
    };
    declaration_variable(ctx) {
        const newVariables = [];
        const type_value = ctx.TypeValue[0].image;

        ctx.Identifier.forEach( i => {
            newVariables.push({
                type_value: type_value,
                identifier: i.image
            })
        })

        return newVariables;
    };

    statement(ctx) {
        if (ctx.statement_if){
            return this.visit(ctx.statement_if)
        }
        if (ctx.statement_for){
            return this.visit(ctx.statement_for)
        }
        if (ctx.statement_while){
            return this.visit(ctx.statement_while)
        }
        if (ctx.statement_block){
            return this.visit(ctx.statement_block)
        }
        if (ctx.statement_assign){
            return this.visit(ctx.statement_assign)
        }
        if (ctx.call_procedure){
            return this.visit(ctx.call_procedure)
        }
        if (ctx.action_method){
            return this.visit(ctx.action_method)
        }
        if (ctx.action_method_complex){
            return this.visit(ctx.action_method_complex)
        }
        console.log("No existe visitor para este statement")
    };
    statement_if(ctx) {
        const condition = this.visit(ctx.paren_expr);

        const bodyIf = this.visit(ctx.statement[0]);

        let bodyElse = {};
        if (ctx.Else) {
            bodyElse = this.visit(ctx.statement[1]);
        }
        
        return {
            // category: "STATEMENT_CONTROL",
            type: "IF",
            condition: condition,
            body: bodyIf,
            else: bodyElse
        }
    };
    statement_for(ctx) {
        const condition = this.visit(ctx.paren_expr);

        const body = this.visit(ctx.statement);
        
        return {
            // category: "STATEMENT_CONTROL",
            type: "FOR",
            condition: condition,
            body: body
        }
    };
    statement_while(ctx) {
        const condition = this.visit(ctx.paren_expr);

        const body = this.visit(ctx.statement);

        return {
            // category: "STATEMENT_CONTROL",
            type: "WHILE",
            condition: condition,
            body: body
        }
    };
    statement_block(ctx) {
        const body = [];
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
    statement_assign(ctx) {
        const identifier = ctx.Identifier[0].image;

        const value = this.visit(ctx.expression);

        return {
            type: "STATEMENT_ASSIGN",
            identifier: identifier,
            value: value
        }
    };
    call_procedure(ctx) {
        const identifier = ctx.Identifier[0].image;

        const parameters = [];
        if (ctx.expression) {
            ctx.expression.forEach( dec => {
                const parameter = this.visit(dec);
                parameters.push(parameter);
            })
        }

        return {
            type: "CALL_PROCEDURE",
            identifier : identifier,
            parameters : parameters
        }
    }
    
    action_method_complex(ctx) {
        if (ctx.change_position){
            return this.visit(ctx.change_position);
        } 
        else if (ctx.generate_number){
            return this.visit(ctx.generate_number);
        } 
        else if (ctx.inform){
            return this.visit(ctx.inform);
        } 
        else if (ctx.message){
            return this.visit(ctx.message);
        } 
        else if (ctx.control_corner){
            return this.visit(ctx.control_corner);
        }
    }
    change_position(ctx) {
        const xVal = this.visit(ctx.expression[0]);
        const yVal = this.visit(ctx.expression[1]);

        return {
            type : "CHANGE_POSITION",
            x : xVal,
            y : yVal
        }
    }
    generate_number(ctx) {
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
    //Improve inform visitor
    inform(ctx) {
        let arg1 = {};
        let arg2 = {};

        if (ctx.LiteralString) {
            arg1 = {
                type : "STRING_LITERAL",
                value : ctx.LiteralString[0].image.replaceAll(/["']/g, "")
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
            value : val,
            who : who
        }
    }
    control_corner(ctx) {
        let mode = "";
        const identifier = ctx.ControlCorner[0].image;
        if (identifier === "BloquearEsquina") {
            mode = "BLOCK"
        } else if (identifier === "LiberarEsquina") {
            mode = "UNBLOCK"
        }

        const xVal = this.visit(ctx.expression[0]);
        const yVal = this.visit(ctx.expression[1]);

        return {
            type : "CONTROL_CORNER",
            mode : mode,
            x : xVal,
            y : yVal
        }
    }

    action_method(ctx) {
        const identifier = ctx.action_method[0].image;

        return {
            type : "ACTION_METHOD",
            identifier : identifier
        }
    }

    state_method(ctx) {
        const identifier = ctx.state_method[0].image;

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
                value : Number(ctx.Integer[0].image)
            }
        }
        if (ctx.Boolean){
            return {
                type : "LITERAL_BOOLEAN",
                value : (ctx.Boolean[0].image === "verdad")
            }
        }
        if (ctx.state_method){
            return this.visit(ctx.state_method);
        }
        if (ctx.Identifier){
            return {
                type : "VARIABLE",
                identifier : ctx.Identifier[0].image
            }
        }
        if (ctx.paren_expr){
            return this.visit(ctx.paren_expr)
        }
    }
    paren_expr(ctx) {
        return this.visit(ctx.expression);
    };


    //Program estructure
    /**
     * 
     * @param {*} ctx 
     * @returns {RSProgram} a {@link RSProgram}
     */
    program(ctx) {
        const name = this.visit(ctx.section_name);
        const procedures = ctx.section_procedures? this.visit(ctx.section_procedures) : [];
        const areas = this.visit(ctx.section_areas);
        const robots = this.visit(ctx.section_robots);
        const instances = this.visit(ctx.section_instances);
        const main = this.visit(ctx.section_main);

        return {
            type: "ROBOT_SCRIPT_PROGRAM",
            value: {
                NAME: name,
                PROCEDURES: procedures,
                AREAS: areas,
                ROBOT_TYPES: robots,
                INSTANCES: instances,
                INITS: main
            }
        };
    };

    section_name(ctx) {
        const identifier = ctx.Identifier[0].image;

        return {
            type: "IDENTIFIER",
            identifier: identifier
        };
    };

    section_procedures(ctx) {
        const procedures = [];

        ctx.declaration_procedure.forEach( dec => {
            const procedure = this.visit(dec);
            procedures.push(procedure);
        })

        return procedures;
    };
    declaration_procedure(ctx) {
        const identifier = ctx.Identifier[0].image;

        const parameters = [];
        if (ctx.declaration_parameter) {
            ctx.declaration_parameter.forEach( dec => {
                const parameter = this.visit(dec);
                parameters.push(parameter);
            })
        }

        let variables = [];
        if (ctx.section_variables) {
            variables = this.visit(ctx.section_variables)
        }

        const body = [];
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
    declaration_parameter(ctx) {
        const type_parameter = ctx.TypeParameter[0].image;
        const identifier = ctx.Identifier[0].image;
        const type_value = ctx.TypeValue[0].image;

        return {
            type_parameter: type_parameter,
            identifier: identifier,
            type_value: type_value
        }
    };

    section_areas(ctx) {
        const areas = [];

        ctx.declaration_area.forEach( dec => {
            const area = this.visit(dec);
            areas.push(area);
        })

        return areas;
    };
    declaration_area(ctx) {
        const identifier = ctx.Identifier[0].image;

        let area_type = "";
        const type = ctx.TypeArea[0].image;
        if (type === "AreaC") {
            area_type = "SHARED"
        }
        else if (type === "AreaPC") {
            area_type = "SEMI_PRIVATE"
        }
        else if (type === "AreaP") {
            area_type = "PRIVATE"
        }
        
        const a = {
            x : Number(ctx.Integer[0].image),
            y : Number(ctx.Integer[1].image),
        };

        const b = {
            x : Number(ctx.Integer[2].image),
            y : Number(ctx.Integer[3].image),
        };

        return {
            type: area_type,
            identifier : identifier,
            a : a,
            b : b
        }
    };

    section_robots(ctx) {
        const robot_types = [];

        ctx.declaration_robot.forEach( dec => {
            const robot = this.visit(dec);
            robot_types.push(robot);
        })

        return robot_types;
    };
    declaration_robot(ctx) {
        const identifier = ctx.Identifier[0].image;

        let variables = [];
        if (ctx.section_variables) {
            variables = this.visit(ctx.section_variables)
        }

        const body = [];
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

    section_instances(ctx) {
        const instances = [];

        ctx.declaration_instance.forEach( dec => {
            const instance = this.visit(dec);
            instances.push(instance);
        })

        return instances;
    };
    declaration_instance(ctx) {
        const identifier = ctx.Identifier[0].image;
        const robot_type = ctx.Identifier[1].image;

        return {
            type : robot_type,
            identifier : identifier
        }
    };

    section_main(ctx) {
        const areas_asignation = [];
        if (ctx.assign_area) {
            ctx.assign_area.forEach( dec => {
                const area = this.visit(dec);
                areas_asignation.push(area);
            })
        }

        const items_asignation = [];
        if (ctx.assign_item) {
            ctx.assign_item.forEach( dec => {
                const item = this.visit(dec);
                items_asignation.push(item);
            })
        }

        const origin_asignation = [];
        if (ctx.assign_origin) {
            ctx.assign_origin.forEach( dec => {
                const position = this.visit(dec);
                origin_asignation.push(position);
            })
        }

        return {
            assign_areas: areas_asignation,
            assign_items: items_asignation,
            assign_origins: origin_asignation
        }
    };
    assign_area(ctx) {
        const identifier = ctx.Identifier[0].image;
        const area_type = ctx.Identifier[1].image;

        return {
            type : area_type,
            identifier : identifier
        }
    };
    assign_item(ctx) {
        const identifier = ctx.Identifier[0].image;

        const item_type = [];

        ctx.LiteralString.forEach(type => {
            const id = type.image.replaceAll(/["']/g, "");
            item_type.push(id === "flores"? "flower":
                           id === "papeles"? "paper": id);
        });

        const quantity = Number(ctx.Integer[0].image);

        return {
            identifier : identifier,
            type : item_type,
            value : quantity
        }
    };
    assign_origin(ctx) {
        const identifier = ctx.Identifier[0].image;
        
        const xVal = Number(ctx.Integer[0].image)
        const yVal = Number(ctx.Integer[1].image)

        return {
            identifier : identifier,
            x : xVal,
            y : yVal
        }
    };
};
const toAstVisitorInstance = new RSToAstVisitor();


/**
 * Take a RobotScript code and generate the corresponding {@link RSProgram}, if there is a error in the process it returns the related information
 * @param {string} inputText 
 * @returns {transpalingResult} a {@link transpalingResult}
 */
function toAst(inputText) {
    // Lexing
    const lexResult = RSLexer.tokenize(inputText);

    if (lexResult.errors.length > 0) {
        return {
            ast : null,
            error : "lexer",
            errors : lexResult.errors
        };
    };

    // Parsing
    RSParserInstance.input = lexResult.tokens;
    
    const cst = RSParserInstance.program();
    if (RSParserInstance.errors.length > 0) {
        return {
            ast : null,
            error : "parser",
            errors : RSParserInstance.errors
        };
    };

    /**
     * @type {RSProgram}
     */
    const ast = toAstVisitorInstance.visit(cst);
    return {
        ast : ast,
        error : null,
        errors : null
    };
};

export {toAst};
