define("ace/theme/darkplus",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

    exports.isDark = true;
    exports.cssClass = "ace-darkplus";
    exports.cssText = "\
    .ace-darkplus .ace_gutter {\
    background: #181818;\
    color: #aaaaaa\
    }\
    .ace-darkplus .ace_print-margin {\
    width: 1px;\
    background: #44475a\
    }\
    .ace-darkplus {\
    background-color: #181818;\
    color: #dddddd\
    }\
    .ace-darkplus .ace_cursor {\
    color: #f8f8f0\
    }\
    .ace-darkplus .ace_marker-layer .ace_selection {\
    background: #44475a5f\
    }\
    .ace-darkplus.ace_multiselect .ace_selection.ace_start {\
    box-shadow: 0 0 3px 0px #282a36;\
    border-radius: 2px\
    }\
    .ace-darkplus .ace_marker-layer .ace_step {\
    background: rgb(198, 219, 174)\
    }\
    .ace-darkplus .ace_marker-layer .ace_bracket {\
    margin: -1px 0 0 -1px;\
    border: 1px solid #a29709\
    }\
    .ace-darkplus .ace_marker-layer .ace_active-line {\
    background: #44475a3f\
    }\
    .ace-darkplus .ace_gutter-active-line {\
    background-color: #44475a3f\
    }\
    .ace-darkplus .ace_marker-layer .ace_selected-word {\
    box-shadow: 0px 0px 0px 1px #a29709;\
    border-radius: 3px;\
    }\
    .ace-darkplus .ace_fold {\
    background-color: #50fa7b;\
    border-color: #f8f8f2\
    }\
    .ace-darkplus .ace_keyword {\
    color: #d197d9\
    }\
    .ace-darkplus .ace_keyword.ace_control {\
    color: #d197d9\
    }\
    .ace-darkplus .ace_keyword.ace_operator {\
    color: #dddddd\
    }\
    .ace-darkplus .ace_keyword.ace_others {\
    color: #d25252\
    }\
    .ace-darkplus .ace_constant.ace_language {\
    color: #7fb347\
    }\
    .ace-darkplus .ace_constant.ace_numeric {\
    color: #7fb347\
    }\
    .ace-darkplus .ace_constant.ace_character {\
    color: #bd93f9\
    }\
    .ace-darkplus .ace_constant.ace_character.ace_escape {\
    color: #ff79c6\
    }\
    .ace-darkplus .ace_constant.ace_other {\
    color: #dddddd\
    }\
    .ace-darkplus .ace_support.ace_function {\
    color: #dcdcaa\
    }\
    .ace-darkplus .ace_support.ace_constant {\
    color: #6be5fd\
    }\
    .ace-darkplus .ace_support.ace_class {\
    color: #66d9ef\
    }\
    .ace-darkplus .ace_support.ace_type {\
    color: #66d9ef\
    }\
    .ace-darkplus .ace_storage {\
    color: #79abff\
    }\
    .ace-darkplus .ace_storage.ace_type {\
    color: #79abff\
    }\
    .ace-darkplus .ace_invalid {\
    color: #F8F8F0;\
    background-color: #ff79c6\
    }\
    .ace-darkplus .ace_invalid.ace_deprecated {\
    color: #F8F8F0;\
    background-color: #bd93f9\
    }\
    .ace-darkplus .ace_string {\
    color: #ce9178\
    }\
    .ace-darkplus .ace_comment {\
    color: #608b4e\
    }\
    .ace-darkplus .ace_variable {\
    color: #50fa7b\
    }\
    .ace-darkplus .ace_variable.ace_parameter {\
    color: #ffb86c\
    }\
    .ace-darkplus .ace_entity.ace_other.ace_attribute-name {\
    color: #50fa7b\
    }\
    .ace-darkplus .ace_entity.ace_name.ace_function {\
    color: #50fa7b\
    }\
    .ace-darkplus .ace_entity.ace_name.ace_tag {\
    color: #ff79c6\
    }\
    .ace-darkplus .ace_invisible {\
    color: #626680;\
    }\
    .ace-darkplus .ace_indent-guide {\
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y\
    }";
    exports.$selectionColorConflict = true;
    
    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass, false);
    });
    
    (function() {
        window.require(["ace/theme/darkplus"], function(m) {
            if (typeof module == "object" && typeof exports == "object" && module) {
                module.exports = m;
            }
        });
    })();