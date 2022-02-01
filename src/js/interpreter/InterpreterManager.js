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
            storage : this.storage,
            console : {
                add : (s, m) => this.consoleAdd(s, m),
                set : (s, m) => this.consoleSet(s, m)
            }
        })

        this.program = {};

        this.initToolBar = () => {
            this.toolBar.run.addEventListener("click", () => {
                this.program = this.storage.getProgram();
    
                if (this.program) {
                    this.consoleSet("valid", "Ejecutando programa");
                    this.city.init();
                }
                else {
                    this.consoleSet("error", "No se compilo ningun programa para ejecutar")
                }
            });

            this.toolBar.pause.addEventListener("click", () => {
                this.city.pause();
                this.consoleSet("default", "Ejecucion pausada");
            });

            this.toolBar.reset.addEventListener("click", () => {
                this.city.resetCity();
                this.consoleSet("default", "Ciudad reseteada, es necesario ejecutar para manipular la vista");
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