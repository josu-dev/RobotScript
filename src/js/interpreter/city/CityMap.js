class CityMap {
    constructor(config) {
        this.city = config.city;

        this.storage = this.city.storage;
        this.robots = config.robots || {};
        this.robots.camera = new Robot({
            city : this.city,
            map : this,
            src: "./src/assets/city/object/camera/camera-32x8-invisible.png",
            isMountable: false,
            x: 1,
            y: 1,
            identifier: "Free Cam",
        });

        this.walls = config.walls || {};

        this.imageBg = new Image();
        this.imageBg.src = "./src/assets/city/map/background-grass-1920x1920.png";

        this.image = new Image();
        this.image.src = config.src || "./src/assets/city/map/city-default.png";

        this.imageAreas = new Image();

        this.areas = config.areas || [];

        this.blockedCorners = {};


        this.items = {
            flower : {},
            paper : {}
        };

        this.action = {
            take : (type, x, y) => {
                const isItem = this.items[type][`${x},${y}`];
                if (!isItem) return false;

                this.items[type][`${x},${y}`].cuantity -= 1;

                if (this.items[type][`${x},${y}`].cuantity === 0) {
                    delete this.items[type][`${x},${y}`];
                }

                return true;
            },
            add : (type, x, y) => {
                const isItem = this.items[type][`${x},${y}`];
                if (!isItem) {
                    this.items[type][`${x},${y}`] = new CityItem({
                        type : type,
                        x : (x/16),
                        y : (y/16),
                        cuantity : 1,
                        city : this.city
                    });
                    return;
                }

                this.items[type][`${x},${y}`].cuantity += 1;
            },
            block : (x, y) => {
                const xFixed = utils.withGrid(x);
                const yFixed = utils.withGrid(y);

                const coord = `${xFixed},${yFixed}`;
                if ( this.blockedCorners[coord] ) return false;

                this.blockedCorners[coord] = true;
                return true;
            },
            unblock : (x, y) => {
                const xFixed = utils.withGrid(x);
                const yFixed = utils.withGrid(y);

                const coord = `${xFixed},${yFixed}`;
                if ( !this.blockedCorners[coord] ) return false;

                delete this.blockedCorners[coord];
                return true;
            }
        }
        this.state = {
            item : (type, x, y) => {
                const isItem = this.items[type][`${x},${y}`];
                if (!isItem) return false;
                return true;
            },
        }

        this.logs = [];

        this.addLog = (type, message, id) => {
            const log = {
                type : type,
                text : `${message}`,
                id : id
            }
            this.logs.push(log);
        }
    }

    draw(ctx, cameraObject) {
        ctx.drawImage(
            this.image,
            this.storage.camera.origin.x + (this.storage.camera.width / 2) - cameraObject.x,
            this.storage.camera.origin.y - 1588  + (this.storage.camera.height / 2) + cameraObject.y,
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.robots).forEach(key => {
            let object = this.robots[key];
            if (!object.isMountable) return;
            
            object.mount(this);
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

    setAreas(config) {
        //crear la imagen de las areas para printear en el mapa
        this.areas = config.areas;
    }
    setRobots(config) {
        config.forEach(c => {
            this.robots[c.identifier] = new Robot({
                ...c,
                city : this.city,
                map : this,
            });
        });
    }
    setItems(config) {
        const { flowers, papers } = config;

        flowers.forEach( f => {
            const x = utils.withGrid(f.x);
            const y = utils.withGrid(f.x);
            this.items.flower[`${x},${y}`] = new CityItem({
                type : "flower",
                x : f.x,
                y : f.y,
                cuantity : f.cuantity,
                city : this.city
            });
        });
        papers.forEach( p => {
            const x = utils.withGrid(p.x);
            const y = utils.withGrid(p.x);
            this.items.paper[`${x},${y}`] = new CityItem({
                type : "paper",
                x : p.x,
                y : p.y,
                cuantity : p.cuantity,
                city : this.city
            });
        });
    }
}