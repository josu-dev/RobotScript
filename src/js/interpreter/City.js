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


            //Updates
            const entry = {arrow: this.directionInput.direction};
            //  Camera
            this.map.camera.update(entry);
            //  All objects
            Object.values(this.map.cityObjects).forEach(object => {
                object.update(entry);
            })

            
            //Drawing
            //  Map
            this.map.draw(this.ctx, this.map.camera);
            //  Map things
            //  Robots
            Object.values(this.map.cityObjects).forEach(object => {
                object.sprite.draw(this.ctx, this.map.camera);
            });
            //  Camera
            this.map.camera.sprite.draw(this.ctx, this.map.camera);


            requestAnimationFrame(() => {
                step();
            })
        }

        step();
    }
    init() {
        this.map = new CityMap( window.CityMaps.default );

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startCityLoop();
    }
}