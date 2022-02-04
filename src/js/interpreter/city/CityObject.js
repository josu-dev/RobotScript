"use strict";

class Sprite {
    constructor(config) {
        //Set up image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //Configure Animation & Initial State
        this.animations = config.animations || {
            "up": [ [0,0] ],
            "right": [ [1,0] ],
            "down": [ [2,0] ],
            "left": [ [3,0] ],
        }
        this.currentAnimation = config.currentAnimation || "up";

        this.storage = config.storage;
        this.cityObject = config.cityObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][0]
    }

    setAnimation(key) {
        if (this.currentAnimation !== key ) {
            this.currentAnimation = key;
        }
    }
    draw(ctx, cameraObject) {
        const x = -16 + this.storage.camera.origin.x + this.cityObject.x + (this.storage.camera.width / 2) - cameraObject.x;
        const y = 12 + this.storage.camera.origin.y - this.cityObject.y + (this.storage.camera.height / 2) + cameraObject.y;

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
            frameX * 8, frameY * 8,
            8, 8,
            x, y,
            8, 8
        );
    }
}

class CityObject {
    constructor(config) {
        this.city = config.city || {};

        this.isMountable = config.isMountable || false;
        this.isMounted = false;

        this.x = utils.withGrid(config.x) || 0;
        this.y = utils.withGrid(config.y) || 0;

        this.sprite = new Sprite({
            storage: this.city.storage,
            cityObject: this,
            src: config.src || "./src/assets/city/sprite-default.png",
        });
    }

    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);
    }

    update() {

    }
}

class CityItem extends CityObject {
    constructor(config) {
        super({
            ...config,
            src : config.type === "flower" ? "./src/assets/city/object/item/flower-8x8.png" :"./src/assets/city/object/item/paper-8x8.png",
        });
        this.isMountable = false;
        this.type = config.type;
        this.cuantity = config.cuantity || 0;
    }
}

class ExpResult {
    constructor(error = false, value = true || 0) {
        this.error = error;
        this.value = value;
        this.context = "";
    }

    setValue(value) {
        this.value = value;
    }

    setError(context = "") {
        this.error = true;
        this.context = context;
    }
}
class StmtResult {
    constructor() {
        this.success = true;
        this.error = false;
        this.context = "";
    }

    setError(context) {
        this.error = true;
        this.context = context;
    }

    update( newResult = StmtResult ) {
        this.success = newResult.success;
        this.error = newResult.error;
        this.context = newResult.context;
    }
}

class Mensaje {
    constructor(identifier = "", value = true || 1){
        this.identifier = identifier;
        this.value = value;
    }
}

class Robot extends CityObject {
    constructor(config) {
        super(config);
        this.map = config.map;
        this.isMountable = config.isMountable === false? false : true;
        this.direction = config.direction || "up";
        this.moveSpeed = config.moveSpeed || 16;
        this.directionUpdate = {
            "up" : ["y", this.moveSpeed],
            "down" : ["y", -this.moveSpeed],
            "left" : ["x", -this.moveSpeed],
            "right" : ["x", this.moveSpeed]
        }
        this.identifier = config.identifier;
        this.areas = config.areas || [];
        this.variables = [];
        this.variables.push(config.variables);
        this.varIndex = 0;
        this.procedures = config.procedures || [];
        this.statements = config.statements || [];
        this.inventory = config.inventory || {};
        this.isRunning = this.statements.length > 0;
        this.instIndex = 0;
        this.messages = [];
        this.otherRobots = this.map.robots;

        this.get = {
            varValue : (id) => {
                let value = null;
                this.variables[this.varIndex].forEach(variable => {
                    if (variable.identifier === id) {
                        value = variable.value;
                    }
                });
                return value;
            },
            posX : () => {
                return (this.x / 16)
            },
            posY : () => {
                return (this.y / 16)
            },
            message : (identifier, varId) => {
                if (this.messages.length === 0) return false;
                if (identifier === "*") {
                    const finded = this.messages.shift();
                    this.set.varValue(varId, finded.value);
                    return true;
                }

                for (let i=0; i< this.messages.length; i++) {
                    if (this.messages[i].identifier === identifier) {
                        const value = this.messages[i].value;
                        this.messages.splice(i,1);
                        this.set.varValue(varId, value);
                        return true;
                    }
                }

                return false;
            },
            procedure : (id) => {
                let proc = {};
                for (const procedure of this.procedures) {
                    if (procedure.identifier === id) {
                        proc = procedure;
                        break;
                    }
                }
                return proc;
            }
        }

        this.set = {
            varValue : (id, newValue) => {
                this.variables[this.varIndex].forEach(variable => {
                    if (variable.identifier === id) {
                        variable.value = newValue
                    }
                });
            },
            varValueIndexed : (id, newValue, index) => {
                this.variables[index].forEach(variable => {
                    if (variable.identifier === id) {
                        variable.value = newValue
                    }
                });
            },
            message : (identifier, value) => {
                this.otherRobots[identifier].messages.push(
                    new Mensaje(this.identifier, value)
                )
                // Object.values(this.otherRobots).forEach( robot => {
                //     if (robot.identifier === identifier) {
                //         robot.messages.push({
                //         });
                //     }
                // });
            }
        }
    }

    resolveStatement(s) {
        const resolveExpression = (exp) => {
            const r = new ExpResult();
            const type = exp.type;

            if ( type === "LITERAL_INTEGER" || type === "LITERAL_BOOLEAN" ) {
                r.value = exp.value;
                return r;
            }

            if ( type === "VARIABLE" ) {
                r.value = this.get.varValue(exp.identifier);
                return r;
            }

            if ( type === "STATE_METHOD" ) {
                const id = exp.identifier;

                if ( id === "HayFlorEnLaEsquina" || id === "HayPapelEnLaEsquina" ) {
                    const type = id === "HayFlorEnLaEsquina"? "flower" : "paper";
                    r.value = this.map.state.item(type, this.x, this.y);
                    return r;
                }

                if ( id === "HayFlorEnLaBolsa" || id === "HayPapelEnLaBolsa" ) {
                    const type = id === "HayFlorEnLaBolsa"? "flower" : "paper";
                    r.value = this.inventory[type] > 0;
                    return r;
                }

                if ( id === "PosCa" || id === "PosAv" ) {
                    const type = id === "PosCa"? "posY" : "posX";
                    
                    r.value = this.get[type]();
                    return r;
                }
            }

            if ( type === "BINARY_OPERATION" ) {
                const rLeft = resolveExpression(exp.lhs);
                if (rLeft.error) return rLeft;

                const rRight = resolveExpression(exp.rhs);
                if (rRight.error) return rRight;

                const op = exp.operator;
                if (op === "+") {
                    r.value = rLeft.value + rRight.value;
                    return r;
                }
                if (op === "-") {
                    r.value = rLeft.value - rRight.value;
                    return r;
                }
                if (op === "*") {
                    r.value = rLeft.value * rRight.value;
                    return r;
                }
                if (op === "/") {
                    r.value = rLeft.value / rRight.value;
                    return r;
                }
                if (op === "&") {
                    r.value = rLeft.value && rRight.value;
                    return r;
                }
                if (op === "|") {
                    r.value = rLeft.value || rRight.value;
                    return r;
                }
                if (op === "=") {
                    r.value = rLeft.value === rRight.value;
                    return r;
                }
                if (op === "!=") {
                    r.value = rLeft.value !== rRight.value;
                    return r;
                }
                if (op === ">") {
                    r.value = rLeft.value > rRight.value;
                    return r;
                }
                if (op === ">=") {
                    r.value = rLeft.value >= rRight.value;
                    return r;
                }
                if (op === "<") {
                    r.value = rLeft.value < rRight.value;
                    return r;
                }
                if (op === "<=") {
                    r.value = rLeft.value <= rRight.value;
                    return r;
                }
            }

            if ( type === "UNARY_OPERATION" ) {
                const op = exp.operator;
                const rRight = resolveExpression(exp.rhs);
                if (rRight.error) return rRight;

                if (op === "-") {
                    r.value = - rRight.value;
                    return r;
                }
                if (op === "!") {
                    r.value = ! rRight.value;
                    return r;
                }
            }
        };

        const addStatements = (newSs) => {
            let index = this.instIndex;
            newSs.forEach(s => {
                index = index + 1;
                this.statements.splice(index, 0, s)
            });
        }

        const r = new StmtResult();
        const type = s.type;

        if ( type === "ACTION_METHOD" ) {
            const id = s.identifier;
            if (id === "mover") {
                const movementResult = this.updatePosition();
                if (movementResult.error) {
                    r.setError(
                        `${movementResult.message}, al ejecutar la instruccion mover`
                    );
                }

                return r;
            }

            if (id === "derecha") {
                if (this.direction === "up") this.direction = "right";
                else if (this.direction === "right") this.direction = "down";
                else if (this.direction === "down") this.direction = "left";
                else if (this.direction === "left") this.direction = "up";

                this.updateSprite();
                return r;
            }

            if (id === "tomarFlor" || id === "tomarPapel") {
                const type = id === "tomarFlor"? "flower" : "paper";
                const isItem = this.map.action.take(type, this.x, this.y);
                if (!isItem) {
                    const typeSpanish = type === "flower"? "flor" : "papel";
                    r.setError(
                        `No exite ${typeSpanish} en la posicion ${this.x / 16}, ${this.y / 16} para ser tomada`
                    )
                    return r;
                }

                this.inventory[`${type}`] += 1;
                return r;
            }

            if (id === "depositarFlor" || id === "depositarPapel") {
                const type = id === "depositarFlor"? "flower" : "paper";
                const isItem = this.inventory[`${type}`] > 0;
                if (!isItem) {
                    const typeSpanish = type === "flower"? "flor" : "papel";
                    r.setError(
                        `No exite ${typeSpanish} en la bolsa para ser depositada`
                    )
                    return r;
                }

                this.map.action.add(type, this.x, this.y);
                this.inventory[`${type}`] -= 1;
                return r;
            }
        }

        if ( type === "STATEMENT_ASSIGN" ) {
            const rValue = resolveExpression(s.value);
            if (rValue.error) {
                r.setError(
                    `No se pudo calcular el valor de la asignacion`
                );
                return r;
            }
            const value = rValue.value;
            
            // check is var type and value type match, if not return error

            this.set.varValue(s.identifier, value);

            return r;
        }

        if ( type === "CHANGE_POSITION" ) {
            const rX = resolveExpression(s.x);
            if (rX.error) {
                r.setError(
                    `No se pudo calcular la coordenada x del Pos`
                );
                return r;
            }

            const rY = resolveExpression(s.y);
            if (rY.error) {
                r.setError(
                    `No se pudo calcular la coordenada y del Pos`
                );
                return r;
            }
            const newX = utils.withGrid(rX.value);
            const newY = utils.withGrid(rY.value);

            if (newX === this.x && newY === this.y) return r;

            const isPositionValid = this.validatePositioning(newX, newY);

            if (isPositionValid.error) {
                r.setError(
                    `${isPositionValid.message}, al ejecutar la instruccion Pos`
                )
                return r;
            }

            this.map.moveWall(this.x, this.y, newX, newY);

            this.x = newX;
            this.y = newY;
            return r;
        }

        if ( type === "INFORM" ) {

            let arg1 = { error : false, value : null };
            if (s.arg1.type === "STRING_LITERAL") {
                arg1.value = s.arg1.value;
            }
            else {
                arg1.value = resolveExpression(s.arg1).value;
            }

            let arg2 = { error : false, value : null };
            if (s.arg2.type) {
                arg2.value = resolveExpression(s.arg2).value;
            }
            else {
                arg2.value = "";
            }
            let message = "";
            if (arg2.value === "") {
                message = `${arg1.value}`;
            }
            else {
                message = `${arg1.value}, ${arg2.value}`;
            }
            
            this.map.addLog(
                "Informar",
                message,
                `${this.identifier}`
            )
            return r;
        }

        if ( type === "GENERATE_NUMBER" ) {
            const rMin = resolveExpression(s.min);
            if (rMin.error) {
                r.setError(
                    `No se pudo calcular el minimo del Random`
                );
                return r;
            }
            
            const rMax = resolveExpression(s.max);
            if (rMax.error) {
                r.setError(
                    `No se pudo calcular el maximo del Random`
                );
                return r;
            }

            const value = Math.round(Math.random()*(rMax.value - rMin.value) + rMin.value);
            
            this.set.varValue(s.identifier, value);
            return r;
        }

        if ( type === "MESSAGE" ) {
            const mode = s.mode;
            if (mode === "SEND") {
                const rValue = resolveExpression(s.value);
                if (rValue.error) {
                    r.setError(
                        `No se pudo calcular el valor a enviar`
                    );
                    return r;
                }

                this.set.message(s.who, rValue.value);
            }
            else {
                const success = this.get.message(s.who,s.value.identifier);
                r.success = success;
            }

            return r;
        }

        if ( type === "CONTROL_CORNER" ) {
            const mode = s.mode;
            const rX = resolveExpression(s.x);
            if (rX.error) {
                r.setError(
                    `No se pudo calcular la coordenada x de la esquina a bloquear/liberar`
                );
                return r;
            }

            const rY = resolveExpression(s.y);
            if (rY.error) {
                r.setError(
                    `No se pudo calcular la coordenada y de la esquina a bloquear/liberar`
                );
                return r;
            }

            const x = rX.value;
            const y = rY.value;

            if (mode === "BLOCK") {
                const success = this.map.action.block(x,y);
                r.success = success;
            }
            else {
                const success = this.map.action.unblock(x,y);
            }

            return r;
        }

        if ( type === "IF" ) {
            const rCond = resolveExpression(s.condition);
            if (rCond.error) {
                r.setError(
                    `No se pudo evaluar la condicion del si`
                );
                return r;
            }

            // check if value is a boolean, if not return error

            const ifControl = {
                type : "REMOVE_STATEMENTS",
                length : 2,
                index : this.instIndex
            };

            if (rCond.value === true) {

                if (s.body.type === "STATEMENT_BLOCK") {
                    const newStatements = s.body.body;
                    ifControl.length = newStatements.length + 1;
                    addStatements(newStatements.concat(ifControl));
                }
                else {
                    const newStatements = [s.body, ifControl];
                    addStatements(newStatements);
                }
            }
            else {
                if (!s.else.type) return r;

                if (s.else.type === "STATEMENT_BLOCK") {
                    const newStatements = s.else.body;
                    ifControl.length = newStatements.length;
                    addStatements(newStatements.concat(ifControl));
                }
                else {
                    const newStatements = [s.else, ifControl];
                    addStatements(newStatements);
                }
            }

            return r;
        }
        if ( type === "REMOVE_STATEMENTS" ) {
            this.instIndex = s.index;
            const indexStart = s.index + 1;
            this.statements.splice(indexStart, s.length);
            return r;
        }

        if ( type === "FOR" ) {
            const rIterarions = resolveExpression(s.condition);
            if (rIterarions.error) {
                r.setError(
                    `No se pudo evaluar la cantidad de iteraciones`
                );
                return r;
            }

            const iterations = rIterarions.value;
            // check if value is a number, if not return error

            if (!(iterations > 0)) return r;

            const forControl = {
                type : "JUMP_NUMBER",
                length : 2,
                value : iterations,
                index : this.instIndex
            };

            if (s.body.type === "STATEMENT_BLOCK") {
                const newStatements = s.body.body;
                forControl.length = newStatements.length + 1;

                addStatements(newStatements.concat(forControl));
            }
            else {
                const newStatements = [s.body, forControl];
                addStatements(newStatements);
            }

            return r;
        }
        if ( type === "JUMP_NUMBER" ) {
            s.value = s.value - 1;
            this.instIndex = s.index;
            if (s.value > 0) return r;

            const indexStart = s.index + 1;

            this.statements.splice(indexStart, s.length);
            return r;
        }

        if ( type === "WHILE" ) {
            const rCond = resolveExpression(s.condition);
            if (rCond.error) {
                r.setError(
                    `No se pudo evaluar la condicion del while`
                );
                return r;
            }

            const isTrue = rCond.value;
            // check if value is a boolean, if not return error

            if (!isTrue) return r;

            const whileControl = {
                type : "JUMP_CONDITIONAL",
                length : 2,
                condition : s.condition,
                index : this.instIndex
            };

            if (s.body.type === "STATEMENT_BLOCK") {
                const newStatements = s.body.body;
                whileControl.length = newStatements.length + 1;
                addStatements(newStatements.concat(whileControl));
            }
            else {
                const newStatements = [s.body, whileControl];
                addStatements(newStatements);
            }

            return r;
        }
        if ( type === "JUMP_CONDITIONAL" ) {
            const rCond = resolveExpression(s.condition);
            if (rCond.error) {
                r.setError(
                    `No se pudo evaluar la cantidad de iteraciones`
                );
                return r;
            }

            const isTrue = rCond.value;
            // check if value is a boolean, if not return error

            this.instIndex = s.index;

            if (isTrue) return r;

            const indexStart = s.index + 1;

            this.statements.splice(indexStart, s.length);
            return r;
        }

        if ( type === "CALL_PROCEDURE" ) {
            const identifier = s.identifier;
            const configP = this.get.procedure(identifier);

            if ( configP.body.length === 0 ) return r;

            const newVariables = [];
            for (let i = 0; i<s.parameters.length; i++) {

                const rParameter = resolveExpression(s.parameters[i]);
                if (rParameter.error) {
                    if (rCond.error) {
                        r.setError(
                            `No se pudo evaluar el parametro formal`
                        );
                        break;
                    }
                }

                //check is parameter type is the same as the value

                const newVar = {
                    identifier : configP.parameters[i].identifier,
                    value : rParameter.value,
                    lookup : configP.parameters[i].type_parameter === "ES"? true : false,
                    reference : configP.parameters[i].type_parameter === "ES"? s.parameters[i].identifier : ""
                }

                newVariables.push(newVar);
            };

            configP.local_variables.forEach(variable => {
                
                const newVar = {
                    identifier : variable.identifier,
                    value : variable.type_value === "numero"? 0 : false,
                    lookup : false,
                    reference : ""
                }
                newVariables.unshift(newVar);
            });
            if (r.error) return r;

            this.variables.push(newVariables);
            this.varIndex++;

            const lenght = configP.body.length + 1;
            const procedureControl = {
                type : "REMOVE_PROCEDURE",
                length : lenght,
                index : this.instIndex
            };

            const newStatements = configP.body;
            addStatements(newStatements.concat(procedureControl));

            return r;
        }
        if ( type === "REMOVE_PROCEDURE" ) {
            const indexStart = s.index + 1;
            this.statements.splice(indexStart, s.length);

            this.variables[this.varIndex].forEach(variable => {
                if (variable.lookup) {
                    this.set.varValueIndexed(variable.reference, variable.value, (this.varIndex - 1));
                }
            });

            this.varIndex--;
            this.variables.pop();

            this.instIndex = s.index;

            return r;
        }

        console.log("Te falta resolver un statement pa");
        return r;
    }

    update() {
        if (!this.isRunning) return;

        const statement = this.statements[this.instIndex];

        const rStmt = this.resolveStatement(statement);
        
        if (rStmt.error) {
            this.map.setNewError({
                emitter : this.identifier,
                message : rStmt.context
            });
            this.isRunning = false;
            return;
        }

        if (!rStmt.success) return;

        this.instIndex = this.instIndex + 1;
        if (this.instIndex === this.statements.length) {
            this.isRunning = false;
            this.map.activeInstances--;
        }
    }

    validatePositioning(newX, newY) {
        const pointInArea = ( point, a, b ) => {
            const xInRange = (point.x >= a.x) && (point.x <= b.x);
            const yInRange = (point.y >= a.y) && (point.y <= b.y);
        
            return (xInRange && yInRange);
        }

        let isAreaValid = false;
        for (const area of this.areas) {
            isAreaValid = pointInArea({ x: newX, y: newY}, area.a, area.b);
            if (isAreaValid) break;
        }
        if (!isAreaValid) return {
            error : true,
            message : `El punto x ${newX / 16}, y ${newY / 16} no pertenece a ninguna de las areas designadas`
        }

        const isCornerOcuped = this.map.isSpaceTaken(newX, newY);
        if (isCornerOcuped) return {
            error : true,
            message : `El punto x ${newX / 16}, y ${newY / 16} ya esta siendo ocupado`
        }

        return {
            error : false,
            message : ""
        }
    }

    updatePosition() {
        const { x, y } = utils.nextPosition(this.x, this.y, this.direction);

        const newPositionValid = this.validatePositioning(x,y);

        if (newPositionValid.error) return newPositionValid;
        
        this.map.moveWall(this.x, this.y, x, y);

        this.x = x;
        this.y = y;
        return {
            error : false,
            message : ""
        };
    }

    updateSprite() {
        this.sprite.setAnimation(`${this.direction}`);
    }
}
