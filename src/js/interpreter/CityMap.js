class CityMap {
    constructor(config) {
        this.cityObjects = config.cityObjects;
        this.cityObjects.camera = new Robot({
            src: "./src/images/camera/Camera-Animation-Visible.png",
            isUserControlled: true,
            //moveSpeed: 1,
            x: utils.withGrid(50),
            y: utils.withGrid(50),
        });
        this.walls = config.walls || {};

        this.image = new Image();
        this.image.src = config.src;
    }

    draw(ctx, cameraObject) {
        ctx.drawImage(
            this.image,
            utils.withGrid(22.5) - cameraObject.x,
            -1588 + (utils.withGrid(22.5) + cameraObject.y),
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.values(this.cityObjects).forEach(o => {
            o.mount(this);
        })
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
        src: "./src/images/citys/City-Style.png",
        cityObjects: {
            r1: new Robot({
                //isUserControlled : true,
                x: utils.withGrid(1),
                y: utils.withGrid(1),
            }),
            r2: new Robot({
                src: "./src/images/robots/Robot-Animation-Red.png",
                x: utils.withGrid(5),
                y: utils.withGrid(5),
            }),/*
            r2: new Robot({
                x: utils.withGrid(5),
                y: utils.withGrid(10),
                src: "./src/images/robots/Robot-Animation-Red.png"
            })*/
        },
        walls: {
            [utils.asGridCoord(-1,  0)] : true,
            [utils.asGridCoord(-1, -1)] : true,
            [utils.asGridCoord( 0, -1)] : true,
        }
    }
}