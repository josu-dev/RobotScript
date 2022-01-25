"use Strict";

const DEFAULT_EDITOR_CODE_TEXT =  `programa P1_2
procesos
  proceso juntarPapel (ES papel: numero)
  comenzar
    mientras HayPapelEnLaEsquina
      tomarPapel
      papel:= papel + 1
  fin
  
areas
  ciudad : AreaP(1,1,50,50)
robots 
  robot tipo1
  variables
    papel: numero
  comenzar
    papel:= 0
    si (PosAv=10) & (PosCa=30)
      derecha
    sino
      si (PosAv=30) & (PosCa=30)
        repetir 2
          derecha
      sino
        si (PosAv=30) & (PosCa=10)
          repetir 3
            derecha
    repetir 19
      mover
      juntarPapel(papel)
    Informar(papel)
  fin
variables 
  robot1: tipo1
  robot2: tipo1
  robot3: tipo1
  robot4: tipo1
comenzar 
  AsignarArea(robot1,ciudad)
  AsignarArea(robot2,ciudad)
  AsignarArea(robot3,ciudad)
  AsignarArea(robot4,ciudad)
  Iniciar(robot1, 10, 10)
  Iniciar(robot2, 10, 30)
  Iniciar(robot3, 30, 30)
  Iniciar(robot4, 30, 10)
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
        this.aceEditor.setValue(DEFAULT_EDITOR_CODE_TEXT);


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
    }

}

export default EditorManager;