"use strict";

import StorageAdministrator from "./StorageAdministrator.js";

/**
 * Base class for manegin windows
 * @module Manager
 */
class Manager {
    /**
     * 
     * @param {object} config
     * @param {HTMLElement} config.container
     * @param {string} config.defaultName
     * @param {StorageAdministrator} config.storage
     */
    constructor({container, defaultName, storage}) {
        this.container = container;
        this.defaultName = defaultName;
        this.storage = storage;

        this.toolBar = {}

        this.window = this.container.querySelector(".window")

        this.stateBar = {
            container : this.container.querySelector(".state-bar"),
            logs : this.container.querySelector(".console-logs")
        }
        this.console = {
            set : (config) => {
                const actualTime = new Date().toTimeString().slice(0,5);
                let newLog = "";
                config.forEach(log => newLog = `${actualTime} <span data-state="${log.state || "default"}">${log.emitter || this.defaultName}</span>: ${log.message}\n${newLog}`)
                this.stateBar.logs.innerHTML = `<p>${newLog}</p>`;
            },
            add : (config) => {
                const actualTime = new Date().toTimeString().slice(0,5);
                const oldLog = this.stateBar.logs.innerHTML;
                let newLog = ""
                if (oldLog.length > 3) newLog = oldLog.slice(3, (oldLog.length - 4));
                config.forEach(log => newLog = `${actualTime} <span data-state="${log.state || "default"}">${log.emitter || this.defaultName}</span>: ${log.message}\n${newLog}`)
                this.stateBar.logs.innerHTML = `<p>${newLog}</p>`;
            },
            clear : () => {
                this.stateBar.logs.innerHTML = "";
            }
        }
    }
}

export default Manager;