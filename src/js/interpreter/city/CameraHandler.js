class CameraHandler {
    constructor(city) {
        this.city = city;
        this.element = city.element;
        this.canvas = city.canvas;
        this.storage = city.storage;
        this.width = this.storage.camera.width;
        this.height = this.storage.camera.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.zoom = 1;
        this.change = 0.2;
        this.element.addEventListener("wheel", e => this.update(e), { passive: true });
        this.element.addEventListener("mousedown", e => this.startDrag(e), true);
        this.diferential = {
            x : 0,
            y : 0,
        }
        

        this.onMouseUp = (event) => {
            this.isMouseDown = false;
            this.element.removeEventListener("mousemove", this.onMouseMove);
            this.element.removeEventListener("mouseup", this.onMouseUp);
        }
    
        this.onMouseMove = ({ movementX, movementY }) => {
            if (this.isMouseDown) { 
                this.city.map.robots.camera.x -= (movementX/this.zoom)*1.2;
                this.city.map.robots.camera.y += (movementY/this.zoom)*1.2;
            }
        }
    }

    update(event) {
        if (this.zoom > 0.5 && event.deltaY < 0 || this.zoom < 4 && event.deltaY > 0 ) {
            event.deltaY > 0 ? this.zoom += this.change : this.zoom -= this.change;
            const newWidth = this.width / this.zoom;
            const newHeight = this.height / this.zoom;
            this.diferential.x = -(newWidth - this.width)/2;
            this.diferential.y = -(newHeight - this.height)/2;
            this.storage.camera.scale = this.zoom;

            this.canvas.width = newWidth;
            this.canvas.height = newHeight;

            this.element.style.width = `${newWidth}px`;
            this.element.style.height = `${newHeight}px`;
            this.element.style.transform = `translate(${this.diferential.x}px,${this.diferential.y}px) scale(${this.zoom})`;


            this.storage.camera.origin.x = -this.diferential.x;
            this.storage.camera.origin.y = -this.diferential.y;
        }
    }

    startDrag(event) {
        this.isMouseDown = true;
        this.element.addEventListener("mousemove", this.onMouseMove);
        this.element.addEventListener("mouseup", this.onMouseUp);
    }
}
