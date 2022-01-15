class DirectionInput {
    constructor() {
        this.heldDirection = [];

        this.map = {
            "ArrowUp": "up",
            "KeyW": "up",
            "ArrowDown": "down",
            "KeyS": "down",
            "ArrowLeft": "left",
            "KeyA": "left",
            "ArrowRight": "right",
            "KeyD": "right",
        }
    }

    get direction() {
        return this.heldDirection[0];
    }
    
    init() {
        document.addEventListener("keydown", e => {
            const dir = this.map[e.code];
            if (dir && this.heldDirection.indexOf(dir) === -1) {
                this.heldDirection.unshift(dir);
            }
        });
        document.addEventListener("keyup", e => {
            const dir = this.map[e.code];
            const index = this.heldDirection.indexOf(dir);
            if (index > -1) {
                this.heldDirection.splice(index, 1);
            }
        });
    }
}