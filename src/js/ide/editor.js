"use strict";

const DEFAULT_EDITOR_CODE_TEXT = `programa P1_2
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
fin
`;


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
            highlightGutterLine : true,
            showPrintMargin: false,
            displayIndentGuides : true,
            fontFamily : "monospace",
            fontSize : "1rem",
            scrollPastEnd : 1,
            theme : "ace/theme/darkplus",
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