"use strict";

import Manager from "../general/Manager.js";
import City from "./city/City.js";

class InterpreterManager extends Manager {
    constructor(config) {
        super({
            ...config,
            defaultName : "Interpreter"
        });

        this.toolBar = {
            run : this.container.querySelector(".btnRun"),
            pause : this.container.querySelector(".btnPause"),
            reset : this.container.querySelector(".btnReset"),
            city : {
                container : this.container.querySelector(".container-menu.city"),
                btnCity : this.container.querySelector(".btnCity"),
                menu : this.container.querySelector(".menu-int.items"),
            },
            view : this.container.querySelector(".btnView"),
        }

        this.itemMenu = {
            quantity : this.toolBar.city.menu.querySelector(".itemQuantity"),
            x : this.toolBar.city.menu.querySelector(".itemX"),
            y : this.toolBar.city.menu.querySelector(".itemY"),
            btn : {
                flowers : this.toolBar.city.menu.querySelector(".btnFlowers"),
                papers : this.toolBar.city.menu.querySelector(".btnPapers"),
                clear : this.toolBar.city.menu.querySelector(".btnClear")
            }
        }

        this.city = new City({
            element : this.window.querySelector(".city-container"),
            storage : this.storage,
            console : this.console
        })

        this.program = {};

        this.initToolBar = () => {
            this.toolBar.run.addEventListener("click", () => {
                this.program = this.storage.getProgram();
    
                if (this.program) {
                    this.city.init();
                }
                else {
                    this.console.set([{ state : "error", message : "No se compilo ningun programa para ejecutar" }]);
                }
            });

            this.toolBar.pause.addEventListener("click", () => {
                this.city.pause();
                this.console.add([{ message : "Ejecucion pausada" }]);
            });

            this.toolBar.reset.addEventListener("click", () => {
                this.city.resetCity();
                this.console.set([{ message : "Ciudad reseteada, es necesario ejecutar para manipular la vista"}]);
            });

            this.toolBar.city.btnCity.addEventListener("click", () => {
                const visivility =  this.toolBar.city.menu.getAttribute("data-visible");
                if (visivility === "false") {
                    this.toolBar.city.menu.setAttribute("data-visible", true);
                }
                else {
                    this.toolBar.city.menu.setAttribute("data-visible", false);
                }
            });
            this.itemMenu.btn.flowers.addEventListener("click", () => {
                const rData = this.proccessItemMenu();
                if (rData.quantity === 0) {
                    this.console.add([{
                        state : "error",
                        message : "Debe indicar una cantidad mayor a 0 para agregar flores"
                    }]);
                    return;
                };
                const itemArray = this.generateItems(rData);
                this.storage.addItems({
                    type : "flowers",
                    items : itemArray
                });
            });
            this.itemMenu.btn.papers.addEventListener("click", () => {
                const rData = this.proccessItemMenu();
                if (rData.quantity === 0) {
                    this.console.add([{
                        state : "error",
                        message : "Debe indicar una cantidad mayor a 0 para agregar papeles"
                    }]);
                    return;
                };
                if (rData.x.max === 0 || rData.y.max === 0) return;

                const itemArray = this.generateItems(rData);
                console.log(itemArray)
                this.storage.addItems({
                    type : "papers",
                    items : itemArray
                });
            });
            this.itemMenu.btn.clear.addEventListener("click", () => {
                const rData = this.proccessItemMenu();
                if (rData.x.max === 0 || rData.y.max === 0) return;

                this.storage.clearItems(rData);
            });

            this.toolBar.view.addEventListener("click", () => {
                this.console.add([{
                    state : "info",
                    emitter : "Sin implementar",
                    message : "No esta añadida la funcionalidad de cambiar camaras"
                }])
            });
        }

        this.initToolBar();
    }

    proccessItemMenu() {
        const toNumber = (str) => {
            const nQuantity = Number(str);
            if (!nQuantity) {
                return {
                    error : true,
                    value : 0
                }
            }
            return {
                error : false,
                value : nQuantity
            }
        };
        const trunk100 = (n) => {
            return (
                n < 0?     0:
                n > 100? 100: n
            )
        }
        const proccessCoord = (str, name) => {
            const r = {
                min : 0,
                max : 0
            };

            if (str === "") {
                this.console.add([{
                    state : "error",
                    message : `Debe completar el campo ${name} agregar/limpiar la ciudad`
                }]);
                return r;
            }
    
            const strParts = str.split(/[^0-9a-zA-ZñÑ]/);
            if (strParts.length === 0 || strParts.length > 2) {
                this.console.add([{
                    state : "error",
                    message : `Debe completar el campo ${name} con un valor o un rango ( minimo - maximo )`
                }]);
                return r;
            }
            const rMin = toNumber(strParts[0]);
            if (rMin.error) {
                this.console.add([{
                    state : "error",
                    message : `Debe completar el campo ${name} con un valor o un rango ( minimo - maximo )`
                }]);
                return r;
            }
            r.min = trunk100(rMin.value);

            if (strParts.length === 2) {
                const rMax = toNumber(strParts[1]);
                if (rMax.error) {
                    this.console.add([{
                        state : "error",
                        message : `Debe completar el campo ${name} con un valor o un rango ( minimo - maximo )`
                    }]);
                    return r;
                }
                r.max = trunk100(rMax.value);
            }

            if (r.max === 0) r.max = r.min;
            if (r.min > r.max) {
                const aux = r.min;
                r.min = r.max;
                r.max = aux;
            }

            return r;
        }

        const r = {
            quantity : 0,
            x : {
                min : 0,
                max : 0
            },
            y : {
                min : 0,
                max : 0
            }
        };
        const strQuantity = this.itemMenu.quantity.value;
        const strX = this.itemMenu.x.value;
        const strY = this.itemMenu.y.value;

        const rQuantity = toNumber(strQuantity);
        if (!rQuantity.error) {
            rQuantity.value < 0? r.quantity = 0:
            rQuantity.value > 1000? r.quantity = 1000:
            r.quantity = rQuantity.value
        }

        r.x = proccessCoord(strX, "x");
        r.y = proccessCoord(strY, "y");

        return r;
    }

    generateItems(config) {
        const randMinMax = (min, max) => {
            return Math.round(Math.random() * (max - min)) + min;
        }

        let remaining = config.quantity;
        let maxQuantity = 0;
        if (config.quantity < 10) maxQuantity = 5;
        else if (config.quantity < 100) maxQuantity = Math.round(config.quantity*0.25);
        else if (config.quantity < 1000) maxQuantity = Math.round(config.quantity*0.1);
        else maxQuantity = Math.round(config.quantity*0.01);

        const rArray = [];
        while (remaining > maxQuantity) {
            const quantity = randMinMax(1, maxQuantity);
            remaining -= quantity;
            const x = randMinMax(config.x.min, config.x.max);
            const y = randMinMax(config.y.min, config.y.max);
            rArray.push({
                quantity : quantity,
                x : x,
                y : y
            });
        };
        if (remaining !== 0) {
            const x = randMinMax(config.x.min, config.x.max);
            const y = randMinMax(config.y.min, config.y.max);
            rArray.push({
                quantity : remaining,
                x : x,
                y : y
            });
        };

        return rArray;
    }
}

export default InterpreterManager;