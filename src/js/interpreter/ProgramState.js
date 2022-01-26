class ProgramState {
    constructor() {
        this.robots = {
            "r1" : {
                name: "Test robot 1",
                src: "./src/assets/city/object/robot/Robot-Animation-Red.png",
                icon: "./src/assets/city/object/robot/Robot-Animation-Red.png",
                inventory: {
                    flowers: 0,
                    papers: 0,
                },
                x: 0,
                y: 0,
            },
            "r2" : {
                name: "Test robot 2",
                src: "./src/assets/city/object/robot/Robot-Animation-Blue.png",
                icon: "./src/assets/city/object/robot/Robot-Animation-Blue.png",
                inventory: {
                    flowers: 0,
                    papers: 0,
                },
                x: 0,
                y: 0,
            },
            "r3" : {
                name: "Test robot 3",
                src: "./src/assets/city/object/robot/Robot-Animation-Green.png",
                icon: "./src/assets/city/object/robot/Robot-Animation-Green.png",
                inventory: {
                    flowers: 0,
                    papers: 0,
                },
                x: 0,
                y: 0,
            },
        };
        this.instances = ["r1", "r2", "r3"];
    }
}

window.programState = new ProgramState();