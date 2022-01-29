class City {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".city-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        this.zoom = new CameraHandler(this.element, this);
        
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

            if (!this.map.isPaused) {
                requestAnimationFrame(() => {
                    step();
                });
            };
        }
        step();
    }

    startMap(mapConfig) {
        this.map = new CityMap(mapConfig);
        this.map.city = this;
        this.map.mountObjects();
    }

    init(config) {

        // this.hud = new Hud(this);
        // this.hud.init(document.querySelector(".city-container"));
            console.log(config);
        config.forEach(c => {
            console.log(c);
            window.CityMaps.default.cityObjects[c.identifier] = new Robot(c);
        })
        this.startMap(window.CityMaps.default);

        //Create controls
        // this.bindActionInput();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startCityLoop();
    }

    
    pause() {
        this.map.isPaused = true;
    }
}

export { City };