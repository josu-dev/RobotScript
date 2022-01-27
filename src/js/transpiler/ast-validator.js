"use strict";
//const { toAst, testProgram } = require("./ast-generator.js");
import { toAst, testProgram } from "./ast-generator.js"

const astResult = toAst(testProgram);

// Error class
class ValidationError {
    constructor() {
        this.error = false;
        this.type = "";
        this.context = "";
    }

    setError( type = "", context = "" ) {
        this.error = true;
        this.type = type;
        this.context = context;
    }

    addContext( additionalContext = "" ) {
        this.context = this.context.concat(additionalContext);
    }

    changeContext( newContext = "" ) {
        this.context = newContext;
    }
}


//Common functions
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
const getValidProcedures = ( baseProcedures ) => {
    let procedures = [];

    if ( baseProcedures && (baseProcedures.length > 0)) {
        baseProcedures.forEach( e => {
            const identifier = e.identifier;
            const parameters = e.parameters;
            procedures.push({
                identifier : identifier,
                parameters : parameters
            })
        })
    }

    return procedures;
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

const validateExpression = (exp, varIds) => {
    let r = new ValidationError();
    if (!exp.type) return r;

    const type = exp.type;

    if ( type === "BINARY_OPERATION" ) {
        const resultLeft = validateExpression(exp.lhs, varIds);
        if (resultLeft.error) {
            r = resultLeft;
            return r;
        }

        const resultRight = validateExpression(exp.rhs, varIds);
        if (resultRight.error) {
            r = resultRight;
            return r;
        }

        return r;
    }

    if ( type === "UNARY_OPERATION" ) {
        const resultRight = validateExpression(exp.rhs, varIds);
        if (resultRight.error) {
            r = resultRight;
            return r;
        }

        return r;
    }

    if ( type === "VARIABLE" ) {
        if (!identifierExist(exp.identifier, varIds)) {
            r.setError(
                "Invalid variable",
                `Variable '${exp.identifier}' has never been declared`
            )
            return r;
        }

        return r;
    }

    return r;
}

const validateStatement = (statement, varIds, instancesIds, validProcedures) => {
    const r = new ValidationError();
    if (!statement.type) return r;

    const type = statement.type;

    if ( type === "STATEMENT_ASSIGN" ) {
        const identifier = statement.identifier;
        if (!identifierExist(identifier, varIds)) {
            r.setError(
                "Invalid assignation",
                `Variable ${identifier} has never been declared`
            )
            return r;
        }
        const value = statement.value;
        const resultExp = validateExpression(value, varIds);
        if (resultExp.error) {
            r.setError(
                resultExp.type,
                `${resultExp.context} at statement assignation`,
            )
            return r;
        }
        return r;
    }

    if ( type === "STATEMENT_BLOCK" ) {
        const resultBody = validateBody(statement.body, varIds, instancesIds, validProcedures);
        if (resultBody.error) {
            r.setError(
                resultBody.type,
                `${resultBody.context} at block code`,
            )
            return r;
        }
        return r;
    }

    if ( type === "IF" || type === "FOR" || type === "WHILE" ) {
        const condition = statement.condition;
        const resultCond = validateExpression(condition, varIds);
        if (resultCond.error) {
            r.setError(
                resultCond.type,
                `${resultCond.context} at condition declaration`,
            )
            return r;
        }

        const resultBody = validateStatement(statement.body, varIds, instancesIds, validProcedures)
        if (resultBody.error) {
            r.setError(
                resultBody.type,
                `${resultBody.context} at statement declaration`,
            )
            return r;
        }

        if (type === "IF") {
            const resultElse = validateStatement(statement.body, varIds, instancesIds, validProcedures)
            if (resultElse.error) {
                r.setError(
                    resultElse.type,
                    `${resultElse.context} at else declaration`,
                )
                return r;
            }
        }

        return r;
    }

    if ( type === "INFORM" ) {
        const { arg1, arg2 } = statement;
        let resultExp = new ValidationError();

        if (arg1.type === "STRING_LITERAL" && arg2.type) {
            resultExp = validateExpression(arg2, varIds);
        }
        else if (arg1.type !== "STRING_LITERAL") {
            resultExp = validateExpression(arg1, varIds);
        }
        if (resultExp.error) {
            r.setError(
                `Invalid parameter declaration`,
                `${resultExp.context} at parameter declaration of inform`
            )
            return r;
        }

        return r;
    }

    if ( type === "CHANGE_POSITION" ) {
        const { x, y } = statement;

        let resultExp = validateExpression(x, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalid parameter declaration`,
                `${resultExp.context} at x coordinate declaration of pos`
            )
            return r;
        }

        resultExp = validateExpression(y, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalid parameter declaration`,
                `${resultExp.context} at y coordinate declaration of pos`
            )
            return r;
        }

        return r;
    }

    if ( type === "MESSAGE" ) {
        const { val, who } = statement;

        const resultExp = validateExpression(val, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalid parameter declaration`,
                `${resultExp.context} at value declaration in message statement`
            )
            return r;
        }
        instancesIds.push("*");
        const resultWho = identifierExist(who, instancesIds);
        if (!resultWho) {
            r.setError(
                `Invalid parameter declaration`,
                `Instance '${who}' has never been declared and used in message emitter/reciver`
            )
            return r;
        }

        return r;
    }

    if ( type === "CONTROL_CORNER" ) {
        const { x, y } = statement;

        let resultExp = validateExpression(x, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalid parameter declaration`,
                `${resultExp.context} at x coordinate declaration of control corner`
            )
            return r;
        }

        resultExp = validateExpression(y, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalid parameter declaration`,
                `${resultExp.context} at y coordinate declaration of control corner`
            )
            return r;
        }

        return r;
    }

    if ( type === "CALL_PROCEDURE" ) {
        const { identifier, parameters } = statement;

        const validProceduresIds = getIdentifiers(validProcedures);

        const identifierIndex = validProceduresIds.indexOf(identifier);
        if (identifierIndex === -1) {
            r.setError(
                `Invalid procedure call`,
                `Procedure '${identifier}' has never been declared`
            )
            return r;
        }

        const formalParameters = validProcedures[identifierIndex].parameters;
        const actualParameters = parameters;

        if (formalParameters.length > actualParameters.length) {
            r.setError(
                `Invalid procedure call`,
                `Less parameters in procedure call than in procedure declaration '${identifier}'`
            )
            return r;
        }
        else if (formalParameters.length < actualParameters.length) {
            r.setError(
                `Invalid procedure call`,
                `More parameters in procedure call than in procedure declaration '${identifier}'`
            );
            return r;
        }
        
        if (formalParameters.length === 0) return r;

        for (let i = 0; i < formalParameters.length; i++) {
            if (formalParameters[i].type_parameter = "ES") {
                if (actualParameters[i].type !== "VARIABLE"){
                    r.setError(
                        `Invalid procedure call`,
                        `Parameter ${i + 1} in procedure call '${identifier}' must be a variable because the corresponding formal parameter is ES`
                    )
                    break;
                }
                if (!identifierExist(actualParameters[i].identifier, varIds)) {
                    r.setError(
                        `Invalid procedure call`,
                        `Variable '${actualParameters[i].identifier}' has not been declared and used in procedure call '${identifier}'`
                    )
                    break;
                }
            }
            else {
                const resultExp = validateExpression(actualParameters[i].value, varIds);
                if (resultExp.error) {
                    r.setError(
                        `Invalid parameter declaration`,
                        `${resultExp.context} at parameter declaration ${i + 1} in procedure call '${identifier}'`
                    )
                    break;
                }
            }
        }

        return r;
    }

    return r;
}

const validateBody = (body, varIds, instancesIds, validProcedures) => {
    const r = new ValidationError();

    if (body.length === 0) return r;

    for(let i = 0; i < body.length; i++) {
        const statement = body[i];
        const statementResult = validateStatement(statement, varIds, instancesIds, validProcedures);
        
        if (statementResult.error) {
            r.setError(
                statementResult.type,
                statementResult.context
            )
            break;
        }
    }

    return r;
}

const validateProcedures = (procedures, instancesIds) => {
    const r = new ValidationError();

    if (procedures.length === 0) return r;

    const validProcedures = getValidProcedures(procedures);

    for(let i = 0; i < procedures.length; i++) {
        const procedureId = procedures[i].identifier;

        const resultPar = identifiersAreUnique(procedures[i].parameters, "parameter");
        if (resultPar.error) {
            r.setError(
                `Invalid parameter declaration`,
                `${resultPar.errorContext} at procedure declaration '${procedureId}'`
            )
            break;
        }

        const resultVar = identifiersAreUnique(procedures[i].local_variables, "variable");
        if (resultVar.error) {
            r.setError(
                `Invalid variable declaration`,
                `${resultVar.errorContext} at procedure declaration '${procedureId}'`
            )
            break;
        }

        const allVarIds = getIdentifiers(procedures[i].local_variables).concat(getIdentifiers(procedures[i].parameters));
        
        const body = procedures[i].body;
        const resultBody = validateBody(body, allVarIds, instancesIds, validProcedures);

        if (resultBody.error) {
            r.setError(
                `${resultBody.type}`,
                `${resultBody.context}`
            )
            break;
        }
    }

    return r;
}

const validateRobotTypes = (robot_types, procedures, instancesIds) => {
    const r = new ValidationError();

    let validProcedures = [];
    if (procedures.length > 0) {
        validProcedures = getValidProcedures(procedures);
    }

    const validPobotTypeIds = [];
    for(let i = 0; i < robot_types.length; i++) {
        const robotTypeId = robot_types[i].identifier;

        const indexIdExist = validPobotTypeIds.indexOf(robotTypeId)
        if (indexIdExist !== -1) {
            r.setError(
                `Invalid robot type declaration`,
                `Identifier '${robotTypeId}' is in robot type declaration ${indexIdExist + 1} and ${i + 1}`
            )
            break;
        }

        const resultVar = identifiersAreUnique(robot_types[i].local_variables, "variable");
        if (resultVar.error) {
            r.setError(
                `Invalid variable declaration`,
                `${resultVar.errorContext} at procedure declaration '${robotTypeId}'`
            )
            break;
        }

        const allVarIds = getIdentifiers(robot_types[i].local_variables);
        
        const body = robot_types[i].body;
        const resultBody = validateBody(body, allVarIds, instancesIds, validProcedures);

        if (resultBody.error) {
            r.setError(
                `${resultBody.type}`,
                `${resultBody.context}`
            )
            break;
        }

        validPobotTypeIds.push(robotTypeId);
    }

    return r;
}


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

    result = validateRobotTypes(ROBOT_TYPES, PROCEDURES, instancesIds);

    return result;
};

//module.exports.validateAst = validateAst;
export {validateAst}

if (astResult.error) {
    console.log(astResult.errors[0])
}
else {
    console.log(validateAst(astResult.ast.value))
}

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
