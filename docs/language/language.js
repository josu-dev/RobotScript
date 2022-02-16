"use strict";

import StorageAdministrator from "../../general/StorageAdministrator.js";
import PageManager from "../../general/PageManager.js";
import RSLexer from "../../ide/js/editor/RSLexer.js";

const CstParser = chevrotain.CstParser;


const myStorage = new StorageAdministrator();

const myPage = new PageManager({
    storage : myStorage
});


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

    AccionMethod,
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
    AddicionOperator, Plus, Minus,
    MultiplicacionOperator, Mult, Div,
    LParen, RParen
} = RSLexer.tokensObject;

class RSParserSpanish extends CstParser {
    constructor() {
        super(allTokens);
        
        const $ = this;
        $.RULE("PROGRAMA", () => {
            $.SUBRULE($.SEC_NOMBRE)
            $.OPTION(() => {
                $.SUBRULE($.SEC_PROCEDIMIENTOS)
            })
            $.SUBRULE($.SEC_AREAS)
            $.SUBRULE($.SEC_ROBOTS)
            $.SUBRULE($.SEC_INSTANCIAS)
            $.SUBRULE($.SEC_PRINCIPAL)
        })

        $.RULE("SEC_NOMBRE", () => {
            $.CONSUME(Program)
            $.CONSUME(Identifier)
        })

        $.RULE("SEC_PROCEDIMIENTOS", () => {
            $.CONSUME(Procedures)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.dec_procedimiento)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("dec_procedimiento", () => {
            $.CONSUME(Procedure)
            $.CONSUME(Identifier)
            $.CONSUME(LParen)
            $.OPTION1(() => {
                $.SUBRULE($.dec_parametros)
            })
            $.CONSUME(RParen)
            $.OPTION2(() => {
                $.SUBRULE($.SEC_VARIABLES)
            })
            $.SUBRULE($.dec_cuerpo)
        })
        $.RULE("dec_parametros", () => {
            $.AT_LEAST_ONE_SEP({
                SEP: SemiColon,
                DEF: () => {
                    $.OR1([
                        {ALT:()=>{$.CONSUME(ReferenceParameter)}},
                        {ALT:()=>{$.CONSUME(ValueParameter)}}
                    ])
                    $.CONSUME(Identifier)
                    $.CONSUME(Colon)
                    $.OR2([
                        {ALT:()=>{$.CONSUME(TypeNumber)}},
                        {ALT:()=>{$.CONSUME(TypeBoolean)}}
                    ])
                }
            })
        })

        $.RULE("SEC_AREAS", () => {
            $.CONSUME(Areas)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.dec_area)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("dec_area", () => {
            $.CONSUME(Identifier)
            $.CONSUME(Colon)
            $.OR1([
                {ALT:()=>{$.CONSUME(AreaShared)}},
                {ALT:()=>{$.CONSUME(AreaSemiPrivate)}},
                {ALT:()=>{$.CONSUME(AreaPrivate)}},
            ])
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

        $.RULE("SEC_ROBOTS", () => {
            $.CONSUME(Robots)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.dec_robot)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("dec_robot", () => {
            $.CONSUME(Robot)
            $.CONSUME(Identifier)
            $.OPTION(() => {
                $.SUBRULE($.SEC_VARIABLES)
            })
            $.SUBRULE($.dec_cuerpo)
        })

        $.RULE("SEC_INSTANCIAS", () => {
            $.CONSUME(Variables)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.dec_instancia)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("dec_instancia", () => {
            $.CONSUME1(Identifier)
            $.CONSUME(Colon)
            $.CONSUME2(Identifier)
        })

        $.RULE("SEC_PRINCIPAL", () => {
            $.CONSUME(Begin)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE1(() => {
                $.SUBRULE($.asignar_area)
            })
            $.OPTION(() => {
                $.SUBRULE($.asignar_item)
            })
            $.AT_LEAST_ONE2(() => {
                $.SUBRULE($.asignar_origen)
            })
            $.CONSUME(Outdent)
            $.CONSUME(End)
        })
        $.RULE("asignar_area", () => {
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
        $.RULE("asignar_item", () => {
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
        $.RULE("asignar_origen", () => {
            $.CONSUME(AssignOrigin)
            $.CONSUME(LParen)
            $.CONSUME(Identifier)
            $.CONSUME1(Comma)
            $.CONSUME1(Integer)
            $.CONSUME2(Comma)
            $.CONSUME2(Integer)
            $.CONSUME(RParen)
        })

        $.RULE("SEC_VARIABLES", () => {
            $.CONSUME(Variables)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.dec_variable)
            })
            $.CONSUME(Outdent)
        })
        $.RULE("dec_variable", () => {
            $.CONSUME1(Identifier)
            $.MANY(() => {
                $.CONSUME(Comma)
                $.CONSUME2(Identifier)
            })
            $.CONSUME(Colon)
            $.OR([
                {ALT:()=>{$.CONSUME(TypeNumber)}},
                {ALT:()=>{$.CONSUME(TypeBoolean)}}
            ])
        })

        $.RULE("dec_cuerpo", () => {
            $.CONSUME(Begin)
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.sentencia)
            })
            $.CONSUME(Outdent)
            $.CONSUME(End)
        })

        $.RULE("sentencia", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.asignacion) },
                { ALT: () => $.SUBRULE($.accion_simple) },
                { ALT: () => $.SUBRULE($.si) },
                { ALT: () => $.SUBRULE($.repetir) },
                { ALT: () => $.SUBRULE($.mientras) },
                { ALT: () => $.SUBRULE($.bloque) },
                { ALT: () => $.SUBRULE($.accion_compleja) },
                { ALT: () => $.SUBRULE($.llamado_procedimiento) },
            ])
        })

        $.RULE("asignacion", () => {
            $.CONSUME(Identifier)
            $.CONSUME(SimpleAssign)
            $.SUBRULE($.expresion)
        })

        $.RULE("accion_simple", () => {
            $.OR([
                { ALT: () => $.CONSUME(Movement) },
                { ALT: () => $.CONSUME(ChangeDirection) },
                { ALT: () => $.CONSUME(TakeFlower) },
                { ALT: () => $.CONSUME(TakePaper) },
                { ALT: () => $.CONSUME(DepositFlower) },
                { ALT: () => $.CONSUME(DepositPaper) },
            ])
        })

        $.RULE("si", () => {
            $.CONSUME(If)
            $.SUBRULE1($.condicion)
            $.SUBRULE1($.bloque)
            $.OPTION(() => {
                $.CONSUME(Else)
                $.SUBRULE2($.bloque)
            })
        })

        $.RULE("repetir", () => {
            $.CONSUME(For)
            $.SUBRULE1($.condicion)
            $.SUBRULE($.sentencia)
        })

        $.RULE("mientras", () => {
            $.CONSUME(While)
            $.SUBRULE1($.condicion)
            $.SUBRULE($.sentencia)
        })

        $.RULE("bloque", () => {
            $.CONSUME(Indent)
            $.AT_LEAST_ONE(() => {
              $.SUBRULE($.sentencia)
            })
            $.CONSUME(Outdent)
        })

        $.RULE("accion_compleja", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.cambiar_posicion) },
                { ALT: () => $.SUBRULE($.generar_numero) },
                { ALT: () => $.SUBRULE($.informar) },
                { ALT: () => $.SUBRULE($.mensaje) },
                { ALT: () => $.SUBRULE($.controlar_esquina) },
            ])
        })

        $.RULE("llamado_procedimiento", () => {
            $.CONSUME(Identifier)
            $.CONSUME(LParen)
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.SUBRULE($.expresion)
                }
            })
            $.CONSUME(RParen)
        })

        $.RULE("cambiar_posicion", () => {
            $.CONSUME(ChangePosition)
            $.CONSUME(LParen)
            $.SUBRULE1($.expresion)
            $.CONSUME(Comma)
            $.SUBRULE2($.expresion)
            $.CONSUME(RParen)
        })
        $.RULE("generar_numero", () => {
            $.CONSUME(GenerateNumber)
            $.CONSUME(LParen)
            $.CONSUME(Identifier)
            $.CONSUME1(Comma)
            $.SUBRULE1($.expresion)
            $.CONSUME2(Comma)
            $.SUBRULE2($.expresion)
            $.CONSUME(RParen)
        })
        $.RULE("informar", () => {
            $.CONSUME(Inform)
            $.CONSUME(LParen)
            $.OR([
                { ALT : () => {
                    $.CONSUME1(LiteralString)
                    $.CONSUME(Comma)
                    $.SUBRULE1($.expresion)
                }},
                { ALT : () => $.SUBRULE2($.expresion)},
                { ALT : () => $.CONSUME2(LiteralString)},
            ])
            $.CONSUME(RParen)
        })
        $.RULE("mensaje", () => {
            $.OR1([
                { ALT : () => {$.CONSUME(SendMessage)}},
                { ALT : () => {$.CONSUME(ReciveMessage)}},
            ])
            $.CONSUME(LParen)
            $.SUBRULE($.expresion)
            $.CONSUME(Comma)
            $.OR2([
                { ALT : () => $.CONSUME(Identifier)},
                { ALT : () => $.CONSUME(Mult)}
            ])
            $.CONSUME(RParen)
        })
        $.RULE("controlar_esquina", () => {
            $.OR1([
                { ALT : () => {$.CONSUME(BlockCorner)}},
                { ALT : () => {$.CONSUME(UnblockCorner)}},
            ])
            $.CONSUME(LParen)
            $.SUBRULE1($.expresion)
            $.CONSUME(Comma)
            $.SUBRULE2($.expresion)
            $.CONSUME(RParen)
        })

        $.RULE("condicion", () => {
            $.CONSUME(LParen)
            $.AT_LEAST_ONE(() => {
                $.SUBRULE1($.expresion)
            })
            $.CONSUME(RParen)
        })

        $.RULE("expresion", () => {
            $.SUBRULE($.igualdad)
        })

        $.RULE("igualdad", () => {
            $.SUBRULE1($.comparacion)
            $.MANY(() => {
                $.OR([
                    { ALT : () => $.CONSUME(NotEqual, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(Equal, { LABEL : "operator" })},
                ])
                $.SUBRULE2($.comparacion)
            })
        })

        $.RULE("comparacion", () => {
            $.SUBRULE1($.termino)
            $.MANY(() => {
                $.OR([
                    { ALT : () => $.CONSUME(GT, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(GET, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(LT, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(LET, { LABEL : "operator" })},
                ])
                $.SUBRULE2($.termino)
            })
        })

        $.RULE("termino", () => {
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
            $.SUBRULE1($.unaria)
            $.MANY(() => {
                $.OR([
                    { ALT : () => $.CONSUME(Div, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(Mult, { LABEL : "operator" })},
                    { ALT : () => $.CONSUME(And, { LABEL : "operator" })},
                ])
                $.SUBRULE2($.unaria)
            })
        })

        $.RULE("unaria", () => {
            $.OR1([
                { ALT: () => {
                    $.OR2([
                        { ALT: () => $.CONSUME(Not) },
                        { ALT: () => $.CONSUME(Minus) },
                    ])
                    $.SUBRULE($.unaria)
                }},
                { ALT : () => $.SUBRULE($.primario) }
            ])
        })
        
        $.RULE("primario", () => {
            $.OR([
                { ALT: () => $.CONSUME(Integer)},
                { ALT: () => $.CONSUME(Boolean)},
                { ALT: () => $.CONSUME(Identifier)},
                { ALT: () => $.SUBRULE($.consulta_estado)},
                { ALT: () => $.SUBRULE($.expresion_parentisada)}
            ])
        })

        $.RULE("consulta_estado", () => {
            $.OR([
                { ALT: () => $.CONSUME(ConsultFI)},
                { ALT: () => $.CONSUME(ConsultPI)},
                { ALT: () => $.CONSUME(ConsultFC)},
                { ALT: () => $.CONSUME(ConsultPC)},
            ])
        })

        $.RULE("expresion_parentisada", () => {
            $.CONSUME(LParen);
            $.SUBRULE($.expresion);
            $.CONSUME(RParen);
        })

        this.performSelfAnalysis()
    }
}
const parserInstance = new RSParserSpanish();

const CUSTOM_SYNTAX_CSS = `<style type="text/css">
:root {
    --clr-pr-000: hsl(0,0%,100%);
    --clr-pr-100: hsl(0,0%,92%);
    --clr-pr-150: hsl(0,0%,88%);

    --clr-bg-900: hsl(0,0%,8%);
    --clr-bg-800: hsl(0,0%,16%);
    --clr-bg-700: hsl(0,0%,24%);
    --clr-bg-600: hsl(0,0%,32%);
    --clr-bg-500: hsl(0,0%,40%);
    
    --clr-br-0: hsl(32,100%,40%);
    --clr-br-no-seleccion-1: hsl(16,100%,40%);
    --clr-br-no-seleccion-2: hsl(24,100%,40%);
    --clr-br-seleccion-1: hsl(12,100%,50%);
    --clr-br-seleccion-2: hsl(20,100%,50%);

    --clr-bg-no-seleccion-1: hsl(0,100%,96%);
    --clr-bg-no-seleccion-2: hsl(0,100%,92%);
    --clr-bg-seleccion-1: hsl(60,100%,45%);
    --clr-bg-seleccion-2: hsl(60,100%,45%);
    --clr-bg-seleccion-3: hsl(60,100%,15%);
    
    --gdt-tb-rs: to bottom, hsl(0,100%,50%) , hsl(30,100%,50%);
    --gdt-tb-rs-a0: to bottom, hsl(0,100%,35%) , hsl(30,100%,35%);
    --gdt-tr-rs: to right, hsl(0,100%,50%) , hsl(30,100%,50%);
    --gdt-tl-rs: to left, hsl(0,100%,50%) , hsl(30,100%,50%);
    --gdt-tl-rs-a0: to left, hsl(0,100%,35%) , hsl(30,100%,35%);
}

body {
    background-color: var(--clr-bg-900);
    color: var(--clr-pr-150);
}

svg {
    fill: black;
}

svg.railroad-diagram path {
    stroke-width: 3;
    stroke: var(--clr-br-0);
    fill: rgba(0, 0, 0, 0);
}

svg.railroad-diagram text {
    font: bold 14px monospace;
    text-anchor: middle;
}

svg.railroad-diagram text.label {
    text-anchor: start;
}

svg.railroad-diagram text.comment {
    font: italic 12px monospace;
}

svg.railroad-diagram g.non-terminal rect {
    stroke-width: 1;
    stroke: black;
    fill: var(--clr-bg-no-seleccion-1);
}

svg.railroad-diagram rect {
    stroke-width: 1;
    stroke: black;
    fill: var(--clr-bg-no-seleccion-2);
}

.diagramHeader {
    display: inline-block;
    -webkit-touch-callout: default;
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    font-weight: bold;
    font-family: monospace;
    font-size: 18px;
    margin-bottom: -8px;
    text-align: center;
}

.diagramHeaderDef {
    background-color: var(--clr-bg-seleccion-3);
}

svg.railroad-diagram text {
    -webkit-touch-callout: default;
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
}

svg.railroad-diagram g.non-terminal rect.diagramRectUsage {
    color: green;
    fill: var(--clr-bg-seleccion-1);
    stroke-width: 2;
    stroke: var(--clr-br-seleccion-1);
}

svg.railroad-diagram g.terminal rect.diagramRectUsage {
    color: green;
    fill: var(--clr-bg-seleccion-2);
    stroke-width: 2;
    stroke: var(--clr-br-seleccion-1);
}

div {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

svg {
    width: 100%;
}

svg.railroad-diagram g.non-terminal text {
    cursor: pointer;
}

::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
}

::-webkit-scrollbar-track {
    background: var(--clr-bg-900);
}

::-webkit-scrollbar-thumb:vertical {
    background: linear-gradient(var(--gdt-tb-rs-a0));
}
::-webkit-scrollbar-thumb:vertical:hover {
    background: linear-gradient(var(--gdt-tb-rs));
}
::-webkit-scrollbar-thumb:horizontal {
    background: linear-gradient(var(--gdt-tl-rs-a0));
}
::-webkit-scrollbar-thumb:horizontal:hover {
    background: linear-gradient(var(--gdt-tl-rs));
}
</style>`;

// extract the serialized grammar.
const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar);
const myHtmlText = htmlText.replace(`<link rel='stylesheet' href='https://unpkg.com/chevrotain@10.0.0/diagrams/diagrams.css'>`,CUSTOM_SYNTAX_CSS);
const innerFrame = document.getElementById("innerFrame")

innerFrame.src = 'data:text/html;charset=utf-8,' + encodeURI(myHtmlText);
