class Robot extends CityObject {
    constructor(config) {
        super(config);
        this.isUserControlled = config.isUserControlled || false;
        this.movingProgresRemaining = 0;
        this.moveSpeed = config.moveSpeed || 1;
        this.directionUpdate = {
            "up" : ["y", this.moveSpeed],
            "down" : ["y", -this.moveSpeed],
            "left" : ["x", -this.moveSpeed],
            "right" : ["x", this.moveSpeed]
        }
    }

    update(state) {
        if (this.movingProgresRemaining > 0) {
            this.updatePosition();
        } else {

            //Case: keyboard ready and have an arrow pressed
            if (!state.map.isPauseOn && this.isUserControlled && state.arrow) {
                this.startBehavior(state, {
                    type: "move",
                    direction: state.arrow
                })
            }
            this.updateSprite();
        }
    }

    startBehavior(state, behavior) {
        this.direction= behavior.direction;
        if (behavior.type === "move") {

            //Stop is place is occuped
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                return;
            };

            //Start moving
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgresRemaining = 16;
            this.updateSprite();
        };

        if (behavior.type === "rotate") {
            this.updateSprite();

            setTimeout(() => {
                utils.emitEvent("RobotRotateComplete", {
                    whoId: this.id
                });
            }, behavior.time)
        };
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgresRemaining -= 1;

        if (this.movingProgresRemaining === 0) {
            //Finish moving
            utils.emitEvent("RobotMovingComplete", {
                whoId: this.id
            });
        }
    }

    updateSprite() {
        this.sprite.setAnimation(`idle-${this.direction}`);
    }

}