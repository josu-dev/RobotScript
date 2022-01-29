import Manager from "../utils/Manager.js";
import { City } from "./city/City.js";
import {createRobots} from "./createInstances.js";

class InterpreterManager extends Manager {
    constructor(config) {
        super({
            ...config,
            type : "interpreter"
        });

        this.toolBar = {
            run : this.container.querySelector(".btnRun"),
            pause : this.container.querySelector(".btnPause"),
            reset : this.container.querySelector(".btnReset"),
            city : this.container.querySelector(".btnCity"),
            view : this.container.querySelector(".btnView"),
        }

        this.city = new City({
            element : this.window.querySelector(".city-container")
        })

        this.programAst = {};

        this.initCity = (config) => {
            this.city.init(config);
        }

        this.initToolBar = () => {
            this.toolBar.run.addEventListener("click", () => {
                this.programAst = this.storage.getProgramAst();
    
                if (this.programAst.type) {
                    this.consoleLog("valid", "Ejecutando programa");
                    const programConfig = createRobots(this.programAst.value);
                    this.initCity(programConfig);
                }
                else {
                    this.consoleLog("error", "No se compilo ningun programa para ejecutar")
                }
            });

            this.toolBar.pause.addEventListener("click", () => {
            });

            this.toolBar.reset.addEventListener("click", () => {
            });

            this.toolBar.city.addEventListener("click", () => {
            });

            this.toolBar.view.addEventListener("click", () => {
            });
        }

        this.initToolBar();
    }


}

export default InterpreterManager;