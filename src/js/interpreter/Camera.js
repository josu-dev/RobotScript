class Camera extends CityObject {
    constructor() {
        super({
            src: "./src/image/Camera-Visible.png",
            x: 0,
            y: 8
        });
        this.movSpeed = 4;
        this.movingProgresRemaining = 0;

        this.directionUpdate = {
            "up" : ["y", this.movSpeed],
            "down" : ["y", -this.movSpeed],
            "left" : ["x", -this.movSpeed],
            "right" : ["x", this.movSpeed]
        }
    }

    update(state) {
        this.updatePosition();

        if (this.movingProgresRemaining === 0 && state.arrow) {
            this.direction = state.arrow;
            this.movingProgresRemaining = 2;
        }
    }

    updatePosition() {
        if (this.movingProgresRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgresRemaining -= 1;
        }
    }

}