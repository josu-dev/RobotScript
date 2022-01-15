class Sprite {
    constructor(config) {
        //Set up image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //Configure Animation & Initial State
        this.animations = config.animations || {
            "idle-up": [ [0,0] ],
            "idle-down": [ [2,0] ],
            "idle-left": [ [3,0] ],
            "idle-right": [ [1,0] ],
        }
        this.currentAnimation = config.currentAnimation || "idle-up";

        //Reference the game object
        this.cityObject = config.cityObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][0]
    }

    setAnimation(key) {
        if (this.currentAnimation !== key ) {
            this.currentAnimation = key;
        }
    }
    draw(ctx, cameraObject) {
        const x = this.cityObject.x + utils.withGrid(22.5) - cameraObject.x;
        const y = (- this.cityObject.y) + 716 - (utils.withGrid(22.5) - cameraObject.y);

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
            frameX * 8, frameY * 8,
            8, 8,
            x, y,
            8, 8
        );
    }
}