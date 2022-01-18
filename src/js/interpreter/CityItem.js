class CityItem extends CityObject {
    constructor(config) {
        super(config);
        this.type = config.type;
        this.sprite = new Sprite({
            cityObject: this,
            src: this.type === "flower" ? "./src/image/city_objects/Flower-Icon.png" : "./src/image/city_objects/Paper-Icon.png",
        });
        this.cuantity = config.cuantity || 0;
    }
}