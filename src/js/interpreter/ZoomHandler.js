
class CameraHandler {
    constructor(element, city) {
        this.element = element;
        this.zoom = 1;
        this.change = 0.2;
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.element.addEventListener("wheel", e => this.update(e));
        this.element.addEventListener("mousedown", e => this.startDrag(e), true);
        this.canvas = this.element.querySelector(".city-canvas");
        this.diferential = 0;
        this.city = city;
        
        this.canvasOrigin = {
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
                
                this.city.map.cityObjects.camera.x -= (movementX/this.zoom)*1.2;
                this.city.map.cityObjects.camera.y  += (movementY/this.zoom)*1.2;
                //window.toolsStatus.cityZoom.originX += movementX/ this.zoom;
                //window.toolsStatus.cityZoom.originY += movementY/ this.zoom;
            }
        }
    }

    update(event) {
        const {layerX, layerY} = event;

        console.log(layerX, layerY)
        console.log(window.toolsStatus.cityZoom.originX,window.toolsStatus.cityZoom.originY)

        if (this.zoom > 0.5 && event.deltaY < 0 || this.zoom < 4 && event.deltaY > 0 ) {
            event.deltaY > 0 ? this.zoom += this.change : this.zoom -= this.change;
            const newSize = this.width / this.zoom;
            this.diferential = -(newSize - this.width)/2
            window.toolsStatus.cityZoom.scale = this.zoom;

            this.element.style.width = `${newSize}px`;
            this.element.style.height = `${newSize}px`;
            this.element.style.transform = `translate(${this.diferential}px,${this.diferential}px) scale(${this.zoom})`;


            window.toolsStatus.cityZoom.originX = -this.diferential;
            window.toolsStatus.cityZoom.originY = -this.diferential;
        }
    }

    startDrag(event) {
        this.isMouseDown = true;
        this.element.addEventListener("mousemove", this.onMouseMove);
        this.element.addEventListener("mouseup", this.onMouseUp);
    }
}

