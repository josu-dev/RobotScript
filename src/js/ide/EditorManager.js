"use Strict";

import { toAst } from "../transpiler/ast-generator.js";
import { validateAst } from "../transpiler/ast-validator.js";

const DEFAULT_EDITOR_CODE =  `programa test
procesos
  proceso juntarFlores()
  variables
    flores: numero
  comenzar
    mientras (HayFlorEnLaEsquina) {
      tomarFlor
      flores:= flores +1
    }
  fin
  proceso juntarPapeles(ES papeles: numero)
  comenzar
    mientras (HayPapelEnLaEsquina) {
      tomarPapel
      papeles:= papeles +1
    }
  fin
areas
  ciudad: AreaC(1,1,100,100)
robots
  robot juntador
  variables
    flores : numero
    aux : numero
  comenzar
    flores:= 0
    repetir (9) {
      juntarFlores()
      mover
    }
    juntarFlores()
    si (PosAv = 1) {
      EnviarMensaje(flores,r2)
      RecibirMensaje(aux,r2)
    }
    sino {
      RecibirMensaje(aux,r1)
      EnviarMensaje(flores,r1)
    }
    si (flores>aux) {
      flores:= flores - aux
      Informar(flores)
    }
  fin
variables
  r1: juntador
  r2: juntador
comenzar
  AsignarArea(r1,ciudad)
  AsignarArea(r2,ciudad)
  Iniciar(r1, 1,1)
  Iniciar(r2, 2,11)
fin`;

class EditorManager {
    constructor(editorContainer) {
        this.mainContainer = editorContainer;
        this.aceEditorContainer = this.mainContainer.querySelector(".window-editor");
        this.aceEditor = ace.edit(this.aceEditorContainer);

        this.btnUpload = this.mainContainer.querySelector(".btnUpload");
        this.btnDownload = this.mainContainer.querySelector(".btnDownload");
        this.btnCopy = this.mainContainer.querySelector(".btnCopy");
        this.btnClear = this.mainContainer.querySelector(".btnClear");
        this.btnFontSize = this.mainContainer.querySelector(".btnFontSize");
        this.btnCompile = this.mainContainer.querySelector(".btnCompile");

        this.cursorPosition = this.mainContainer.querySelector(".editor-cursor-position");
        this.customConsole = this.mainContainer.querySelector(".console-compiler");

        this.programAst = {};
    }

    init() {
        //Configure editor
        this.aceEditor.setOptions({
            autoScrollEditorIntoView: true,
            copyWithEmptySelection: true,
        });

        //Configure renderer
        this.aceEditor.renderer.setOptions({
            highlightGutterLine : true,
            showPrintMargin: false,
            displayIndentGuides : true,
            fontFamily : "monospace",
            fontSize : "1rem",
            scrollPastEnd : 1,
            theme : "ace/theme/darkplus",
        });

        //Configure session
        this.aceEditor.session.setOptions({
            useSoftTabs : false,
            tabSize : 2,
            mode : "ace/mode/robotscript",
        });

        //Configure extensions
        this.aceEditor.setOptions({
            enableBasicAutocompletion : true,
            enableLiveAutocompletion : true,
        });

        //Set initial text
        this.aceEditor.setValue(DEFAULT_EDITOR_CODE);


        //Handling some ace events
        this.aceEditor.selection.on("changeCursor", () => {
            const { row, column } = this.aceEditor.session.selection.getCursor();
        
            if (this.cursorPosition) {
                this.cursorPosition.innerText= `Ln ${row + 1}, Col ${column + 1}`;
            };
        });

        //Handling buttons actions
        this.btnUpload.addEventListener("click", () => {
            const fileInput = document.createElement("input");
            fileInput.type = 'file';
            fileInput.accept = '.rs';
            fileInput.style.display = 'none';
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if ( !file ) return;
                const type = file.name.split(".")[1];
                if ( !type || (type !== "rs" && type !== "txt" && type !== "ri")) return;
                const editor = this.aceEditor;
                const reader = new FileReader();
                reader.onload = function(e) {
                    const contents = e.target.result;
                    editor.setValue(contents);
                    document.body.removeChild(fileInput);
                };
                reader.readAsText(file);
            }
            document.body.appendChild(fileInput);
            fileInput.click();
        });

        this.btnDownload.addEventListener("click", () => {
            const downloadFileToUser = (filename, content) => {
                let element = document.createElement('a');
                element.style.display = 'none';
              
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
              
                element.setAttribute('download',filename);
                document.body.appendChild(element);
              
                element.click();
              
                document.body.removeChild(element);
            };
            const textToDownload = this.aceEditor?.getValue()
            const i = textToDownload?.indexOf('programa');
          
            if (!textToDownload || i === -1) return
          
            let j = textToDownload.indexOf('\n',i);
            if ( j == -1 ) j = textToDownload.length;
            const fileName = textToDownload.substring(i,j).replace('programa','').trimStart();
            downloadFileToUser( `${fileName}.rs`, textToDownload )
        });

        this.btnCopy.addEventListener("click", () => {
            if ( this.aceEditor && navigator.clipboard ) {
                const textToCopy = this.aceEditor.getValue();
                navigator.clipboard.writeText( textToCopy );
            }
        });

        this.btnClear.addEventListener("click", () => {
            if ( this.aceEditor ) {
                this.aceEditor.setValue("");
            };
        });

        this.btnCompile.addEventListener("click", () => {
            const actualCode = this.aceEditor.getValue();
            const parsedCode = toAst(actualCode);

            const consoleName = this.customConsole.querySelector(".console-name");
            const consoleLogs = this.customConsole.querySelector(".console-logs");

            if (parsedCode.error) {
                console.log(parsedCode.errors[0]);
                consoleLogs.innerText = parsedCode.errors[0].toString();
                consoleName.setAttribute("data-estate", "error");
                return;
            }

            const ast = parsedCode.ast;
            const validation = validateAst(ast.value);

            if (validation.error) {
                consoleLogs.innerText = validation.context;
                consoleName.setAttribute("data-estate", "error");
                return;
            }

            this.programAst = ast;
            consoleLogs.innerText = "Compilado con exito, listo para ejecucion";
            consoleName.setAttribute("data-estate", "valid");
            console.log(this.programAst);
        });
    }

}

export default EditorManager;