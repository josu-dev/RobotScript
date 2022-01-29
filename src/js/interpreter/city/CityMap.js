class CityMap {
    constructor(config) {

        this.cityObjects = config.cityObjects;
        this.cityObjects.camera = new Robot({
            src: "./src/assets/city/object/camera/camera-32x8-invisible.png",
            isUserControlled: true,
            //moveSpeed: 1,
            x: utils.withGrid(1),
            y: utils.withGrid(1),
        });
        this.walls = config.walls || {};

        this.image = new Image();
        this.image.src = config.src;

        this.imageBg = new Image();
        this.imageBg.src = "./src/assets/city/map/background-grass-1920x1920.png"

        this.isPaused = false;
    }

    draw(ctx, cameraObject) {
        const pattern = ctx.createPattern(this.imageBg, "repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(0,0,1920,1920)
        ctx.drawImage(
            this.image,
            utils.withGrid(22.5) - cameraObject.x,
            -1588  + (utils.withGrid(22.5) + cameraObject.y),
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.cityObjects).forEach(key => {
            let object = this.cityObjects[key];
            object.id = key
            
            object.mount(this);
        })
    }

    async startPause(events) {
        for (let i=0; i<events.length; i++) {
            const eventHandler = new CityEvent({
                event: events[i],
                map: this,
            });
            await eventHandler.init();
        }
    }

    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x, y) {
        delete this.walls[`${x},${y}`];
    }
    moveWall(oldX, oldY, direction) {
        this.removeWall(oldX, oldY);
        const {x, y} = utils.nextPosition(oldX, oldY, direction);
        this.addWall(x, y);
    }
}


window.CityMaps = {
    default : {
        src: "./src/assets/city/map/city-default.png",
        cityObjects : {},
        // cityObjects: {
        //     default: new Robot({
        //         //isUserControlled : true,
        //         x: utils.withGrid(1),
        //         y: utils.withGrid(1),
        //     }),
        //     r1: new Robot({
        //         x: utils.withGrid(5),
        //         y: utils.withGrid(5),
        //         src: "./src/assets/city/object/robot/Robot-Animation-Red.png",
        //         behaviorLoop: [
        //             { type: "rotate", direction: "right" , time: 800 },
        //             { type: "rotate", direction: "down" , time: 400 },
        //             { type: "rotate", direction: "left" , time: 1200 },
        //             { type: "rotate", direction: "up" , time: 2000 },
        //         ]
        //     }),
        //     r2: new Robot({
        //         x: utils.withGrid(1),
        //         y: utils.withGrid(10),
        //         src: "./src/assets/city/object/robot/Robot-Animation-Blue.png",
        //         behaviorLoop: [
        //             { type: "move", direction: "up" },
        //             { type: "rotate", direction: "left", time: 800 },
        //             { type: "move", direction: "right" },
        //             { type: "move", direction: "down" },
        //             { type: "rotate", direction: "right", time: 800  },
        //             { type: "move", direction: "left" },
        //         ]
        //     }),
        //     flower: new CityItem({
        //         x: utils.withGrid(4),
        //         y: utils.withGrid(10),
        //         type: "flower"
        //     }),
        //     paper: new CityItem({
        //         x: utils.withGrid(20),
        //         y: utils.withGrid(20),
        //         type: "paper"
        //     }),
        //     unknow: new CityItem({
        //         x: utils.withGrid(0),
        //         y: utils.withGrid(20),
        //     })
        // },
    }
}