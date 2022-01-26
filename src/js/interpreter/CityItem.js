class CityItem extends CityObject {
    constructor(config) {
        super(config);
        this.type = config.type;
        this.sprite = new Sprite({
            cityObject: this,
            src: this.type === "flower" ? "./src/assets/city/object/item/flower-8x8.png" : "./src/assets/city/object/item/paper-8x8.png",
        });
        this.cuantity = config.cuantity || 0;
    }
}