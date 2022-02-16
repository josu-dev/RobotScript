"use strict";

class PageManager {
    constructor(config) {
        this.storage = config.storage;

        // Elements
        this.mainBar = {
            mode : {
                btnLeft : document.querySelector(".mode-btn.left"),
                btnRight : document.querySelector(".mode-btn.right")
            },
            primaryNav : document.querySelector(".primary-navigation"),
            navToggle : document.querySelector(".primary-nav-toggle")
        };
        this.mainContent = {
            left : document.querySelector(".content.left"),
            right : document.querySelector(".content.right")
        };
    
        // Events
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

        this.mainBar.mode.btnLeft.addEventListener("click", () => {
            const selected = this.mainBar.mode.btnLeft.getAttribute("data-selected");
            if (selected === "true") return;

            this.toContentLeft();
        });
        this.mainBar.mode.btnRight.addEventListener("click", () => {
            const selected = this.mainBar.mode.btnRight.getAttribute("data-selected");
            if (selected === "true") return;

            this.toContentRight();
        });

        const contentMode = this.storage.getLocalValue("content-mode", "left");
        if (contentMode !== "left") this.toContentRight();
    }

    toContentLeft() {
        this.mainBar.mode.btnLeft.setAttribute("data-selected", true);
        this.mainBar.mode.btnRight.setAttribute("data-selected", false);
        this.mainContent.left.setAttribute("data-visible", true);
        this.mainContent.right.setAttribute("data-visible", false);

        this.storage.setLocalValue("content-mode", "left");
    }

    toContentRight() {
        this.mainBar.mode.btnLeft.setAttribute("data-selected", false);
        this.mainBar.mode.btnRight.setAttribute("data-selected", true);
        this.mainContent.left.setAttribute("data-visible", false);
        this.mainContent.right.setAttribute("data-visible", true);

        this.storage.setLocalValue("content-mode", "right");
    }
}

export default PageManager;
