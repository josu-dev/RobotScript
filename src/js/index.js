"use strict";


import StorageAdministrator from "./general/StorageAdministrator.js";
import PageManager from "./general/PageManager.js";
import EditorManager from "./editor/EditorManager.js";
import InterpreterManager from "./interpreter/InterpreterManager.js"

const myStorage = new StorageAdministrator();

const myPage = new PageManager({
    storage : myStorage
});

const myEditor = new EditorManager({
    container : document.querySelector(".editor"),
    storage : myStorage
});

const myInterpreter = new InterpreterManager({
    container : document.querySelector(".interpreter"),
    storage : myStorage
});