"use strict";

import StorageAdministrator from "../../../general/StorageAdministrator.js";
import PageManager from "../../../general/PageManager.js";
import mdToHTML from "./mdToHTML.js";
import SintaxDiagram from "./SintaxDiagram.js";

const myStorage = new StorageAdministrator();

const myPage = new PageManager({
    storage : myStorage
});

const myMdRenderer = document.querySelector(".markdown-body");

fetch('LANGUAGE_DOCUMENTATION.md')
    .then(response => response.text())
    .then(data => {
        myMdRenderer.innerHTML = mdToHTML(data);
    }
);

const mySintaxDiagram = new SintaxDiagram("innerFrame");
