const fs = require('fs');
const path = require('path');

class JSONProvider {
    constructor() {
        this.data = {};
        this.path = './7945-data.json';
    }
    
    init(config = {}) {
        if (config.path) this.path = config.path;
        this._load();
    }
    
    _load() {
        try {
            if (fs.existsSync(this.path)) {
                this.data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            }
        } catch (error) {
            this.data = {};
        }
    }
    
    _save() {
        fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
    }
    
    async set(key, value) {
        const keys = key.split('.');
        let current = this.data;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        this._save();
        return value;
    }
    
    async get(key, defaultValue = null) {
        const keys = key.split('.');
        let current = this.data;
        
        for (const k of keys) {
            if (current[k] === undefined) return defaultValue;
            current = current[k];
        }
        
        return current;
    }
    
    async delete(key) {
        const keys = key.split('.');
        let current = this.data;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) return false;
            current = current[keys[i]];
        }
        
        const lastKey = keys[keys.length - 1];
        if (current[lastKey] !== undefined) {
            delete current[lastKey];
            this._save();
            return true;
        }
        
        return false;
    }
    
    async has(key) {
        const value = await this.get(key);
        return value !== null;
    }
}

module.exports = JSONProvider;