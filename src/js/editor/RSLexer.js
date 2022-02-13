"use strict";

// Uses lodash library
const createToken = chevrotain.createToken;
const createTokenInstance = chevrotain.createTokenInstance;
const Lexer = chevrotain.Lexer;

const RSLexer = (function () {
    let indentStack = [0];

    function matchIndentBase(text, offset, matchedTokens, groups, type) {
        const noTokensMatchedYet = _.isEmpty(matchedTokens);
        const newLines = groups.nl;
        const noNewLinesMatchedYet = _.isEmpty(newLines);
        const isFirstLine = noTokensMatchedYet && noNewLinesMatchedYet;
        const isStartOfLine =
            // only newlines matched so far
            (noTokensMatchedYet && !noNewLinesMatchedYet) ||
            // Both newlines and other Tokens have been matched AND the offset is just after the last newline
            (!noTokensMatchedYet && !noNewLinesMatchedYet && offset === _.last(newLines).endOffset + 1);

        if (isFirstLine || isStartOfLine) {
            let match = null;
            let currIndentLevel = undefined;

            const wsRegExp = / +/y;
            wsRegExp.lastIndex = offset;
            match = wsRegExp.exec(text);
            // possible non-empty indentation
            if (match !== null) currIndentLevel = match[0].length;
            // "empty" indentation means indentLevel of 0.
            else currIndentLevel = 0;

            const prevIndentLevel = _.last(indentStack)
            // deeper indentation
            if (currIndentLevel > prevIndentLevel && type === "indent") {
                indentStack.push(currIndentLevel)
                return match;
            }
            // shallower indentation
            else if (currIndentLevel < prevIndentLevel && type === "outdent") {
            const matchIndentIndex = _.findLastIndex(
                indentStack,
                (stackIndentDepth) => stackIndentDepth === currIndentLevel
            );

            // any outdent must match some previous indentation level.
            if (matchIndentIndex === -1) {
                throw Error(`invalid outdent at offset: ${offset}`)
            }

            const numberOfDedents = indentStack.length - matchIndentIndex - 1

            // This is a little tricky
            // 1. If there is no match (0 level indent) than this custom token
            //    matcher would return "null" and so we need to add all the required outdents ourselves.
            // 2. If there was match (> 0 level indent) than we need to add minus one number of outsents
            //    because the lexer would create one due to returning a none null result.
            let iStart = match !== null ? 1 : 0
            for (let i = iStart; i < numberOfDedents; i++) {
                indentStack.pop()
                matchedTokens.push(
                    createTokenInstance(Outdent, "", NaN, NaN, NaN, NaN, NaN, NaN)
                )
            }

            // even though we are adding fewer outdents directly we still need to update the indent stack fully.
            if (iStart === 1) {
                indentStack.pop()
            }
            return match
            }
            else return null;
        }
        else return null;
    }
    // customize matchIndentBase to create separate functions of Indent and Outdent.
    const matchIndent = _.partialRight(matchIndentBase, "indent");
    const matchOutdent = _.partialRight(matchIndentBase, "outdent");

    // the use of custom patterns is delicate
    const Indent = createToken({
        name: "Indent",
        label: "identado ->",
        pattern: matchIndent,
        // custom token patterns should explicitly specify the line_breaks option
        line_breaks: false
    });
    const Outdent = createToken({
        name: "Outdent",
        label: "identado <-",
        pattern: matchOutdent,
        // custom token patterns should explicitly specify the line_breaks option
        line_breaks: false
    });

    const Newline = createToken({
        name: "Newline",
        pattern: /\n|\r\n?/,
        group: "nl"
    });
    const Spaces = createToken({
        name: "Spaces",
        pattern: / +/,
        group: Lexer.SKIPPED
    });
    const LineComment = createToken({
        name: "LineComment",
        label: "comentario de una linea",
        pattern: /\/\/.*/,
        group: "singleLineComment",
    });
    const MultiLineComment = createToken({
        name: "MultiLineComment",
        label: "comentario de multiples lineas",
        pattern: /\/\*[\s\S]*?\*\//,
        group: "multiLineComment",
    });

    const Comma = createToken({
        name: "Comma",
        label: ",",
        pattern: /,/
    });
    const Colon = createToken({
        name: "Colon",
        label: ":",
        pattern: /:/
    });
    const SemiColon = createToken({
        name: "SemiColon",
        label: ";",
        pattern: /;/
    });
    const GET = createToken({
        name: "GET",
        label: ">=",
        pattern: />=/
    });
    const LET = createToken({
        name: "LET",
        label: "<=",
        pattern: /<=/
    });
    const GT = createToken({
        name: "GT",
        label: ">",
        pattern: />/
    });
    const LT = createToken({
        name: "LT",
        label: "<",
        pattern: /</
    });
    const NotEqual = createToken({
        name: "NotEqual",
        label: "~=",
        pattern: /~=/
    });
    const Equal = createToken({
        name: "Equal",
        label: "=",
        pattern: /=/
    });
    const SimpleAssign = createToken({
        name: "SimpleAssign",
        label: ":=",
        pattern: /:=/,
    });

    const AdditionOperator = createToken({ name: "AdditionOperator", pattern: Lexer.NA });
    const Plus = createToken({
        name: "Plus",
        label: "+",
        pattern: /\+/,
        categories: AdditionOperator
    });
    const Minus = createToken({
        name: "Minus",
        label: "-",
        pattern: /\-/,
        categories: AdditionOperator
    });

    const MultiplicationOperator = createToken({ name: "MultiplicationOperator", pattern: Lexer.NA });
    const Mult = createToken({
        name: "Mult",
        label: "*",
        pattern: /\*/,
        categories: MultiplicationOperator
    });
    const Div = createToken({
        name: "Div",
        label: "/",
        pattern: /\//,
        categories: MultiplicationOperator
    });

    const Or = createToken({
        name: "Or",
        label: "|",
        pattern: /\|/
    });
    const And = createToken({
        name: "And",
        label: "&",
        pattern: /\&/
    });
    const Not = createToken({
        name: "Not",
        label: "~",
        pattern: /\~/
    });

    const LParen = createToken({
        name: "LParen",
        label: "(",
        pattern: /\(/
    });
    const RParen = createToken({
        name: "RParen",
        label: ")",
        pattern: /\)/
    });
    const LCurly = createToken({
        name: "LCurly",
        label: "{",
        pattern: /{/
    });
    const RCurly = createToken({
        name: "RCurly",
        label: "}",
        pattern: /}/
    });


    const Identifier = createToken({
        name: "Identifier",
        label: "identificador",
        pattern: /[a-zA-ZñÑ](\w|ñ|Ñ)*/
    });
    const Natural = createToken({
        name: "Natural",
        label: "numero natural",
        pattern: /0|[1-9]\d*/
    });
    const Integer = createToken({
        name: "Integer",
        label: "numero entero",
        pattern: /0|[1-9]\d*/
    });
    const Boolean = createToken({
        name: "Boolean",
        label: "valor booleano",
        pattern: /verdad|falso/,
        longer_alt: Identifier
    });
    const LiteralString = createToken({
        name: "LiteralString",
        label: "cadena de caracteres",
        pattern: /["][^"\n]*["]|['][^'\n]*[']/
    });


    const If = createToken({
        name: "If",
        label: "si",
        pattern: /si/,
        longer_alt: Identifier
    });
    const Else = createToken({
        name: "Else",
        label: "sino",
        pattern: /sino/,
        longer_alt: Identifier
    });
    const For = createToken({
        name: "For",
        label: "repetir",
        pattern: /repetir/,
        longer_alt: Identifier
    });
    const While = createToken({
        name: "While",
        label: "mientras",
        pattern: /mientras/,
        longer_alt: Identifier
    });
    const Begin = createToken({
        name: "Begin",
        label: "comenzar",
        pattern: /comenzar/,
        longer_alt: Identifier
    });
    const End = createToken({
        name: "End",
        label: "fin",
        pattern: /fin/,
        longer_alt: Identifier
    });

    const Program = createToken({
        name: "Program",
        label: "programa",
        pattern: /programa/,
        longer_alt: Identifier
    });

    const Procedures = createToken({
        name: "Procedures",
        label: "procesos",
        pattern: /procesos/,
        longer_alt: Identifier
    });
    const Procedure = createToken({
        name: "Procedure",
        label: "proceso",
        pattern: /proceso/,
        longer_alt: Identifier
    });

    const TypeParameter = createToken({
        name: "TypeParameter",
        pattern: Lexer.NA
    });
    const ValueParameter = createToken({
        name: "ValueParameter",
        label: "E",
        pattern: /E/,
        longer_alt: Identifier,
        categories: TypeParameter
    });
    const ReferenceParameter = createToken({
        name: "ReferenceParameter",
        label: "ES",
        pattern: /ES/,
        longer_alt: Identifier,
        categories: TypeParameter
    });

    const Variables = createToken({
        name: "Variables",
        label: "variabels",
        pattern: /variables/,
        longer_alt: Identifier
    });
    const TypeValue = createToken({
        name: "TypeValue",
        pattern: Lexer.NA
    });
    const TypeBoolean = createToken({
        name: "TypeBoolean",
        label: "boolean",
        pattern: /boolean/,
        longer_alt: Identifier,
        categories: TypeValue
    });
    const TypeNumber = createToken({
        name: "TypeNumber",
        label: "numero",
        pattern: /numero/,
        longer_alt: Identifier,
        categories: TypeValue
    });

    const Areas = createToken({
        name: "Areas",
        label: "areas",
        pattern: /areas/,
        longer_alt: Identifier
    });
    const TypeArea = createToken({ name: "TypeArea", pattern: Lexer.NA });
    const AreaSemiPrivate = createToken({
        name: "AreaSemiPrivate",
        label: "AreaPC",
        pattern: /AreaPC/,
        longer_alt: Identifier,
        categories: TypeArea
    });
    const AreaPrivate = createToken({
        name: "AreaPrivate",
        label: "AreaP",
        pattern: /AreaP/,
        longer_alt: Identifier,
        categories: TypeArea
    });
    const AreaShared = createToken({
        name: "AreaShared",
        label: "AreaC",
        pattern: /AreaC/,
        longer_alt: Identifier,
        categories: TypeArea
    });

    const Robots = createToken({
        name: "Robots",
        label: "robots",
        pattern: /robots/,
        longer_alt: Identifier
    });
    const Robot = createToken({
        name: "Robot",
        label: "robot",
        pattern: /robot/,
        longer_alt: Identifier
    });

    const AssignArea = createToken({
        name: "AssignArea",
        label: "AsignarArea",
        pattern: /AsignarArea/,
        longer_alt: Identifier
    });
    const AssignItem = createToken({
        name: "AssignItem",
        label: "Asignaritem",
        pattern: /AsignarItem/,
        longer_alt: Identifier
    });
    const AssignOrigin = createToken({
        name: "AssignOrigin",
        label: "Iniciar",
        pattern: /Iniciar/,
        longer_alt: Identifier
    });

    const StateMethod = createToken({ name: "StateMethod", pattern: Lexer.NA });
    const ConsultFI = createToken({
        name: "ConsultFI",
        label: "HayFlorEnLaBolsa",
        pattern: /HayFlorEnLaBolsa/,
        longer_alt: Identifier,
        categories: StateMethod
    });
    const ConsultFC = createToken({
        name: "ConsultFC",
        label: "HayFlorEnLaEsquina",
        pattern: /HayFlorEnLaEsquina/,
        longer_alt: Identifier,
        categories: StateMethod
    });
    const ConsultPI = createToken({
        name: "ConsultPI",
        label: "HayPapelEnLaBolsa",
        pattern: /HayPapelEnLaBolsa/,
        longer_alt: Identifier,
        categories: StateMethod
    });
    const ConsultPC = createToken({
        name: "ConsultPC",
        label: "HayPapelEnLaEsquina",
        pattern: /HayPapelEnLaEsquina/,
        longer_alt: Identifier,
        categories: StateMethod
    });
    const ConsultX = createToken({
        name: "ConsultX",
        label: "PosAv",
        pattern: /PosAv/,
        longer_alt: Identifier,
        categories: StateMethod
    });
    const ConsultY = createToken({
        name: "ConsultY",
        label: "PosCa",
        pattern: /PosCa/,
        longer_alt: Identifier,
        categories: StateMethod
    });

    const ActionMethod = createToken({ name: "ActionMethod", pattern: Lexer.NA });
    const TakeItem = createToken({ name: "TakeItem", pattern: Lexer.NA });
    const TakeFlower = createToken({
        name: "TakeFlower",
        label: "tomarFlor",
        pattern: /tomarFlor/,
        longer_alt: Identifier,
        categories: [ActionMethod, TakeItem]
    });
    const TakePaper = createToken({
        name: "TakePaper",
        label: "tomarPapel",
        pattern: /tomarPapel/,
        longer_alt: Identifier,
        categories: [ActionMethod, TakeItem]
    });
    const DepositItem = createToken({ name: "DepositItem", pattern: Lexer.NA });
    const DepositFlower = createToken({
        name: "DepositFlower",
        label: "depositarFlor",
        pattern: /depositarFlor/,
        longer_alt: Identifier,
        categories: [ActionMethod, DepositItem]
    });
    const DepositPaper = createToken({
        name: "DepositPaper",
        label: "depositarPapel",
        pattern: /depositarPapel/,
        longer_alt: Identifier,
        categories: [ActionMethod, DepositItem]
    });
    const Movement = createToken({
        name: "Movement",
        label: "mover",
        pattern: /mover/,
        longer_alt: Identifier,
        categories: ActionMethod
    });
    const ChangeDirection = createToken({
        name: "ChangeDirection",
        label: "derecha",
        pattern: /derecha/,
        longer_alt: Identifier,
        categories: ActionMethod
    });

    const ChangePosition = createToken({
        name: "ChangePosition",
        label: "Pos",
        pattern: /Pos/,
        longer_alt: Identifier
    });
    const Inform = createToken({
        name: "Inform",
        label: "Informar",
        pattern: /Informar/,
        longer_alt: Identifier
    });
    const GenerateNumber = createToken({
        name: "GenerateNumber",
        label: "Random",
        pattern: /Random/,
        longer_alt: Identifier
    });
    const Message = createToken({
        name: "Message",
        pattern: Lexer.NA
    });
    const SendMessage = createToken({
        name: "SendMessage",
        label: "EnviarMensaje",
        pattern: /EnviarMensaje/,
        longer_alt: Identifier,
        categories: Message
    });
    const ReciveMessage = createToken({
        name: "ReciveMessage",
        label: "RecibirMensaje",
        pattern: /RecibirMensaje/,
        longer_alt: Identifier,
        categories: Message
    });
    const ControlCorner = createToken({
        name: "ControlCorner",
        pattern: Lexer.NA
    });
    const BlockCorner = createToken({
        name: "BlockCorner",
        label: "BloquearEsquina",
        pattern: /BloquearEsquina/,
        longer_alt: Identifier,
        categories: ControlCorner
    });
    const UnblockCorner = createToken({
        name: "UnblockCorner",
        label: "LiberarEsquina",
        pattern: /LiberarEsquina/,
        longer_alt: Identifier,
        categories: ControlCorner
    });

    const allTokens = [
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

        // symbols, operators, others
        NotEqual, Equal, SimpleAssign,
        Comma, Colon, SemiColon,
        GET, LET, GT, LT,
        Or, And, Not,
        AdditionOperator, Plus, Minus,
        MultiplicationOperator, Mult, Div,
        LParen, RParen,
    ];


    const RSLexerErrorProvider = {
        buildUnexpectedCharactersMessage( fullText, startOffset, length, line, column ) { 
            if (length === 1) return (
                `Error de escritura, el caracter '${fullText.charAt(startOffset)}' en la Ln ${line}, Col ${column} no es valido en el lenguaje`
            );
            return (
                `Error de escritura, la palabra '${fullText.slice(startOffset, (startOffset + length))}' en la Ln ${line}, Col ${column} no es valido en el lenguaje`
            );
        }
    }
    const lexerConfig = {
        errorMessageProvider : RSLexerErrorProvider,
        // In order to use identation based parsing must track full data about tokens
        // positionTracking : "onlyStart"
    };
    const lexerInstance = new Lexer(allTokens, lexerConfig);


    function objectTokens () {
        const T = {};
        allTokens.forEach(t => T[t.name] = t);
        return T;
    }
    function arrayTokens () {
        return allTokens;
    }
    function tokenize (inputText = "") {
        indentStack = [0];
        const noTabsInput = inputText.replaceAll(/\t/g, "  ");
        const lexResult = lexerInstance.tokenize(noTabsInput);

        while (indentStack.length > 1) {
            lexResult.tokens.push(
                createTokenInstance(Outdent, "", NaN, NaN, NaN, NaN, NaN, NaN)
            );
            indentStack.pop();
        }
        return lexResult;
    }

    return {
        tokensObject : objectTokens(),
        tokensArray : arrayTokens(),
        tokenize : tokenize
    }
})();

export default RSLexer;