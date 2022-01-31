import Manager from "../utils/Manager.js";
import { City } from "./city/City.js";

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
            element : this.window.querySelector(".city-container"),
            storage : this.storage
        })

        this.program = {};

        this.initToolBar = () => {
            this.toolBar.run.addEventListener("click", () => {
                this.program = this.storage.getProgram();
    
                if (this.program) {
                    this.consoleLog("valid", "Ejecutando programa");
                    this.city.init();
                }
                else {
                    this.consoleLog("error", "No se compilo ningun programa para ejecutar")
                }
            });

            this.toolBar.pause.addEventListener("click", () => {
                this.city.pause();
                this.consoleLog("default", "Ejecucion pausada");
            });

            this.toolBar.reset.addEventListener("click", () => {
                this.city.resetCity();
                this.consoleLog("default", "Ciudad reseteada, es necesario ejecutar para manipular la vista");
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