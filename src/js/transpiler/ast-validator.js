"use strict";
const { toAst, testProgram } = require("./ast-generator.js");


const astResult = toAst(testProgram);

//Util function
const pointInArea = ( point, a, b ) => {
    const xInRange = (point.x >= a.x) && (point.x <= b.x);
    const yInRange = (point.y >= a.y) && (point.y <= b.y);

    return (xInRange && yInRange);
}
const robotTypeExist = ( type, validTypes ) => {
    let match = false;
    for (const possibleType of validTypes) {
        if (possibleType === type) {
            match = true;
            break;
        };
    }
    return match;
}
const getIdentifiers = ( baseArray ) => {
    let identifiers = [];

    if ( baseArray && (baseArray.length > 0)) {
        baseArray.forEach( e => {
            if (e.identifier) {
                identifiers.push(e.identifier);
            }
        })
    }
    return identifiers;
}
const identifierExist = ( identifier, validIdentifiers ) => {
    let match = false;
    for (const possibleId of validIdentifiers) {
        if (possibleId === identifier) {
            match = true;
            break;
        };
    }
    return match;
}
const identifiersAreUnique = ( baseArray, context ) => {
    const result = {
        error : false,
        errorType : "",
        errorContext : "",
    };
    if (baseArray.length === 0) return result;

    for(let i = 0; i < baseArray.length; i++) {
        const idBase = baseArray[i].identifier;

        for(let j = 0; j < i; j++) {
            const idComp = baseArray[j].identifier;

            if (idBase === idComp) {
                result.error = true;
                result.errorContext = `Name '${idComp}' is in ${context} declaration ${j + 1} and ${i + 1}`;
                break;
            }     
        }
        if (result.error) break;
    }

    return result;
}


const validateAreas = (areas) => {
    const pointsInOrder = ( p1, p2 ) => {
        const xInOrder = (p1.x <= p2.x);
        const yInOrder = (p1.y <= p2.y);

        return (xInOrder && yInOrder);
    }

    const areasOverlap = ( a1, b1, a2, b2 ) => {
        if (b1.x < a2.x) return false;

        if (a1.y > b2.y) return false;

        if (a1.x > b2.x) return false;

        if (b1.y < a2.y) return false;

        return true;
    }

    const result = {
        error : false,
        errorType : "",
        errorContext : "",
    };

    for(let i = 0; i < areas.length; i++) {
        const nameBase = areas[i].identifier;
        const aBase = areas[i].a;
        const bBase = areas[i].b;

        const aValid = pointInArea(aBase, {x: 1, y: 1}, {x: 100, y: 100});
        const bValid = pointInArea(bBase, {x: 1, y: 1}, {x: 100, y: 100});

        if (!(aValid && bValid)) {
            result.error = true;
            result.errorType = "Invalid area declaration";
            if (!aValid && bValid) {
                result.errorContext = `Coordinates of first point in area '${nameBase}' must be in range 1 - 100 on either axis`;
            }
            else if (aValid && !bValid) {
                result.errorContext = `Coordinates of second point in area '${nameBase}' must be in range 1 - 100 on either axis`;
            }
            else {
                result.errorContext = `Coordinates of first point in area '${nameBase}' must be in range 1 - 100 on either axis
                Coordinates of second point in area '${nameBase}' must be in range 1 - 100 on either axis`;
            }
            break;
        }

        if (!pointsInOrder(aBase, bBase)) {
            result.error = true;
            result.errorType = "Invalid area declaration";
            result.errorContext = `Coordinates of second point in area '${nameBase}' must be greater or equal to coordinates of the first point`;
            break; 
        }

        for(let j = 0; j < i; j++) {
            const nameComp = areas[j].identifier;
            const aComp = areas[j].a;
            const bComp = areas[j].b;

            if (nameBase === nameComp) {
                result.error = true;
                result.errorType = "Invalid area declaration";
                result.errorContext = `Area name '${nameComp}' is in area declaration ${j + 1} and ${i + 1}`
                break;
            }

            if (areasOverlap(aComp, bComp, aBase, bBase)) {
                result.error = true;
                result.errorType = "Invalid area declaration";
                result.errorContext = `Area '${nameComp}' share points with area '${nameBase}'`;
                break;
            }            
        }

        if (result.error) break;
    }

    return result;
}

const validateInstances = (instances, robot_types) => {
    const result = {
        error : false,
        errorType : "",
        errorContext : "",
    };
    
    const validRobotTypes = [];
    robot_types.forEach(dec => validRobotTypes.push(dec.identifier));

    for(let i = 0; i < instances.length; i++) {
        const nameBase = instances[i].identifier;
        const typeBase = instances[i].type;
        
        if (!robotTypeExist(typeBase, validRobotTypes)) {
            result.error = true;
            result.errorType = "Invalid instance declaration";
            result.errorContext = `Robot type '${typeBase}' has never been declared and used in instance declaration ${i + 1}`;
            break;
        }

        for(let j = 0; j < i; j++) {
            const nameComp = instances[j].identifier;

            if (nameBase === nameComp) {
                result.error = true;
                result.errorType = "Invalid instance declaration";
                result.errorContext = `Instance name '${nameComp}' is in instance declaration ${j + 1} and ${i + 1}`;
                break;
            }     
        }

        if (result.error) break;
    }

    return result;
}

const validateInits = (inits, instances, areas) => {
    const result = {
        error : false,
        errorType : "",
        errorContext : "",
    };

    const validAreas = [];
    areas.forEach(area => {
        let max = 0;

        if (area.type === "SHARED") {
            max = instances.length;
        }
        else if (area.type === "SEMI_PRIVATE") {
            if (instances.length === 1) {
                max = 1
            } else {
                max = (instances.length - 1)
            }
        }
        else if (area.type === "PRIVATE") {
            max = 1;
        }

        const validArea = {
            type : area.identifier,
            a : area.a,
            b : area.b,
            max : max,
            uses : 0,
        }

        validAreas.push(validArea);
    });

    const validInstances = [];
    instances.forEach(instance => {
        const validInstance = {
            identifier : instance.identifier,
            areas : [],
            initial_position : {}
        }

        validInstances.push(validInstance);
    })

    const assigns = inits.assign_areas;
    
    for(let i = 0; i < assigns.length; i++) {
        const identifier = assigns[i].identifier;
        const type = assigns[i].type;
        const areaIndex = validAreas.findIndex( e => e.type === type);

        if (areaIndex === -1) {
            result.error = true;
            result.errorType = "Invalid area asignation";
            result.errorContext = `Area type '${type}' has never been declared and used in area asignation ${i + 1}`;
            break;
        }

        if (validAreas[areaIndex].max === validAreas[areaIndex].uses) {
            result.error = true;
            result.errorType = "Invalid area asignation";
            result.errorContext = `Exceded the limit of instances for area type '${type}' in area asignation ${i + 1}`;
            break;
        }

        const instanceIndex = validInstances.findIndex( e => e.identifier === identifier);

        if (instanceIndex === -1) {
            result.error = true;
            result.errorType = "Invalid area asignation";
            result.errorContext = `Instance '${identifier}' has never been declared and used in area asignation ${i + 1}`;
            break;
        }

        if (validInstances[instanceIndex].areas.indexOf(type) !== -1) {
            result.error = true;
            result.errorType = "Invalid area asignation";
            result.errorContext = `Already asigned area '${type}' at instance '${identifier}'`;
            break;
        }

        validAreas[areaIndex].uses += 1;
        validInstances[instanceIndex].areas.push(type);
    }
    if (result.error) return result;

    for (const area of validAreas) {
        if (area.uses === 0) {
            result.error = true;
            result.errorType = "Area never asigned";
            result.errorContext = `Area '${area.type}' hasn't been asigned to any instance`;
            break;
        }
    }
    if (result.error) return result;

    for (const instance of validInstances) {
        if (instance.areas.length === 0) {
            result.error = true;
            result.errorType = "Area never asigned";
            result.errorContext = `No asigned any area to instance '${instance.identifier}'`;
            break;
        }
    }
    if (result.error) return result;
    
    const initials = inits.initial_positions;

    for(let i = 0; i < initials.length; i++) {
        const identifier = initials[i].identifier;
        const origin = {
            x : initials[i].x,
            y : initials[i].y
        }

        const instanceIndex = validInstances.findIndex( e => e.identifier === identifier);

        if (instanceIndex === -1) {
            result.error = true;
            result.errorType = "Invalid area asignation";
            result.errorContext = `Instance '${identifier}' has never been declared and used in initialization ${i + 1}`;
            break;
        }

        if (validInstances[instanceIndex].initial_position.x) {
            result.error = true;
            result.errorType = "Initial position";
            result.errorContext = `Already asigned a initial position for '${identifier}' at initialization ${i + 1}`;
            break;
        }

        let isValidOrigin = false;

        for (const areaType of validInstances[instanceIndex].areas) {
            const areaIndex = validAreas.findIndex( e => e.type === areaType);
            const area = validAreas[areaIndex];
            if (pointInArea(origin, area.a, area.b)) {
                isValidOrigin = true;
                break;
            }
        }
        if (!isValidOrigin) {
            result.error = true;
            result.errorType = "Invalid origin";
            result.errorContext = `Initial coordinates for '${identifier}' doesn't belongs to their areas at initialization ${i + 1}`;
            break;
        }

        validInstances[instanceIndex].initial_position = origin;

    }
    if (result.error) return result;

    for (const instance of validInstances) {
        if (!instance.initial_position.x) {
            result.error = true;
            result.errorType = "Initial position";
            result.errorContext = `No asigned a initial position for '${instance.identifier}'`;
            break;
        }
    }

    return result;
}

const validateProcedures = (procedures, instancesIds) => {
    const result = {
        error : false,
        errorType : "",
        errorContext : "",
    };
    if (procedures.length === 0) return result;


    for(let i = 0; i < procedures.length; i++) {
        const procedureId = procedures[i].identifier;

        const resultPar = identifiersAreUnique(procedures[i].parameters, "parameter");
        if (resultPar.error) {
            result.error = true;
            result.errorType = "Invalid parameter declaration";
            result.errorContext = `${resultPar.errorContext} at procedure declaration '${procedureId}'`;
            break;
        }

        const resultVar = identifiersAreUnique(procedures[i].local_variables, "variable");
        if (resultVar.error) {
            result.error = true;
            result.errorType = "Invalid variable declaration";
            result.errorContext = `${resultVar.errorContext} at procedure declaration '${procedureId}'`;
            break;
        }

        const allVarIds = getIdentifiers(procedures[i].local_variables).concat(getIdentifiers(procedures[i].parameters));
        
        console.log(procedures[i].body);
        const body = procedures[i].body;
        for (let j= 0; j < body.length; j++){
            const s = body[j];
        }

        if (result.error) break;
    }

    return result;
}


const test = astResult.ast.value;
console.log(test.PROCEDURES);
console.log(validateProcedures(test.PROCEDURES, test.INSTANCES));



function validateAst(inputAst) {
    const { PROCEDURES, AREAS, ROBOT_TYPES, INSTANCES, INITS } = inputAst;

    let result = {
        error : false,
        errorType : "",
        errorContext : "",
    };

    result = validateAreas(AREAS);

    if (result.error) return result;


    result = validateInstances(INSTANCES, ROBOT_TYPES);

    if (result.error) return result;

    result = validateInits(INITS, INSTANCES, AREAS);

    if (result.error) return result;

    const instancesIds = getIdentifiers(INSTANCES);
    result = validateProcedures(PROCEDURES, instancesIds);
    
    if (result.error) return result;

    const proceduresIds = getIdentifiers(PROCEDURES);
    result = validateRobotTypes(ROBOT_TYPES, proceduresIds, instancesIds);

    return result;
};

//console.log(validateAst(test));
// console.log(validateAst(astResult.ast))
//console.log(ast.value);
/*
const areas = [
    {
        type: 'AreaP',
        identifier: 'ciudad',
        a: { x: 50, y: 50 },
        b: { x: 21, y: 20 }
    },
    {
        type: 'AreaP',
        identifier: 'campo',
        a: { x: 22, y: 9 },
        b: { x: 30, y: 20 }
    }
]
const instances = [
    {
        type: 'tipo1',
        identifier: 'r1',
    },
    {
        type: 'corredor',
        identifier: 'R1',
    },
    {
        type: 'tipo1',
        identifier: 'r6',
    }
]
const inits = {
    assign_areas : [
        {
            type: "ciudad",
            identifier: "r1"
        },
        {
            type: "ciudad",
            identifier: "r2"
        },
        {
            type: "campo",
            identifier: "r2"
        }
    ],
    initial_positions : [
        {
            identifier: "r1",
            x: 1,
            y: 1
        },
        {
            identifier: "r2",
            x: 10,
            y: 10
        }
    ]
}
*/
