"use strict";

import StorageAdministrator from "./utils/StorageAdministrator.js";
import EditorManager from "./editor/EditorManager.js";
import InterpreterManager from "./interpreter/InterpreterManager.js"

const primaryNav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".primary-nav-toggle");

navToggle.addEventListener("click", () => {
    const visivility = primaryNav.getAttribute("data-visible");
    if (visivility === "false") {
        primaryNav.setAttribute("data-visible", true);
        navToggle.setAttribute("aria-expanded", true);
    }
    else {
        primaryNav.setAttribute("data-visible", false);
        navToggle.setAttribute("aria-expanded", false);
    }
});

const myStorage = new StorageAdministrator();

const myEditor = new EditorManager({
    container : document.querySelector(".editor"),
    storage : myStorage
});

const myInterpreter = new InterpreterManager({
    container : document.querySelector(".interpreter"),
    storage : myStorage
});