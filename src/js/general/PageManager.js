"use strict";

class PageManager {
    constructor(config) {
        this.storage = config.storage;

        this.mainBar = {
            mode : {
                btnEditor : document.querySelector(".mode-btn.btnEditor"),
                btnInterpreter : document.querySelector(".mode-btn.btnInterpreter")
            },
            primaryNav : document.querySelector(".primary-navigation"),
            navToggle : document.querySelector(".primary-nav-toggle")
        };

        this.mainContent = {
            editor : document.querySelector(".content.editor"),
            interpreter : document.querySelector(".content.interpreter")
        };
    
        this.mainBar.navToggle.addEventListener("click", () => {
            const visivility = this.mainBar.primaryNav.getAttribute("data-visible");
            if (visivility === "false") {
                this.mainBar.primaryNav.setAttribute("data-visible", true);
                this.mainBar.navToggle.setAttribute("aria-expanded", true);
            }
            else {
                this.mainBar.primaryNav.setAttribute("data-visible", false);
                this.mainBar.navToggle.setAttribute("aria-expanded", false);
            }
        });

        this.mainContent = {
            editor : document.querySelector(".content.editor"),
            interpreter : document.querySelector(".content.interpreter")
        };

        this.mainBar.mode.btnEditor.addEventListener("click", () => {
            const selected = this.mainBar.mode.btnEditor.getAttribute("data-selected");
            if (selected === "true") return;

            this.toEditor();
        });
        this.mainBar.mode.btnInterpreter.addEventListener("click", () => {
            const selected = this.mainBar.mode.btnInterpreter.getAttribute("data-selected");
            if (selected === "true") return;

            this.toInterpreter();
        });

        const isSelection = this.storage.getLocalValue("content-mode", "editor");
        if (isSelection !== "editor") this.toInterpreter();
    }

    toEditor() {
        this.mainBar.mode.btnEditor.setAttribute("data-selected", true);
        this.mainBar.mode.btnInterpreter.setAttribute("data-selected", false);
        this.mainContent.editor.setAttribute("data-visible", true);
        this.mainContent.interpreter.setAttribute("data-visible", false);

        this.storage.setLocalValue("content-mode", "editor");
    }

    toInterpreter() {
        this.mainBar.mode.btnEditor.setAttribute("data-selected", false);
        this.mainBar.mode.btnInterpreter.setAttribute("data-selected", true);
        this.mainContent.editor.setAttribute("data-visible", false);
        this.mainContent.interpreter.setAttribute("data-visible", true);

        this.storage.setLocalValue("content-mode", "interpreter");
    }
}

export default PageManager;
