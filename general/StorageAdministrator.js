"use strict";

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
        this.localKeys = [];
        this.localItems = [];

        Object.keys(localStorage).forEach(key => {
            this.localKeys.push(key);
            this.localItems.push(new LocalItem(key, ""))
        })
    }
  
    addLocalItem (key = "", defaultValue ) {
        if (key === "") return;
        this.localKeys.push(key);
        const newItem = new LocalItem(key, defaultValue);
        this.localItems.push(newItem);
    }

    getLocalValue (key = "", defaultValue ) {
        const keyIndex = this.localKeys.indexOf(key);
        if (keyIndex === -1) {
            this.addLocalItem(key, defaultValue);
            return defaultValue;
        };

        const value = this.localItems[keyIndex].getValue();

        return value;
    }

    setLocalValue (key = "", value ) {
        const keyIndex = this.localKeys.indexOf(key);
        if (keyIndex === -1) {
            this.addLocalItem(key, value);
            return;
        }

        this.localItems[keyIndex].setValue(value);
    }

    clear () {
        localStorage.clear();
    }
}

export default StorageAdministrator;
