class LocalItem {
    constructor(key = "", defaultValue = "") {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, defaultValue);
        }
        this.key = key;
    }

    getValue() {
        return localStorage.getItem(this.key);
    }
    
    setValue(value) {
        localStorage.setItem(this.key, value);
    }
}

class StorageAdministrator {
    constructor() {
        this.keys = [];
        this.items = [];

        Object.keys(localStorage).forEach(key => {
            this.keys.push(key);
            this.items.push(new LocalItem(key, ""))
        })

        this.program = {
            new : false,
            ast : null
        }

        this.camera = {
            scale : 1,
            origin : {
                x : 0,
                y : 0
            },
            width : 0,
            height : 0
        }
    }
  
    addItem (key = "", defaultValue = "") {
        this.keys.push(key);
        const newItem = new LocalItem(key, defaultValue);
        this.items.push(newItem);
    }

    getValue (key = "", defaultValue = "") {
        const keyIndex = this.keys.indexOf(key);
        if (keyIndex === -1) {
            this.addItem(key, defaultValue);
            return "";
        };

        const value = this.items[keyIndex].getValue();

        return value;
    }

    setValue (key = "", value = "") {
        const keyIndex = this.keys.indexOf(key);
        if (keyIndex === -1) {
            this.addItem(key, value);
            return;
        }

        this.items[keyIndex].setValue(value);
    }

    clear () {
        localStorage.clear();
    }

    loadProgram ( newProgram ) {
        if (!newProgram) {
            this.program.new = false;
            this.program.ast = null;
        }
        else {
            this.program.new = true;
            this.program.ast = newProgram;
        }
    }

    getProgram () {
        return this.program.ast;
    }
}

export default StorageAdministrator;
  