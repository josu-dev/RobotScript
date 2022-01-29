class Manager {
    constructor(config) {
        this.container = config.container;
        this.type = config.type;
        this.storage = config.storage;

        this.toolBar = {}

        this.window = this.container.querySelector(".window")

        this.stateBar = {
            container : this.container.querySelector(".state-bar"),
            name : this.container.querySelector(".console-name"),
            logs : this.container.querySelector(".console-logs")
        }
    }

    consoleLog(estate = "", message = "") {
        if (estate === "") estate = "default";
        
        this.stateBar.name.setAttribute("data-estate", estate);
        this.stateBar.logs.innerText = message;
    }
}

export default Manager;