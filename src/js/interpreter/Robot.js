class Robot extends CityObject {
    constructor(config) {
        super(config);
        this.movingProgresRemaining = 0;

        this.directionUpdate = {
            "up" : ["y", 1],
            "down" : ["y", -1],
            "left" : ["x", -1],
            "right" : ["x", 1]
        }
    }

    update(state) {
        this.updatePosition();
        this.updateSprite(state);

        /*
        if (this.movingProgresRemaining === 0 && state.arrow) {
            this.direction = state.arrow;
            this.movingProgresRemaining = 16;
        }*/
    }

    updatePosition() {
        if (this.movingProgresRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgresRemaining -= 1;
        }
    }

    updateSprite(state) {
        if (this.movingProgresRemaining === 0 && !state.arrow) {
            this.sprite.setAnimation(`idle-${this.direction}`);
            return;
        }
    }

}