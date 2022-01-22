"use strict";

const DEFAULT_EDITOR_CODE_TEXT = `Hello world!`;


//Setup Ace
//ace.edit need and element or an id
const codeEditor = ace.edit("editorProgram");

let editorLib = { 
    init() {
        // Configure editor
        codeEditor.setOptions({
            autoScrollEditorIntoView: true,
            copyWithEmptySelection: true,
        });

        //Configure renderer
        codeEditor.renderer.setOptions({
            highlightGutterLine : false,
            showPrintMargin: false,
            displayIndentGuides : true,
            fontFamily : "monospace",
            fontSize : "1rem",
            scrollPastEnd : 1,
            fixedWidthGutter : true,
            theme : "ace/theme/dracula",
        });

        //Configure session
        codeEditor.session.setOptions({
            useSoftTabs : false,
            tabSize : 2,
            mode : "ace/mode/robotscript",
        });

        //Configure extensions
        codeEditor.setOptions({
            enableBasicAutocompletion : true,
            enableLiveAutocompletion : true,
        });

        //Set initial text
        codeEditor.setValue(DEFAULT_EDITOR_CODE_TEXT);
    },
};


editorLib.init();