const JSONProvider = require('../providers/JSONProvider');
const MySQLProvider = require('../providers/MySQLProvider');
const MongoDBProvider = require('../providers/MongoDBProvider');
const SQLiteProvider = require('../providers/SQLiteProvider');
const KeyValueProvider = require('../providers/KeyValueProvider');

class DatabaseManager {
    constructor(client) {
        this.client = client;
        this.providers = {
            json: new JSONProvider(),
            mysql: new MySQLProvider(),
            mongodb: new MongoDBProvider(),
            sqlite: new SQLiteProvider(),
            keyvalue: new KeyValueProvider()
        };
        this.current = this.providers.json; // Varsayılan JSON
    }
    
    use(type, config) {
        if (this.providers[type]) {
            this.current = this.providers[type];
            if (config) this.current.init(config);
        }
        return this;
    }
    
    async set(key, value) {
        return await this.current.set(key, value);
    }
    
    async get(key, defaultValue = null) {
        return await this.current.get(key, defaultValue);
    }
    
    async delete(key) {
        return await this.current.delete(key);
    }
    
    async has(key) {
        return await this.current.has(key);
    }
}

module.exports = DatabaseManager;