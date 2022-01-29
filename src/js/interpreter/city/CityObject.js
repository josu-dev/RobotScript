class CityObject {
    constructor(config) {
        this.isMounted = false;
        this.x = utils.withGrid(config.x) || 0;
        this.y = utils.withGrid(config.y) || 0;
        this.direction = config.direction || "up";

        this.sprite = new Sprite({
            cityObject: this,
            src: config.src || "./src/assets/city/sprite-default.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;
    }

    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);

        //If is behavior, do after a short delay
        setTimeout (() => {
            this.doBehaviorEvent(map);
        },10)
    }

    update() {

    }

    async doBehaviorEvent(map) {

        // Dont do anything if context say
        if (map.isPauseOn || this.behaviorLoop.length === 0){
            return;
        }

        //Setting up event
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        //Create instance of event
        const eventHandler = new CityEvent({ map, event: eventConfig });
        await eventHandler.init();

        //Next behavior
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length){
            this.behaviorLoopIndex = 0;
        }

        //RecursiveCall
        this.doBehaviorEvent(map);
    }
}

class CityItem extends CityObject {
    constructor(config) {
        super(config);
        this.type = config.type;
        this.sprite = new Sprite({
            cityObject: this,
            src: this.type === "flower" ? "./src/assets/city/object/item/flower-8x8.png" : "./src/assets/city/object/item/paper-8x8.png",
        });
        this.cuantity = config.cuantity || 0;
    }
}

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
        this.identifier = config.identifier;
        this.areas = config.areas;
        this.variables = config.variables;
        this.statements = config.statements;
        this.inventory = config.inventory;
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
