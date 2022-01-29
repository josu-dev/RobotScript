// class Robot {
//     constructor(config) {
//         this.identifier = config.identifier;
//         this.areas = config.areas;
//         this.x = config.origin.x;
//         this.y = config.origin.y;
//         this.variables = [];
//         this.variables.push(config.variables);
//         this.statements = config.body;
//         this.inventory = config.inventory? {
//             flowers : config.inventory.flowers || 0,
//             papers : config.inventory.papers || 0
//         } : {
//             flowers : 0,
//             papers : 0
//         }
//         this.messages = [];
//     }
// }

const extractConfig = (ast, index) => {
    const instance = ast.INSTANCES[index];
    const id = instance.identifier;
    const type = {};
    for (const robotType of ast.ROBOT_TYPES) {
        if (robotType.identifier === instance.type) {
            type.body = robotType.body;
            type.variables = [];
            robotType.local_variables.forEach(variable => {
                const init = variable.type_value === "numero"? 0 : false;
                type.variables.push({
                    identifier : variable.identifier,
                    value : init
                })
            })
            break;
        }
    }
    const areasIds = [];
    ast.INITS.assign_areas.forEach( assign => {
        if (assign.identifier === id) {
            areasIds.push(assign.type);
        }
    })
    let x = 0;
    let y = 0;
    for (const initial of ast.INITS.initial_positions) {
        if (initial.identifier === id) {
            x = initial.x;
            y = initial.y;
            break;
        }
    }
    const areas = [];
    ast.AREAS.forEach(area => {
        const idIndex = areasIds.indexOf(area.identifier);
        if (idIndex !== -1) {
            areas.push({
                a : area.a,
                b : area.b
            })
        }
    })

    while (index > 7) {
        index -= 8;
    }
    return {
        identifier : id,
        areas : areas,
        x : x,
        y : y,
        variables : type.variables,
        statements : type.body,
        inventory : {
            flowers : 0,
            papers : 0
        },
        src : `./src/assets/city/object/robot/robot-32x8-${index}.png`
    }
}

const createRobots = (ast) => {
    const n = ast.INSTANCES.length;
    const robots = [];
    for (let i=0; i< n; i++) {
        const config = extractConfig(ast, i);
        robots.push(config);
    }
    return robots;
}

export {createRobots};