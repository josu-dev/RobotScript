import Manager from "../utils/Manager.js";
import { City } from "./city/City.js";

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
            city : this.container.querySelector(".btnCity"),
            view : this.container.querySelector(".btnView"),
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

            this.toolBar.city.addEventListener("click", () => {
                this.console.add([{
                    state : "info",
                    emitter : "Sin implementar",
                    message : "No esta añadida la funcionalidad de agregar flores y papeles"
                }])
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
}

export default InterpreterManager;