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
        const x = this.storage.interpreter.zoom.origin.x + this.cityObject.x + utils.withGrid(22.5) - cameraObject.x;
        const y = this.storage.interpreter.zoom.origin.y - this.cityObject.y + utils.withGrid(44.75) - (utils.withGrid(22.5) - cameraObject.y);

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

class myError {
    constructor () {
        this.type = type || "";
        this.context = context || "";
    }

    setError( type = "", context = "" ) {
        this.type = type;
        this.context = context;
    }

    addContext( additionalContext = "" ) {
        this.context = this.context.concat(additionalContext);
    }

    setContext( newContext = "" ) {
        this.context = newContext;
    }
}
class ExecuteResult {
    constructor(estate = true, error = myError) {
        this.success = estate || true;
        this.error = error || null;
    }


    update( newResult = ExecuteResult ) {
        this.success = newResult.success;
        this.error = newResult.error;
    }
}

class Robot extends CityObject {
    constructor(config) {
        super(config);
        this.map = config.map;
        this.isMountable = config.isMountable || true;
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
                return this.x
            },
            posY : () => {
                return this.y
            },
            message : (identifier, varId) => {
                if (this.messages.length === 0) return false;

                if (identifier === "*") {
                    const newValue = this.messages[0].value;
                    this.set.varValue(varId, newValue);
                    this.messages.shift;
                    return true;
                }

                let finded = {};

                for (let i=0; i< this.messages.length; i++) {
                    if (this.messages[i].identifier === identifier) {
                        finded = this.messages[i];
                        this.messages.splice(i,1);
                        break;
                    }
                }

                if (!finded.identifier) return false;

                this.set.varValue(varId, finded.value);
            }
        }

        this.set = {
            varValue : (id, newValue) => {
                let value = null;
                this.variables[this.varIndex].forEach(variable => {
                    if (variable.identifier === id) {
                        variable.value = newValue
                    }
                });
            },
            message : (identifier, value) => {
                this.otherRobots[identifier].messages.push({
                    identifier : identifier,
                    value : value
                })
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
            const r = {
                error : false,
                value : null
            }
            const type = exp.type;

            if ( type === "BINARY_OPERATION" ) {
                const resultLeft = resolveExpression(exp.lhs);
                if (resultLeft.error) return resultLeft;

                const resultRight = resolveExpression(exp.rhs);
                if (resultRight.error) return resultRight;

                const op = exp.operator;
                if (op === "+") {
                    r.value = resultLeft.value + resultRight.value;
                    return r;
                }
                if (op === "-") {
                    r.value = resultLeft.value - resultRight.value;
                    return r;
                }
                if (op === "*") {
                    r.value = resultLeft.value * resultRight.value;
                    return r;
                }
                if (op === "/") {
                    r.value = resultLeft.value / resultRight.value;
                    return r;
                }
                if (op === "&") {
                    r.value = resultLeft.value && resultRight.value;
                    return r;
                }
                if (op === "|") {
                    r.value = resultLeft.value || resultRight.value;
                    return r;
                }
                if (op === "=") {
                    r.value = resultLeft.value == resultRight.value;
                    return r;
                }
                if (op === "!=") {
                    r.value = resultLeft.value != resultRight.value;
                    return r;
                }
                if (op === ">") {
                    r.value = resultLeft.value > resultRight.value;
                    return r;
                }
                if (op === ">=") {
                    r.value = resultLeft.value >= resultRight.value;
                    return r;
                }
                if (op === "<") {
                    r.value = resultLeft.value < resultRight.value;
                    return r;
                }
                if (op === "<=") {
                    r.value = resultLeft.value <= resultRight.value;
                    return r;
                }
            }

            if ( type === "UNARY_OPERATION" ) {
                const operator = exp.operator;
                const resultRight = validateExpression(exp.rhs);
                if (resultRight.error) return resultRight;

                if (op === "-") {
                    r.value = - resultRight.value;
                    return r;
                }
                if (op === "!") {
                    r.value = ! resultRight.value;
                    return r;
                }
            }

            if ( type === "VARIABLE" ) {
                r.value = this.get.varValue(exp.identifier)
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
                    const type = id === "PosCa"? "posX" : "posY";
                    r.value = this.get[type];
                    return r;
                }

                return r;
            }

            if ( type === "LITERAL_INTEGER" || type === "LITERAL_INTEGER" ) {
                r.value = exp.value;
                return r;
            }
        };

        const type = s.type;

        if ( type === "ACTION_METHOD" ) {
            const id = s.identifier;
            if (id === "mover") {
                this.updatePosition();
                return;
            }
            if (id === "derecha") {
                if (this.direction === "up") this.direction = "right";
                else if (this.direction === "right") this.direction = "down";
                else if (this.direction === "down") this.direction = "left";
                else if (this.direction === "left") this.direction = "up";

                this.updateSprite();
                return;
            }
            if (id === "tomarFlor" || id === "tomarPapel") {
                const type = id === "tomarFlor"? "flower" : "paper";
                const isItem = this.map.action.take(type, this.x, this.y);
                if (!isItem) {
                    //Rellenar con error y return
                    return;
                }
                this.inventory[`${type}s`] += 1;
                return;
            }
            if (id === "depositarFlor" || id === "depositarPapel") {
                const type = id === "depositarFlor"? "flower" : "paper";
                const isItem = this.inventory[`${type}`] > 0;
                if (!isItem) {
                    //Rellenar con error y return
                }
                this.map.action.add(type, this.x, this.y);
                this.inventory[`${type}`] -= 1;
                return;
            }
        }

        if ( type === "CHANGE_POSITION" ) {
            const xRes = resolveExpression(s.x);
            const yRes = resolveExpression(s.y);

            const x = utils.withGrid(xRes.value);
            const y = utils.withGrid(yRes.value);

            //validar si esta en sus areas
            this.x = x;
            this.y = y;
            return;
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
            return;
        }

        if ( type === "GENERATE_NUMBER" ) {
            const minRes = resolveExpression(s.min);
            const maxRes = resolveExpression(s.max);
            //check si son validos los numeros

            const value = Math.round(Math.random()*(maxRes.value - minRes.value) + minRes.value);
            
            this.set.varValue(s.identifier, value);
            return;
        }

        if ( type === "MESSAGE" ) {
            const mode = s.mode;

            if (mode === "SEND") {
                const value = resolveExpression(s.value).value;
                this.set.message(s.who, value);
                return;
            }
            else {
                const result = this.get.message(s.who,s.value.identifier);
                //check si se pudo tomar o no
                return result;
            }
        }

        if ( type === "CONTROL_CORNER" ) {
            const mode = s.mode;
            const x = resolveExpression(s.x).value;
            const y = resolveExpression(s.y).value;

            if (mode === "BLOCK") {
                const result = this.map.action.block(x,y);
                //check si se pudo bloquear o no
                return result;
            }
            else {
                const result = this.map.action.unblock(x,y);
                return result;
            }
        }

        // if ( type === "IF" ) {
        //     const mode = s.mode;
        //     const x = resolveExpression(s.x).value;
        //     const y = resolveExpression(s.y).value;

        //     if (mode === "BLOCK") {
        //         const result = this.map.action.block(x,y);
        //         //check si se pudo bloquear o no
        //         return result;
        //     }
        //     else {
        //         const result = this.map.action.unblock(x,y);
        //         return result;
        //     }
        // }


    }

    update() {
        if (!this.isRunning) return;

        const statement = this.statements[this.instIndex];

        const rStatement = this.resolveStatement(statement);
        
        // if (rStatement.error) {
        //     return 
        // }

        // if (!rStatement.success) return;

        this.instIndex++;
        if (this.instIndex === this.statements.length) this.isRunning = false;
    }

    updatePosition() {
        const [axie, value] = this.directionUpdate[this.direction];
        this[axie] += value;
    }

    updateSprite() {
        this.sprite.setAnimation(`${this.direction}`);
    }
}
