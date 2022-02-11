"use strict";

import CityMap from './CityMap.js';
import CameraHandler from './CameraHandler.js';

class City {
    constructor(config) {
        this.element = config.element;
        this.storage = config.storage;
        // this.storage.camera.width = this.element.clientWidth;
        // this.storage.camera.height = this.element.clientHeight;
        this.canvas = this.element.querySelector(".city-canvas");
        this.ctx = this.canvas.getContext("2d");
        // improve canvas performance
            this.ctx.mozImageSmoothingEnabled = false;
            this.ctx.webkitImageSmoothingEnabled = false;
            this.ctx.msImageSmoothingEnabled = false;
            this.ctx.imageSmoothingEnabled = false;
        this.map = new CityMap({city : this});
        this.view = new CameraHandler(this);
        this.isPaused = false;
        this.isRunning = false;
        this.program = null;
        this.console = config.console;

        //hacer que se imprima despues de que se cargue la imagen del fondo de la ciudad
        this.map.draw(this.ctx);
    }


    loadProgram() {
        if (this.isRunning && (!this.isPaused)) {
            this.console.add([
                {
                    state : "error",
                    message : "No se puede cargar un programa cuando se esta ejecutando uno, debes esperar que termine, reiniciar o pausar la ejecucion" }
            ]);
            return;
        }

        const newProgram = this.storage.getProgram();
    
        if (!newProgram) {
            this.console.set([
                {
                    state : "error",
                    message : "No hay ningun programa compilado para cargar"
                }
            ]);
            return;
        }

        this.program = this.storage.getProgram();

        this.resetCity();
        this.setUpProgram();

        this.console.set([{
            state : "info",
            message : `Se cargo el programa '${this.program.NAME.identifier}'`
        }])
    }

    init() {
        if (!this.isRunning) {
            if (!this.program) {
                this.console.add([{
                    state : "error",
                    message : "Debe cargar un programa para poder ejecutar"
                }]);
                return;
            }

            if (this.map.activeInstances === 0) {
                this.resetCity();
            }

            this.isRunning = true;

            this.console.add([{
                state : "valid",
                message : "Comenzando ejecucion"
            }]);
            this.startProgram();
        }
        else {
            if (!this.isPaused) {
                this.console.set([{
                    state : "info",
                    message : "El programa ya esta corriendo"
                }]);
            }
            else {
                this.isPaused = false;
                this.console.add([{ 
                    state : "valid",
                    message : "Reanudando la ejecucion"
                }]);
                this.startProgram();
            }
        }
    }
    
    pause() {
        if (!this.isRunning) {
            this.console.set([
                {
                    state : "error",
                    message : "Se debe estar ejecutando un programa para poder pausar"
                }
            ])
            return;
        }

        if (this.isPaused) {
            this.console.add([{ 
                state : "warning", message : "La ejecucion ya esta pausada" }]);
        }
        else {
            this.isPaused = true;
            this.console.add([{ 
                state : "info",
                message : "Ejecucion pausada" }]);
        }
    }

    resetCity() {
        this.isRunning = false;
        this.isPaused = false;
        requestAnimationFrame(() => {});

        this.map.reset();
        if (this.program) {
            this.setUpProgram();
            this.console.set([{ state : "valid", message : "Ciudad reseteada exitosamente"}]);}
        else {
            this.console.set([
                {
                    state : "warning",
                    message : "Se reseteo pero no hay programa el cual cargar, antes de ejecutar debe cargar uno"
                }
            ])
        }
    }

    setUpProgram() {
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
                    const a = {
                        x : area.a.x * 16,
                        y : area.a.y * 16,
                    }
                    const b = {
                        x : area.b.x * 16,
                        y : area.b.y * 16,
                    }
                    areas.push({
                        a : a,
                        b : b
                    })
                }
            });
            const inventory = {
                flower : 0,
                paper : 0
            }
            ast.INITS.assign_items.forEach(assign => {
                if (assign.identifier === id) {
                    for (const type of assign.type) {
                        inventory[type] = assign.value;
                    }
                }
            })
        
            while (index > 7) {
                index -= 8;
            }
            const colorTable = ["#0000ff","#e51c23", "#259b24","#03a9f4", "#ffeb3b", "#ff5722", "#9c27b0", "#eeeeee"];

            const strBody = JSON.stringify(type.body);
            const newBody = JSON.parse(strBody);
            
            const strProcedures = JSON.stringify(ast.PROCEDURES);
            const newProcedures = JSON.parse(strProcedures);
            return {
                identifier : id,
                areas : areas,
                x : x,
                y : y,
                variables : type.variables,
                statements : newBody,
                procedures : newProcedures,
                inventory : inventory,
                src : `./src/assets/city/object/robot/robot-32x8-${index}.png`,
                color : colorTable[index]
            }
        }

        const { INSTANCES, AREAS } = this.program;

        const robotsConfig = [];
        for (let i=0; i< INSTANCES.length; i++) {
            const config = extractConfig(this.program, i);
            robotsConfig.push(config);
        }

        this.map.setAreas(AREAS);
        this.map.draw(this.ctx);
        this.map.setRobots(robotsConfig, this.ctx);
        this.map.setItems(this.storage.items, this.ctx);
        this.map.mountObjects();
    }

    startProgram() {
        const step = () => {
            if (!this.isRunning) return;

            //Clear off the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //Establish camera
            const cameraObject = this.map.robots.camera;

            Object.values(this.map.robots).forEach(robot => robot.update());

            if (this.map.logs.length > 0) {
                this.console.add(this.map.logs);
                this.map.logs = [];
                if (this.map.executionError) {
                    this.isRunning = false;
                    this.console.add([
                        {
                            state : "error",
                            message : "Se aborto la ejecucion del programa debido a un error"
                        }
                    ]);
                    this.map.activeInstances = 0;
                }
            }
            if (this.map.activeInstances === 0 && !this.map.executionError) {
                this.console.add([
                    {
                        state : "valid",
                        message : "Finalizo la ejecucion del programa"
                    }
                ])
                this.isRunning = false;
            }

            //Drawing
            //  Map
            this.map.draw(this.ctx);
            //  Items
            Object.values(this.map.items).forEach(type => {
                Object.values(type).forEach(item => {
                    item.sprite.draw(this.ctx, cameraObject);
                });
            });
            //  Robots
            Object.values(this.map.robots).forEach(robot => {
                robot.sprite.draw(this.ctx, cameraObject);
            });

            if (!this.isPaused) {
                requestAnimationFrame(() => {
                    step();
                });
            }
        }
        step();
    }

    drawAll() {
        this.map.draw(this.ctx);

        Object.values(this.map.items).forEach(type => {
            Object.values(type).forEach(item => {
                item.sprite.draw(this.ctx);
            });
        });

        Object.values(this.map.robots).forEach(robot => {
            robot.sprite.draw(this.ctx);
        });
    }
}

export default City;