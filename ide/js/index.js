"use strict";

import IdeStorage from "./general/IdeStorage.js";
import PageManager from "./../../general/PageManager.js";
import EditorManager from "./editor/EditorManager.js";
import InterpreterManager from "./interpreter/InterpreterManager.js"

const myStorage = new IdeStorage();

const myPage = new PageManager({
    storage : myStorage
});

const myEditor = new EditorManager({
    container : document.querySelector(".content.left"),
    storage : myStorage
});

const myInterpreter = new InterpreterManager({
    container : document.querySelector(".content.right"),
    storage : myStorage
});