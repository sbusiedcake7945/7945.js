const fs = require('fs');
const path = require('path');

class KeyValueProvider {
    constructor() {
        this.data = new Map();
        this.path = './7945-kv.json';
        this.autoSave = true;
    }

    async init(config = {}) {
        if (config.path) this.path = config.path;
        if (config.autoSave !== undefined) this.autoSave = config.autoSave;
        
        await this._load();
    }

    async _load() {
        try {
            if (fs.existsSync(this.path)) {
                const fileData = JSON.parse(fs.readFileSync(this.path, 'utf8'));
                this.data = new Map(Object.entries(fileData));
            }
        } catch (error) {
            this.data = new Map();
        }
    }

    async _save() {
        if (!this.autoSave) return;
        
        try {
            const obj = Object.fromEntries(this.data);
            await fs.promises.writeFile(this.path, JSON.stringify(obj, null, 2));
        } catch (error) {
            console.error('KeyValue kaydetme hatası:', error);
        }
    }

    async set(key, value) {
        this.data.set(key, value);
        await this._save();
        return value;
    }

    async get(key, defaultValue = null) {
        return this.data.get(key) ?? defaultValue;
    }

    async delete(key) {
        const existed = this.data.delete(key);
        await this._save();
        return existed;
    }

    async has(key) {
        return this.data.has(key);
    }

    async getAll() {
        return Object.fromEntries(this.data);
    }

    async keys() {
        return Array.from(this.data.keys());
    }

    async values() {
        return Array.from(this.data.values());
    }

    async entries() {
        return Array.from(this.data.entries());
    }

    async clear() {
        this.data.clear();
        await this._save();
    }

    async size() {
        return this.data.size;
    }

    async increment(key, amount = 1) {
        const current = await this.get(key, 0);
        const newValue = current + amount;
        await this.set(key, newValue);
        return newValue;
    }

    async decrement(key, amount = 1) {
        return await this.increment(key, -amount);
    }

    async push(key, ...values) {
        const array = await this.get(key, []);
        array.push(...values);
        await this.set(key, array);
        return array;
    }

    async pull(key, value) {
        const array = await this.get(key, []);
        const newArray = array.filter(item => item !== value);
        await this.set(key, newArray);
        return newArray;
    }
}

module.exports = KeyValueProvider;