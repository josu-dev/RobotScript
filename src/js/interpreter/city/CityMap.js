"use strict";

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
            x: 0,
            y: 0,
            identifier: "Free Cam",
        });
        this.activeInstances = 0;

        this.walls = config.walls || {};

        this.image = new Image();
        this.image.src = config.src || "./src/assets/city/map/city-bordered-1624x1624.png";
        this.image.onload = () => {
            this.draw(this.city.ctx);
        }
        
        this.imgAreas = null;

        this.items = {
            flower : {},
            paper : {}
        };

        this.action = {
            take : (type, x, y) => {
                const isItem = this.items[type][`${x},${y}`];
                if (!isItem) return false;

                this.items[type][`${x},${y}`].quantity -= 1;

                if (this.items[type][`${x},${y}`].quantity === 0) {
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
                        quantity : 1,
                        city : this.city
                    });
                    return;
                }

                this.items[type][`${x},${y}`].quantity += 1;
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

        this.executionError = false;

        this.addLog = (type, message, id) => {
            const log =  {
                state : type,
                emitter : id,
                message : message
            };
            this.logs.push(log);
        }
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            0,
            0,
        );
        if (this.imgAreas) {
            ctx.drawImage(
                this.imgAreas,
                0,
                0,
            );
        }
    }

    isSpaceTaken(newX, newY) {
        return this.walls[`${newX},${newY}`] || false;
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
    moveWall(oldX, oldY, newX, newY) {
        this.removeWall(oldX, oldY);
        this.addWall(newX, newY);
    }

    setAreas(config) {
        const generateAreasImage = (areas) => {
            const SCALE = 16;
            const LENGTH = 1616;
            const BORDER = 16;
            const COLOR = {
                SHARED : "#005AFF",
                SEMI_PRIVATE : "#2757AA",
                PRIVATE : "#555555"
            };
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
        
            canvas.width = LENGTH;
            canvas.height = LENGTH;
        
            const drawAreaApples = (area) => {
                ctx.fillStyle = COLOR[area.type];
            
                const nX = area.b.x - area.a.x;
                const nY = area.b.y - area.a.y;
            
                const aFixed = {
                    x : area.a.x*SCALE + 8,
                    y : LENGTH - area.a.y*SCALE - 8,
                };
            
                for (let y=0; y< nY; y++) {
                    for (let x=0; x< nX; x++) {
                        ctx.fillRect(
                            aFixed.x + x*SCALE, aFixed.y - (y*SCALE),
                            8, 8
                        )
                    }
                }
            };
            const drawAreaBorder = (area) => {
                const aScaled = {
                    x : (area.a.x -1) * SCALE -4,
                    y : (area.a.y -1) * SCALE -8,
                };
                const bScaled = {
                    x : (area.b.x) * SCALE -4,
                    y : (area.b.y - 1) * SCALE +8,
                };
            
                ctx.strokeStyle = COLOR[area.type];
                ctx.lineWidth = 1;
            
                ctx.beginPath();
                ctx.moveTo(aScaled.x + BORDER, LENGTH - (aScaled.y + BORDER*0.75));
                ctx.lineTo(aScaled.x + BORDER, LENGTH - (bScaled.y + BORDER*0.75));

                ctx.moveTo(aScaled.x + BORDER, LENGTH - (bScaled.y + BORDER*0.75));
                ctx.lineTo(bScaled.x + BORDER, LENGTH - (bScaled.y + BORDER*0.75));

                ctx.moveTo(bScaled.x + BORDER, LENGTH - (bScaled.y + BORDER*0.75));
                ctx.lineTo(bScaled.x + BORDER, LENGTH - (aScaled.y + BORDER*0.75));

                ctx.moveTo(bScaled.x + BORDER, LENGTH - (aScaled.y + BORDER*0.75));
                ctx.lineTo(aScaled.x + BORDER, LENGTH - (aScaled.y + BORDER*0.75));
                ctx.stroke();
                ctx.closePath();
            };
        
            for (let i=0; i< areas.length; i++) {
                drawAreaBorder(areas[i]);
                drawAreaApples(areas[i]);
            };
        
            const areaURL = canvas.toDataURL();
            canvas.remove();
        
            return areaURL;
        }

        this.imgAreas = new Image();
        this.imgAreas.src = generateAreasImage(config);
        this.imgAreas.onload = () => {
            this.draw(this.city.ctx);
        }
    }
    setRobots(config) {
        config.forEach(c => {
            this.robots[c.identifier] = new Robot({
                ...c,
                city : this.city,
                map : this,
            });
        });
        this.activeInstances = config.length;
    }
    setItems(config) {
        const { flowers, papers } = config;

        flowers.forEach( f => {
            console.log(f);
            const x = utils.withGrid(f.x);
            const y = utils.withGrid(f.y);
            this.items.flower[`${x},${y}`] = new CityItem({
                type : "flower",
                x : f.x,
                y : f.y,
                quantity : f.quantity,
                city : this.city
            });
        });
        papers.forEach( p => {
            const x = utils.withGrid(p.x);
            const y = utils.withGrid(p.y);
            this.items.paper[`${x},${y}`] = new CityItem({
                type : "paper",
                x : p.x,
                y : p.y,
                quantity : p.quantity,
                city : this.city
            });
        });
    }

    setNewError({message = "", emitter = ""}) {
        this.executionError = true;
        this.addLog("error", message, emitter );
    }
}