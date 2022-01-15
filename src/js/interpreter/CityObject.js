class CityObject {
    constructor(config) {
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "up";
        this.sprite = new Sprite({
            cityObject: this,
            src: config.src || "./src/images/robots/Robot-Animation.png",
        });
    }

    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);
    }

    update() {

    }
}
