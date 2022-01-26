class CityObject {
    constructor(config) {
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
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
