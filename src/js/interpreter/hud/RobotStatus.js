class RobotStatus {
    constructor(config, city) {
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        })
        this.city = city;
        console.log(this);
    }

    createElement() {
        console.log(this);
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("RobotStatus");
        this.hudElement.setAttribute("data-robotstatus", this.id);
        this.hudElement.innerHTML = (`
        <p class="RobotStatus_name">${this.name}</p>
        <div class="RobotStatus_character_crop">
            <img class="RobotStatus_character" alt="${this.name}" src="${this.src}" />
        </div>
        <p class="RobotStatus_text">Inventario</p>
        <p class="RobotStatus_inventory">F: ${this.inventory.flowers} | P: ${this.inventory.papers}</p>
        <p class="RobotStatus_text">Position</p>
        <p class="RobotStatus_position">Ca: ${this.x} | Av: ${this.y}</p>
        `);

        this.inventoryElement = this.hudElement.querySelector(".RobotStatus_inventory");
        this.positionElement = this.hudElement.querySelector(".RobotStatus_position");
    }

    update(changes={}) {
        Object.keys(changes).forEach(key => {
            this[key] = changes[key];
        });

        this.inventoryElement.innerText = `F: ${this.inventory.flowers} | P: ${this.inventory.papers}`;
        this.positionElement.innerText = `Ca: ${this.x} | Av: ${this.y}`;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement);

        this.update();
    }
}