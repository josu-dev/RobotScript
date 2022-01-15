class City {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".city-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startCityLoop() {
        const step = () => {

            //Clear off the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //Establish camera
            const cameraObject = this.map.cityObjects.camera;

            //Update all objects
            Object.values(this.map.cityObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                });
            })

            
            //Drawing
            //  Map
            this.map.draw(this.ctx, cameraObject);
            //  Map things

            //  Robots
            Object.values(this.map.cityObjects).forEach(object => {
                object.sprite.draw(this.ctx, cameraObject);
            });


            requestAnimationFrame(() => {
                step();
            })
        }
        if (!this.loopState) {
            return
        }
        step();
    }
    init() {
        this.map = new CityMap( window.CityMaps.default );
        this.map.mountObjects();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.loopState = true;
        this.startCityLoop();
    }
    pause() {
        this.loopState = false;
    }
    continue() {
        this.loopState = true;
        this.startCityLoop();
    }
}