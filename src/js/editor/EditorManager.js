"use strict";

import Manager from "../utils/Manager.js";
import { toAst } from "./ast-generator.js";
import { validateAst } from "./ast-validator.js";

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

class EditorManager extends Manager {
    constructor(config) {
        super({
            ...config,
            type : "editor"
        });

        this.toolBar = {
            upload : this.container.querySelector(".btnUpload"),
            download : this.container.querySelector(".btnDownload"),
            copy : this.container.querySelector(".btnCopy"),
            clear : this.container.querySelector(".btnClear"),
            fontSize : this.container.querySelector(".btnFontSize"),
            compile : this.container.querySelector(".btnCompile"),
        }

        this.aceEditor = ace.edit(this.window);

        this.cursorPosition = this.stateBar.container.querySelector(".cursor-position");
        
        this.programCode = this.storage.getValue("programCode", "");

        this.initAce = () => {
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
            if (this.programCode === "") {
                this.aceEditor.setValue(DEFAULT_EDITOR_CODE);
                this.programCode = DEFAULT_EDITOR_CODE;
            }
            else {
                this.aceEditor.setValue(this.programCode);
            }
    
    
            //Handling some ace events
            this.aceEditor.selection.on("changeCursor", () => {
                const { row, column } = this.aceEditor.session.selection.getCursor();
            
                if (this.cursorPosition) {
                    this.cursorPosition.innerText= `Ln ${row + 1}, Col ${column + 1}`;
                };
            });
    
            
            this.aceEditor.on("change", () => {
                this.programCode = this.aceEditor.getValue();
                this.storage.setValue("programCode", this.programCode);
            });
        }

        this.initToolBar = () => {
            this.toolBar.upload.addEventListener("click", () => {
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

            this.toolBar.download.addEventListener("click", () => {
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

            this.toolBar.copy.addEventListener("click", () => {
                if ( this.aceEditor && navigator.clipboard ) {
                    const textToCopy = this.aceEditor.getValue();
                    navigator.clipboard.writeText( textToCopy );
                    this.consoleLog("default", "Codigo copiado al portapapeles");
                }
            });

            this.toolBar.clear.addEventListener("click", () => {
                if ( this.aceEditor ) {
                    this.aceEditor.setValue("");
                    this.consoleLog("default", "Codigo borrado");
                };
            });

            this.toolBar.compile.addEventListener("click", () => {
                const parsedCode = toAst(this.programCode);

                if (parsedCode.error) {
                    const errorLog = parsedCode.errors[0].toString();
                    this.consoleLog("error", errorLog);
                    return;
                }

                const ast = parsedCode.ast;
                const validation = validateAst(ast.value);

                if (validation.error) {
                    const errorLog = validation.context;
                    this.consoleLog("error", errorLog);
                    return;
                }

                this.storage.loadProgramAst(ast);
                this.consoleLog("valid", "Compilado con exito, listo para ejecucion");
            });
        }

        this.initAce();
        this.initToolBar();
    }
}

export default EditorManager;