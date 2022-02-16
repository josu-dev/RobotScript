"use strict";

import { Robot, CityItem } from './CityObject.js'

class MapImageHandler {
    constructor({ width = 0, height = 0}) {
        this.canvas = document.createElement("canvas");
        this.size = {
            w : width || 1624,
            h : height || 1624
        };
        this.canvas.width = this.size.w;
        this.canvas.height = this.size.h;

        this.ctx = this.canvas.getContext("2d");
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.imgBackground = new Image();
        this.imgBackground.src = "./ide/assets/city/map/city-bordered-1624x1624.png";
        this.imgBackground.onload = () => {
            this.drawBackground();
        }

        this.imgAreas = null;
    }


    drawBackground() {
        this.ctx.drawImage(this.imgBackground, 0, 0);
    }

    drawAreas(areas) {
        const SCALE = 16;
        const BORDER = 16;
        const COLOR = {
            SHARED : "#005AFF",
            SEMI_PRIVATE : "#2757AA",
            PRIVATE : "#555555"
        };
    
        const drawAreaApples = (area) => {
            this.ctx.fillStyle = COLOR[area.type];
        
            const nX = area.b.x - area.a.x;
            const nY = area.b.y - area.a.y;
        
            const aFixed = {
                x : area.a.x*SCALE + 8,
                y : this.size.h - area.a.y*SCALE - 16,
            };
        
            for (let y=0; y< nY; y++) {
                for (let x=0; x< nX; x++) {
                    this.ctx.fillRect(
                        aFixed.x + x*SCALE, aFixed.y - (y*SCALE),
                        8, 8
                    )
                }
            }
        };
        const drawAreaBorder = (area) => {
            const aScaled = {
                x : (area.a.x -1) * SCALE -4,
                y : (area.a.y -1) * SCALE,
            };
            const bScaled = {
                x : (area.b.x) * SCALE -4,
                y : (area.b.y - 1) * SCALE +16,
            };
        
            this.ctx.strokeStyle = COLOR[area.type];
            this.ctx.lineWidth = 1;
        
            this.ctx.beginPath();
            this.ctx.moveTo(aScaled.x + BORDER, this.size.h - (aScaled.y + BORDER*0.75));
            this.ctx.lineTo(aScaled.x + BORDER, this.size.h - (bScaled.y + BORDER*0.75));

            this.ctx.moveTo(aScaled.x + BORDER, this.size.h - (bScaled.y + BORDER*0.75));
            this.ctx.lineTo(bScaled.x + BORDER, this.size.h - (bScaled.y + BORDER*0.75));

            this.ctx.moveTo(bScaled.x + BORDER, this.size.h - (bScaled.y + BORDER*0.75));
            this.ctx.lineTo(bScaled.x + BORDER, this.size.h - (aScaled.y + BORDER*0.75));

            this.ctx.moveTo(bScaled.x + BORDER, this.size.h - (aScaled.y + BORDER*0.75));
            this.ctx.lineTo(aScaled.x + BORDER, this.size.h - (aScaled.y + BORDER*0.75));
            this.ctx.stroke();
            this.ctx.closePath();
        };
    
        for (let i=0; i< areas.length; i++) {
            drawAreaBorder(areas[i]);
            drawAreaApples(areas[i]);
        };
    }

    addTrace({color, a, b}) {
        this.ctx.fillStyle = color || this.defaultColor;

        const aFixed = {
            x : a.x + 3,
            y : a.y + 3
        }

        if (b) {
            const bFixed = {
                x : b.x + 3,
                y : b.y + 3
            };

            let origin = {
                x : 0,
                y : 0
            };
            let size = {
                w : 2,
                h : 2
            };

            if (aFixed.x < bFixed.x) {
                size.w = bFixed.x - aFixed.x +2;
                origin.x = aFixed.x;
            }
            else if (aFixed.x > bFixed.x) {
                size.w = -(aFixed.x - bFixed.x + 2);
                origin.x = aFixed.x + 2;
            }
            else {
                origin.x = aFixed.x;
            }
            
            if (aFixed.y < bFixed.y) {
                size.h = -(bFixed.y - aFixed.y + 2);
                origin.y = aFixed.y - 2;
            }
            else if (aFixed.y > bFixed.y) {
                size.h = aFixed.y - bFixed.y + 2;
                origin.y = aFixed.y;
            }
            else {
                origin.y = aFixed.y;
            }

            this.ctx.fillRect(
                origin.x, this.size.h - origin.y - 2,
                size.w, size.h
            );
        }
        else {
            this.ctx.fillRect(
                aFixed.x, this.size.h - aFixed.y - 2,
                2, 2
            )
        }
    }

    reset(areas) {
        this.ctx.clearRect(0,0, this.size.w, this.size.h);
        this.drawBackground();
        if (!areas) {
            this.imgAreas = null;
            return;
        }
        this.drawAreas(areas);
    }
}

class CityMap {
    constructor(config) {
        this.city = config.city;

        this.storage = this.city.storage;

        this.image = new MapImageHandler({ width : 1624, height: 1624});

        this.robots = config.robots || {};
        this.robots.camera = new Robot({
            city : this.city,
            map : this,
            src: "./ide/assets/city/object/camera/camera-32x8-invisible.png",
            isMountable: false,
            x: 0,
            y: 0,
            identifier: "Free Cam",
        });
        this.activeInstances = 0;

        this.walls = config.walls || {};
        
        this.blockedCorners = {};

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
        this.addLog = (type, message, id) => {
            const log =  {
                state : type,
                emitter : id,
                message : message
            };
            this.logs.push(log);
        }

        this.executionError = false;
    }


    draw(ctx) {
        ctx.drawImage(
            this.image.canvas,
            0,
            0,
        );
    }

    reset() {
        this.image.reset();
        this.items = {
            flower : {},
            paper : {}
        };
        this.walls = {};
        this.blockedCorners = {};
        this.executionError = false;
        Object.keys(this.robots).forEach(key => {
            if (key !== "camera") {
                delete this.robots[key];
            }
        });
    }

    isSpaceTaken(newX, newY) {
        return this.walls[`${newX},${newY}`] === true || false;
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
        this.image.drawAreas(config);
    }
    setRobots(config, ctx) {
        config.forEach(c => {
            this.robots[c.identifier] = new Robot({
                ...c,
                city : this.city,
                map : this,
                ctx : ctx
            });

            this.image.addTrace({
                color : c.color,
                a : {
                    x : utils.withGrid(c.x),
                    y : utils.withGrid(c.y)
                }
            });
        });
        this.activeInstances = config.length;
    }
    setItems(config, ctx) {
        const { flowers, papers } = config;

        flowers.forEach( f => {
            const x = utils.withGrid(f.x);
            const y = utils.withGrid(f.y);
            this.items.flower[`${x},${y}`] = new CityItem({
                type : "flower",
                x : f.x,
                y : f.y,
                quantity : f.quantity,
                city : this.city,
                ctx : ctx
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
                city : this.city,
                ctx : ctx
            });
        });
    }
    updateTrace(config) {
        this.image.addTrace(config);
    }

    setNewError({message = "", emitter = ""}) {
        this.executionError = true;
        this.addLog("error", message, emitter );
    }
}

export default CityMap;
