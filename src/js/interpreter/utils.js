const gScale = 16;

const utils = {
    withGrid(n) {
        return n * gScale;
    },
    asGridCoord(x,y) {
        return `${x * gScale},${y * gScale}`
    },
    nextPosition(initialX, initialY, direction) {
        let x = initialX;
        let y = initialY;
        const size = gScale;
        switch (direction) {
            case "up": y += size; break;
            case "down": y -= size; break;
            case "left": x -= size; break;
            case "right": x += size; break;
            default : console.log("Error: no valid direction at nextPosition call");
        };
        return {x, y};
    }
}