class CityEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    move(resolve) {
        const who = this.map.cityObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "move",
            direction: this.event.direction
        });

        //Set up a handler when the correct robot finish and resolve the event
        const completeHandler = e =>{
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("RobotMovingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("RobotMovingComplete", completeHandler)
    }

    rotate(resolve) {
        const who = this.map.cityObjects[ this.event.who ];
        who.startBehavior({
            map: this.map
        }, {
            type: "rotate",
            direction: this.event.direction,
            time: this.event.time
        });

        //Set up a handler when the correct robot finish and resolve the event
        const completeHandler = e =>{
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("RobotRotateComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("RobotRotateComplete", completeHandler)

    }

    textMessage(resolve) {
        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        });
        message.init(document.querySelector(".city-container"));
    }

    pause(resolve) {
        this.map.isPaused = true;
        const menu = new PauseMenu({
            onComplete: () => {
                resolve();
                this.map.isPaused = false;
                this.map.city.startCityLoop();
            }
        });
        menu.init(document.querySelector(".city-container"));
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        });
    }
}