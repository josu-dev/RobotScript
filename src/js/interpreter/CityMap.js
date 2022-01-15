class CityMap {
    constructor(config) {
        this.cityObjects = config.cityObjects;
        this.camera = new Camera();
        this.image = new Image();
        this.image.src = config.src;
    }

    draw(ctx, cameraObject) {
        ctx.drawImage(
            this.image,
            utils.withGrid(16.5) - cameraObject.x,
            -1588 + (utils.withGrid(16.5) + cameraObject.y)
        );
    }
}


window.CityMaps = {
    default : {
        src: "./src/images/citys/City-Style.png",
        cityObjects: {
            r1: new Robot({
                x: utils.withGrid(1) -16,
                y: utils.withGrid(1) -8,
            }),/*
            r2: new Robot({
                x: utils.withGrid(5),
                y: utils.withGrid(10),
                src: "./src/images/robots/Robot-Animation-Red.png"
            })*/
        }
    }
}