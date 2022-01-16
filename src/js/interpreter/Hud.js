class Hud {
    constructor() {
        this.statusboards = [];
    }

    update() {
        this.statusboards.forEach(s => {
            //update;
        });
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Hud");

        const { programState } = window;
        programState.instances.forEach(key => {
            const robot = programState.instances[key];
            const statusboard = new Something({

            });
            statusboard.createElement();
            this.statusboards.push(statusboard);
            this.element.appendChild(scoreboard.hudElement);
            
        });
        this.update();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }
}