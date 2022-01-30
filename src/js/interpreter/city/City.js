
class City {
    constructor(config) {
        this.element = config.element;
        this.storage = config.storage;
        this.canvas = this.element.querySelector(".city-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = new CityMap({city : this});
        this.zoom = new CameraHandler(this.element, this);
        this.isPaused = false;
    }

    setUpProgram(ast) {
        const extractConfig = (ast, index) => {
            const instance = ast.INSTANCES[index];
            const id = instance.identifier;
            const type = {};
            for (const robotType of ast.ROBOT_TYPES) {
                if (robotType.identifier === instance.type) {
                    type.body = robotType.body;
                    type.variables = [];
                    robotType.local_variables.forEach(variable => {
                        const init = variable.type_value === "numero"? 0 : false;
                        type.variables.push({
                            identifier : variable.identifier,
                            value : init
                        })
                    })
                    break;
                }
            }
            const areasIds = [];
            ast.INITS.assign_areas.forEach( assign => {
                if (assign.identifier === id) {
                    areasIds.push(assign.type);
                }
            })
            let x = 0;
            let y = 0;
            for (const initial of ast.INITS.initial_positions) {
                if (initial.identifier === id) {
                    x = initial.x;
                    y = initial.y;
                    break;
                }
            }
            const areas = [];
            ast.AREAS.forEach(area => {
                const idIndex = areasIds.indexOf(area.identifier);
                if (idIndex !== -1) {
                    areas.push({
                        a : area.a,
                        b : area.b
                    })
                }
            })
        
            while (index > 7) {
                index -= 8;
            }

            return {
                identifier : id,
                areas : areas,
                x : x,
                y : y,
                variables : type.variables,
                statements : type.body,
                inventory : {
                    flower : 0,
                    paper : 0
                },
                src : `./src/assets/city/object/robot/robot-32x8-${index}.png`
            }
        }

        const quantity = ast.INSTANCES.length;
        const robotsConfig = [];
        for (let i=0; i< quantity; i++) {
            const config = extractConfig(ast, i);
            robotsConfig.push(config);
        }

        this.map.setAreas(ast.AREAS);
        this.map.setRobots(robotsConfig);
        this.map.setItems({
            flowers : [
                {
                x : 1,
                y : 1,
                cuantity : 9,
                },
                {
                x : 3,
                y : 1,
                cuantity : 3,
                },
                {
                x : 10,
                y : 10,
                cuantity : 1,
                },
                {
                x : 1,
                y : 4,
                cuantity : 18,
                },
            ],
            papers : [
                {
                x : 1,
                y : 1,
                cuantity : 3,
                },
                {
                x : 4,
                y : 4,
                cuantity : 3,
                },
                {
                x : 3,
                y : 15,
                cuantity : 5,
                },
                {
                x : 10,
                y : 30,
                cuantity : 10,
                },
            ]
        });
        this.map.mountObjects();
    }

    setUpMap(config) {
        this.map.setItems(config);
    }


    startProgram() {
        let nTimes = 10;
        const step = () => {

            //Clear off the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //Establish camera
            const cameraObject = this.map.robots.camera;

            //Update all objects
            Object.values(this.map.robots).forEach(robot => {
                robot.update({
                    map: this.map,
                });
            })

            //Drawing
            //  Map
            this.map.draw(this.ctx, cameraObject, {width: this.canvas.width, height : this.canvas.height});
            //  Map things
            Object.values(this.map.items).forEach(type => {
                Object.values(type).forEach(item => {
                    item.sprite.draw(this.ctx, cameraObject);
                });
            });
            //  Robots
            Object.values(this.map.robots).forEach(robot => {
                robot.sprite.draw(this.ctx, cameraObject);
            });

            // if (nTimes > 0) {
            //     nTimes--;
            //     requestAnimationFrame(() => {
            //         step();
            //     });
            // };
            if (!this.map.isPaused) {
                requestAnimationFrame(() => {
                    step();
                });
            };
        }
        step();
    }

    
    resetCity() {

    }
    
    pause() {
        this.isPaused = true;
    }

    reset() {
        this.isPaused = false;

    }

    init(config) {
        const program = this.storage.getProgram();

        if (program.new) {
            this.startProgram();
        }
        else if (this.isPaused) {
            this.startProgram();
        }

    }
}

export { City };