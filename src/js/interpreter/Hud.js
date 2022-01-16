class Hud {
    constructor(city) {
        this.city = city;
        this.statusboards = [];
    }

    update() {
        this.statusboards.forEach(s => {
            s.update(window.programState.instances[s.id]);
        });
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Hud");

        const { programState } = window;
        console.log(programState);
        programState.instances.forEach(key => {
            const robot = programState.robots[key];
            const statusboard = new RobotStatus({
                id : key,
                ...robot
            }, this.city);
            statusboard.createElement();
            this.statusboards.push(statusboard);
            this.element.appendChild(statusboard.hudElement);
            
        });
        this.update();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        document.addEventListener("ProgramStateUpdated", () => {
            this.update();
        })
    }
}