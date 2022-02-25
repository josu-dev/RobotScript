define("ace/mode/robotscript_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*";

var RobotScriptHighlightRules = function() {

    var keywordControls = (
        "si|sino|repetir|mientras"
    );
    
    var storageType = (
        "boolean|numero|string|AreaC|AreaPC|AreaP|proceso|robot"
    );

    var storageModifiers = (
        "ES|E"
    );

    var keywordOthers = (
        "programa|procesos|areas|robots|variables|comenzar|fin"
    );

    var builtinConstants = (
        "verdad|falso"
    );

    var supportFunction = (
        "HayFlorEnLaEsquina|HayPapelEnLaEsquina|HayFlorEnLaBolsa|HayPapelEnLaBolsa|PosAv|PosCa|" +
        "Pos|mover|derecha|tomarFlor|tomarPapel|depositarFlor|depositarPapel|AsignarArea|AsignarItem|Iniciar|Informar|Random|" +
        "EnviarMensaje|RecibirMensaje|BloquearEsquina|LiberarEsquina"
    );

    var keywordMapper = this.$keywords = this.createKeywordMapper({
        "keyword.control" : keywordControls,
        "storage.type" : storageType,
        "storage.modifier" : storageModifiers,
        "keyword.others" : keywordOthers,
        "constant.language": builtinConstants,
        "support.function" : supportFunction,
    }, "identifier");

    var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b";
    var escapeRe = /\\(?:['"?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}U[a-fA-F\d]{8}|.)/.source;

    this.$rules = { 
        "start" : [
            {
                token : "comment",
                regex : "//",
                next : "singleLineComment"
            },
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string", // character
                regex : `["][^"\n]*["]|['][^'\n]*[']`
            }, {
                token : "string.start",
                regex : '"', 
                stateName: "qqstring",
                next: [
                    { token: "string", regex: /\\\s*$/, next: "qqstring" },
                    { token: "constant.language.escape", regex: escapeRe },
                    { token: "string.end", regex: '"|$', next: "start" },
                    { defaultToken: "string"}
                ]
            }, {
                token : "constant.numeric", // float
                regex : "\\d+\\b"
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_][a-zA-Z0-9_]*"
            }, {
                token : "keyword.operator",
                regex : /--|\+\+|<>|&&|\|\||\?:|[*%\/+\-~<>=]=?/
            }, {
              token : "punctuation.operator",
              regex : "\\?|\\:|\\,|\\;|\\."
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : "\\*\\/",
                next : "start"
            }, {
                defaultToken : "comment"
            }
        ],
        "singleLineComment" : [
            {
                token : "comment",
                regex : /\\$/,
                next : "singleLineComment"
            }, {
                token : "comment",
                regex : /$/,
                next : "start"
            }, {
                defaultToken: "comment"
            }
        ],
    };

    this.normalizeRules();
};

oop.inherits(RobotScriptHighlightRules, TextHighlightRules);


exports.RobotScriptHighlightRules = RobotScriptHighlightRules;
});

define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"], function(require, exports, module) {
    "use strict";
    
    var oop = require("../../lib/oop");
    var BaseFoldMode = require("./fold_mode").FoldMode;
    var Range = require("../../range").Range;
    
    var FoldMode = exports.FoldMode = function() {};
    oop.inherits(FoldMode, BaseFoldMode);
    
    (function() {
    
        this.getFoldWidgetRange = function(session, foldStyle, row) {
            var range = this.indentationBlock(session, row);
            if (range)
                return range;
    
            var re = /\S/;
            var line = session.getLine(row);
            var startLevel = line.search(re);
            if (startLevel == -1 || line[startLevel] != "#")
                return;
    
            var startColumn = line.length;
            var maxRow = session.getLength();
            var startRow = row;
            var endRow = row;
    
            while (++row < maxRow) {
                line = session.getLine(row);
                var level = line.search(re);
    
                if (level == -1)
                    continue;
    
                if (line[level] != "#")
                    break;
    
                endRow = row;
            }
    
            if (endRow > startRow) {
                var endColumn = session.getLine(endRow).length;
                return new Range(startRow, startColumn, endRow, endColumn);
            }
        };
        this.getFoldWidget = function(session, foldStyle, row) {
            var line = session.getLine(row);
            var indent = line.search(/\S/);
            var next = session.getLine(row + 1);
            var prev = session.getLine(row - 1);
            var prevIndent = prev.search(/\S/);
            var nextIndent = next.search(/\S/);
    
            if (indent == -1) {
                session.foldWidgets[row - 1] = prevIndent!= -1 && prevIndent < nextIndent ? "start" : "";
                return "";
            }
            if (prevIndent == -1) {
                if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
                    session.foldWidgets[row - 1] = "";
                    session.foldWidgets[row + 1] = "";
                    return "start";
                }
            } else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
                if (session.getLine(row - 2).search(/\S/) == -1) {
                    session.foldWidgets[row - 1] = "start";
                    session.foldWidgets[row + 1] = "";
                    return "";
                }
            }
    
            if (prevIndent!= -1 && prevIndent < indent)
                session.foldWidgets[row - 1] = "start";
            else
                session.foldWidgets[row - 1] = "";
    
            if (indent < nextIndent)
                return "start";
            else
                return "";
        };
    
    }).call(FoldMode.prototype);
    
});

define("ace/mode/robotscript",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/robotscript_highlight_rules","ace/mode/matching_brace_outdent","ace/range","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var RobotScriptHighlightRules = require("./robotscript_highlight_rules").RobotScriptHighlightRules;
var FoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    this.HighlightRules = RobotScriptHighlightRules;

    this.$behaviour = this.$defaultBehaviour;

    this.foldingRules = new FoldMode(); 
};
oop.inherits(Mode, TextMode);

(function() {
       
    this.lineCommentStart = ["//"];
    this.blockComment = [
        {start: "/*", end: "*/"},
    ];
    
    this.$id = "ace/mode/robotscript";
}).call(Mode.prototype);

exports.Mode = Mode;
});

(function() {
    window.require(["ace/mode/robotscript"], function(m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();