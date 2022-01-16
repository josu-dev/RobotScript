class Flower extends CityObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            cityObject: this,
            src: "./src/images/city_objects/Paper-Icon.png"
        });
    }
}