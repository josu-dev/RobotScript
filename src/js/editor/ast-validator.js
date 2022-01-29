"use strict";

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

    setContext( newContext = "" ) {
        this.context = newContext;
    }

    update( newError = ValidationError ) {
        this.error = newError.error;
        this.type = newError.type;
        this.context = newError.context;
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
    const r = new ValidationError();
    if (baseArray.length === 0) return r;

    for(let i = 0; i < baseArray.length; i++) {
        const idBase = baseArray[i].identifier;

        for(let j = 0; j < i; j++) {
            const idComp = baseArray[j].identifier;

            if (idBase === idComp) {
                r.setError(
                    ``,
                    `Identificador '${idComp}' se encuentra en la declaracion ${j + 1} y ${i + 1}`
                );
                break;
            }     
        }
        if (r.error) break;
    }

    return r;
}

//Validations
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

    const r = new ValidationError();

    for(let i = 0; i < areas.length; i++) {
        const nameBase = areas[i].identifier;
        const aBase = areas[i].a;
        const bBase = areas[i].b;

        const aValid = pointInArea(aBase, {x: 1, y: 1}, {x: 100, y: 100});
        const bValid = pointInArea(bBase, {x: 1, y: 1}, {x: 100, y: 100});

        if (!(aValid && bValid)) {
            r.setError(`Invalida declaracion de area`);
            if (!aValid && bValid) {
                r.setContext(`Coordenadas del primer punto del area '${nameBase}' debe estar en el rango de 1 a 100 en cada eje`);
            }
            else if (aValid && !bValid) {
                r.setContext(`Coordenadas del segundo punto del area '${nameBase}' debe estar en el rango de 1 a 100 en cada eje`);
            }
            else {
                r.setContext(`Coordenadas de ambos puntos del area '${nameBase}' deben estar en el rango de 1 a 100 en cada eje`);
            }
            break;
        }

        if (!pointsInOrder(aBase, bBase)) {
            r.setError(
                `Invalida declaracion de area`,
                `Coordinates of second point in area '${nameBase}' must be greater or equal to coordinates of the first point`
            );
            break; 
        }

        for(let j = 0; j < i; j++) {
            const nameComp = areas[j].identifier;
            const aComp = areas[j].a;
            const bComp = areas[j].b;

            if (nameBase === nameComp) {
                r.setError(
                    `Invalida declaracion de area`,
                    `Identificador '${nameComp}' se utiliza en la declaracion del area ${j + 1} y ${i + 1}`
                );
                break;
            }

            if (areasOverlap(aComp, bComp, aBase, bBase)) {
                r.setError(
                    `Invalida declaracion de area`,
                    `El area '${nameComp}' comparte puntos con el area '${nameBase}'`
                );
                break;
            }            
        }

        if (r.error) break;
    }

    return r;
}

const validateInstances = (instances, robot_types) => {
    const r = new ValidationError();
    
    const validRobotTypes = [];
    robot_types.forEach(dec => validRobotTypes.push(dec.identifier));

    for(let i = 0; i < instances.length; i++) {
        const nameBase = instances[i].identifier;
        const typeBase = instances[i].type;
        
        if (!robotTypeExist(typeBase, validRobotTypes)) {
            r.setError(
                `Invalida declaracion de instancia`,
                `Tipo de robot '${typeBase}' no fue declarado y se uso en la declaracion de instancia ${i + 1}`
            );
            break;
        }

        for(let j = 0; j < i; j++) {
            const nameComp = instances[j].identifier;

            if (nameBase === nameComp) {
                r.setError(
                    `Invalida declaracion de instancia`,
                    `Identificador '${nameComp}' se utiliza en la declaracion de instancia ${j + 1} y ${i + 1}`
                );
                break;
            }     
        }

        if (r.error) break;
    }

    return r;
}

const validateInits = (inits, instances, areas) => {
    const r = new ValidationError();

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
            r.setError(
                `Invalida asignacion de area`,
                `Tipo de area '${type}' no fue declarada y se usa en la asignacion de area ${i + 1}`
            );
            break;
        }

        if (validAreas[areaIndex].max === validAreas[areaIndex].uses) {
            r.setError(
                `Invalida asignacion de area`,
                `Se exedio el limite de asignaciones para el tipo '${type}' en la asignacion de area ${i + 1}`
            );
            break;
        }

        const instanceIndex = validInstances.findIndex( e => e.identifier === identifier);

        if (instanceIndex === -1) {
            r.setError(
                `Invalida asignacion de area`,
                `La instancia '${identifier}' no fue declarada y se usa en la asignacion de area ${i + 1}`
            );
            break;
        }

        if (validInstances[instanceIndex].areas.indexOf(type) !== -1) {
            r.setError(
                `Invalida asignacion de area`,
                `Ya se le asigno el area '${type}' a la instancia '${identifier}'`
            );
            break;
        }

        validAreas[areaIndex].uses += 1;
        validInstances[instanceIndex].areas.push(type);
    }
    if (r.error) return r;

    for (const area of validAreas) {
        if (area.uses === 0) {
            r.setError(
                `Area no asignada`,
                `El area '${area.type}' no fue asignada a ninguna instancia`
            );
            break;
        }
    }
    if (r.error) return r;

    for (const instance of validInstances) {
        if (instance.areas.length === 0) {
            r.setError(
                `Area no asignada`,
                `La instancia '${instance.identifier}' no tiene ningun area asignada`
            );
            break;
        }
    }
    if (r.error) return r;
    
    const initials = inits.initial_positions;

    for(let i = 0; i < initials.length; i++) {
        const identifier = initials[i].identifier;
        const origin = {
            x : initials[i].x,
            y : initials[i].y
        }

        const instanceIndex = validInstances.findIndex( e => e.identifier === identifier);

        if (instanceIndex === -1) {
            r.setError(
                `Invalida inicializacion`,
                `Instancia '${identifier}' no fue declarada y se usa en la inicializacion ${i + 1}`
            );
            break;
        }

        if (validInstances[instanceIndex].initial_position.x) {
            r.setError(
                `Invalida inicializacion`,
                `La instancia '${identifier}' solo puede tener un punto inicial, segundo punto en la inicializacion ${i + 1}`
            );
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
            r.setError(
                `Invalida inicializacion`,
                `Coordenadas iniciales para la instancia '${identifier}' no pertenen a su area en la inicializacion ${i + 1}`
            );
            break;
        }

        validInstances[instanceIndex].initial_position = origin;
    }
    if (r.error) return r;

    for (const instance of validInstances) {
        if (!instance.initial_position.x) {
            r.setError(
                `Invalida inicializacion`,
                `No se asigno un punto inicial para la instancia '${instance.identifier}'`
            );
            break;
        }
    }

    return r;
}

const validateExpression = (exp, varIds) => {
    const r = new ValidationError();
    if (!exp.type) return r;

    const type = exp.type;

    if ( type === "BINARY_OPERATION" ) {
        const resultLeft = validateExpression(exp.lhs, varIds);
        if (resultLeft.error) return resultLeft;

        const resultRight = validateExpression(exp.rhs, varIds);
        if (resultRight.error) return resultRight;

        return r;
    }

    if ( type === "UNARY_OPERATION" ) {
        const resultRight = validateExpression(exp.rhs, varIds);
        if (resultRight.error) return resultRight;

        return r;
    }

    if ( type === "VARIABLE" ) {
        if (!identifierExist(exp.identifier, varIds)) {
            r.setError(
                "Invalida variable",
                `Variable '${exp.identifier}' no fue declarada`
            );
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
                "Invalida asignacion",
                `Variable '${identifier}' no fue declarada`
            )
            return r;
        }
        const value = statement.value;
        const resultExp = validateExpression(value, varIds);
        if (resultExp.error) {
            r.setError(
                resultExp.type,
                `${resultExp.context}, en la asignacion de la variable ${identifier}`,
            )
        }
        return r;
    }

    if ( type === "STATEMENT_BLOCK" ) {
        const resultBody = validateBody(statement.body, varIds, instancesIds, validProcedures);
        if (resultBody.error) {
            r.setError(
                resultBody.type,
                resultBody.context,
            )
        }
        return r;
    }

    if ( type === "IF" || type === "FOR" || type === "WHILE" ) {
        const condition = statement.condition;
        const resultCond = validateExpression(condition, varIds);
        if (resultCond.error) {
            r.setError(
                resultCond.type,
                `${resultCond.context}, en declaracion de condicion`,
            )
            return r;
        }

        const resultBody = validateStatement(statement.body, varIds, instancesIds, validProcedures)
        if (resultBody.error) {
            r.setError(
                resultBody.type,
                resultBody.context,
            )
            return r;
        }

        if (type === "IF") {
            const resultElse = validateStatement(statement.body, varIds, instancesIds, validProcedures)
            if (resultElse.error) {
                r.setError(
                    resultElse.type,
                    `${resultElse.context}, en la declaracion del sino`,
                )
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
                `Invalida declaracion de parametro`,
                `${resultExp.context}, en la declaracion del parametro para el Informar`
            )
        }

        return r;
    }

    if ( type === "CHANGE_POSITION" ) {
        const { x, y } = statement;

        let resultExp = validateExpression(x, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalida declaracion de parametro`,
                `${resultExp.context}, en la coordenada x del Pos`
            )
            return r;
        }

        resultExp = validateExpression(y, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalida declaracion de parametro`,
                `${resultExp.context}, en la coordenada y del Pos`
            )
        }

        return r;
    }

    if ( type === "MESSAGE" ) {
        const { val, who, mode } = statement;

        const resultExp = validateExpression(val, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalida declaracion de parametro`,
                `${resultExp.context}, en el parametro de valor del ${mode === "SEND"? "Enviar" : "Recibir"}Mensaje`
            )
            return r;
        }

        instancesIds.push("*");
        const resultWho = identifierExist(who, instancesIds);
        if (!resultWho) {
            r.setError(
                `Invalida declaracion de parametro`,
                `Instancia '${who}' no fue declarada y se usa en el parametro de instancia del Mensaje`
            )
        }

        return r;
    }

    if ( type === "CONTROL_CORNER" ) {
        const { x, y, mode } = statement;

        let resultExp = validateExpression(x, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalida declaracion de parametro`,
                `${resultExp.context}, en la coordenada x del ${mode === "BLOCK"? "Bloquear" : "Liberar"}Esquina`
            )
            return r;
        }

        resultExp = validateExpression(y, varIds);
        if (resultExp.error) {
            r.setError(
                `Invalida declaracion de parametro`,
                `${resultExp.context}, en la coordenada x del ${mode === "BLOCK"? "Bloquear" : "Liberar"}Esquina`
            )
        }

        return r;
    }

    if ( type === "CALL_PROCEDURE" ) {
        const { identifier, parameters } = statement;

        const validProceduresIds = getIdentifiers(validProcedures);

        const identifierIndex = validProceduresIds.indexOf(identifier);
        if (identifierIndex === -1) {
            r.setError(
                `Invalido llamado de proceso`,
                `El proceso '${identifier}' no fue declarado`
            )
            return r;
        }

        const formalParameters = validProcedures[identifierIndex].parameters;
        const actualParameters = parameters;

        if (formalParameters.length > actualParameters.length) {
            r.setError(
                `Invalido llamado de proceso`,
                `Menos parametros en la llamada del proceso que los correspondientes para el proceso '${identifier}'`
            )
            return r;
        }
        else if (formalParameters.length < actualParameters.length) {
            r.setError(
                `Invalido llamado de proceso`,
                `Mas parametros en la llamada del proceso que los correspondientes para el proceso '${identifier}'`
            );
            return r;
        }
        
        if (formalParameters.length === 0) return r;

        for (let i = 0; i < formalParameters.length; i++) {
            if (formalParameters[i].type_parameter = "ES") {
                if (actualParameters[i].type !== "VARIABLE"){
                    r.setError(
                        `Invalido llamado de proceso`,
                        `Parametro ${i + 1} en la llamada del proceso '${identifier}' debe ser una variable ya que la posicion corresponde a uno parametro ES`
                    )
                    break;
                }
                if (!identifierExist(actualParameters[i].identifier, varIds)) {
                    r.setError(
                        `Invalido llamado de proceso`,
                        `Variable '${actualParameters[i].identifier}' no fue declarada y se usa en el llamado del proceso '${identifier}'`
                    )
                    break;
                }
            }
            else {
                const resultExp = validateExpression(actualParameters[i].value, varIds);
                if (resultExp.error) {
                    r.setError(
                        `Invalido llamado de proceso`,
                        `${resultExp.context}, en la declaracion del paramtro ${i + 1} en el llamado del proceso '${identifier}'`
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

    const validProceduresIds = [];
    for(let i = 0; i < procedures.length; i++) {
        const procedureId = procedures[i].identifier;

        const indexIdExist = validProceduresIds.indexOf(procedureId)
        if (indexIdExist !== -1) {
            r.setError(
                `Invalida declaracion de proceso`,
                `Identificador '${procedureId}' se usa en la declaracion del proceso ${indexIdExist + 1} y ${i + 1}`
            )
            break;
        }

        const resultPar = identifiersAreUnique(procedures[i].parameters, "parametro");
        if (resultPar.error) {
            r.setError(
                `Invalida declaracion de parametro`,
                `${resultPar.errorContext}, en la declaracion del proceso '${procedureId}'`
            )
            break;
        }

        const resultVar = identifiersAreUnique(procedures[i].local_variables, "variable");
        if (resultVar.error) {
            r.setError(
                `Invalida declaracion de variable`,
                `${resultVar.errorContext}, en la declaracion del proceso '${procedureId}'`
            )
            break;
        }

        const allVarIds = getIdentifiers(procedures[i].local_variables).concat(getIdentifiers(procedures[i].parameters));
        
        const body = procedures[i].body;
        const resultBody = validateBody(body, allVarIds, instancesIds, validProcedures);

        if (resultBody.error) {
            r.setError(
                `${resultBody.type}`,
                `${resultBody.context}, en la declaracion del proceso '${procedureId}'`
            )
            break;
        }

        validProceduresIds.push(procedureId);
    }

    return r;
}

const validateRobotTypes = (robot_types, procedures, instancesIds) => {
    const r = new ValidationError();

    let validProcedures = [];
    if (procedures.length > 0) {
        validProcedures = getValidProcedures(procedures);
    }

    const validRobotTypeIds = [];
    for(let i = 0; i < robot_types.length; i++) {
        const robotTypeId = robot_types[i].identifier;

        const indexIdExist = validRobotTypeIds.indexOf(robotTypeId)
        if (indexIdExist !== -1) {
            r.setError(
                `Invalida declaracion de tipo de robot`,
                `Identificador '${robotTypeId}' se usa en la declaracion de tipo de robot ${indexIdExist + 1} y ${i + 1}`
            )
            break;
        }

        const resultVar = identifiersAreUnique(robot_types[i].local_variables, "variable");
        if (resultVar.error) {
            r.setError(
                `Invalida declaracion de variable`,
                `${resultVar.errorContext}, en la declaracion del tipo de robot '${robotTypeId}'`
            )
            break;
        }

        const allVarIds = getIdentifiers(robot_types[i].local_variables);
        
        const body = robot_types[i].body;
        const resultBody = validateBody(body, allVarIds, instancesIds, validProcedures);

        if (resultBody.error) {
            r.setError(
                `${resultBody.type}`,
                `${resultBody.context}, en la declaracion del tipo de robot '${robotTypeId}'`
            )
            break;
        }

        validRobotTypeIds.push(robotTypeId);
    }

    return r;
}


function validateAst(inputAst) {
    const { PROCEDURES, AREAS, ROBOT_TYPES, INSTANCES, INITS } = inputAst;

    const result = new ValidationError();

    result.update(validateAreas(AREAS));

    if (result.error) return result;


    result.update(validateInstances(INSTANCES, ROBOT_TYPES));

    if (result.error) return result;

    result.update(validateInits(INITS, INSTANCES, AREAS));

    if (result.error) return result;

    const instancesIds = getIdentifiers(INSTANCES);
    result.update(validateProcedures(PROCEDURES, instancesIds));
    
    if (result.error) return result;

    result.update(validateRobotTypes(ROBOT_TYPES, PROCEDURES, instancesIds));

    return result;
};

export {validateAst}

// if (astResult.error) {
//     console.log(astResult.errors[0])
// }
// else {
//     console.log(validateAst(astResult.ast.value))
// }
