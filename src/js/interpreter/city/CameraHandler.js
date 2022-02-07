"use strict";

class CameraHandler {
    constructor(city) {
        this.city = city;
        this.container = city.element;
        this.canvas = city.canvas;
        this.storage = city.storage;
        this.size = {
            width : this.storage.camera.width,
            height : this.storage.camera.height
        }
        this.scale = 1;
        this.change = 0.2;
        this.scaleDif = {
            x : 0,
            y : 0,
        }
        this.offset = {
            x : this.size.width / 2 - 16,
            y :  this.size.height / 2 - 1624 + 24
        }
        this.canvas.width = 1624;
        this.canvas.height = 1624;
        
        this.container.addEventListener("wheel", e => this.update(e), { passive: true });
        this.container.addEventListener("mousedown", e => this.startDrag(e), true);

        this.onMouseUp = () => {
            this.isMouseDown = false;
            this.container.removeEventListener("mousemove", this.onMouseMove);
            this.container.removeEventListener("mouseup", this.onMouseUp);
            this.container.removeEventListener("mouseleave", this.onMouseUp);
        }
    
        this.onMouseMove = ({ movementX, movementY }) => {
            if (this.isMouseDown) { 
                this.offset.x += (movementX/this.scale);
                this.offset.y += (movementY/this.scale);
                
                this.canvas.style.transform = `translate(${ - this.scaleDif.x + this.offset.x }px,${ - this.scaleDif.y + this.offset.y }px)`;
            }
        }

        //touch events
        this.touchPos = {
            x : 0,
            y : 0
        };

        this.container.addEventListener("touchstart", e => this.startTouch(e), { passive: true });
        this.container.addEventListener("touchend", e => this.onTouchEnd(e));
        this.container.addEventListener("touchcancel", e => this.onTouchCancel(e));
        this.container.addEventListener("touchmove", e => this.onTouchMove(e), { passive: false });

        this.onTouchEnd = (e) => {
            this.isTouchDown = false;
        }
        this.onTouchCancel = (e) => {
            this.isTouchDown = false;
        }

        this.onTouchMove = (e) => {
            if (this.isTouchDown) {
                e.preventDefault();

                const t = e.changedTouches[0];
                const x = t.pageX;
                const y = t.pageY;

                const moveX = this.touchPos.x - x;
                const moveY = this.touchPos.y - y;
                this.offset.x -= (moveX/this.scale);
                this.offset.y -= (moveY/this.scale);
                
                this.canvas.style.transform = `translate(${ - this.scaleDif.x + this.offset.x }px,${ - this.scaleDif.y + this.offset.y }px)`;

                this.touchPos.x = x;
                this.touchPos.y = y;
            }
        }

        this.updateCanvasTranslate();
    }

    update(event) {
        if (this.scale < 0.5 && event.deltaY < 0) return;
        if (this.scale > 4 && event.deltaY > 0) return;

        if (event.deltaY > 0)
            this.scale += this.change;
        else
            this.scale -= this.change;
        
        const newWidth = this.size.width / this.scale;
        const newHeight = this.size.height / this.scale;

        this.scaleDif.x = -(newWidth - this.size.width)/2;
        this.scaleDif.y = -(newHeight - this.size.height)/2;

        this.storage.camera.scale = this.scale;

        this.container.style.width = `${newWidth}px`;
        this.container.style.height = `${newHeight}px`;
        this.container.style.transform = `translate(${ this.scaleDif.x}px,${this.scaleDif.y}px) scale(${this.scale})`;

        this.updateCanvasTranslate();
    }

    startDrag() {
        this.isMouseDown = true;
        this.container.addEventListener("mousemove", this.onMouseMove);
        this.container.addEventListener("mouseup", this.onMouseUp);
        this.container.addEventListener("mouseleave", this.onMouseUp);
    }

    updateCanvasTranslate() {
        this.canvas.style.transform = `translate(${ - this.scaleDif.x + this.offset.x }px,${ - this.scaleDif.y + this.offset.y }px)`;
    }

    startTouch(e) {
        this.isTouchDown = true;
        const t = e.changedTouches[0];

        this.touchPos.x = t.pageX;
        this.touchPos.y = t.pageY;
    }
}
