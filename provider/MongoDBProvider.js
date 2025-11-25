const { MongoClient } = require('mongodb');

class MongoDBProvider {
    constructor() {
        this.client = null;
        this.db = null;
        this.collection = null;
    }

    async init(config) {
        const url = config.url || 'mongodb://localhost:27017';
        const dbName = config.database || '7945js';
        const collectionName = config.collection || 'bot_data';

        this.client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await this.client.connect();
        this.db = this.client.db(dbName);
        this.collection = this.db.collection(collectionName);

        // Index oluştur
        await this.collection.createIndex({ key: 1 }, { unique: true });
    }

    async set(key, value) {
        await this.collection.updateOne(
            { key },
            { 
                $set: { 
                    value,
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
        return value;
    }

    async get(key, defaultValue = null) {
        const doc = await this.collection.findOne({ key });
        return doc ? doc.value : defaultValue;
    }

    async delete(key) {
        const result = await this.collection.deleteOne({ key });
        return result.deletedCount > 0;
    }

    async has(key) {
        const doc = await this.collection.findOne({ key });
        return doc !== null;
    }

    async getAll() {
        const docs = await this.collection.find({}).toArray();
        const result = {};
        
        for (const doc of docs) {
            result[doc.key] = doc.value;
        }
        
        return result;
    }

    async find(query) {
        return await this.collection.find(query).toArray();
    }

    async close() {
        if (this.client) {
            await this.client.close();
        }
    }
}

module.exports = MongoDBProvider;