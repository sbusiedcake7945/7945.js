const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class SQLiteProvider {
    constructor() {
        this.db = null;
        this.path = './7945-data.sqlite';
    }

    async init(config = {}) {
        if (config.path) this.path = config.path;
        
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Tabloyu oluştur
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS bot_data (
                        key TEXT PRIMARY KEY,
                        value TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }

    async set(key, value) {
        return new Promise((resolve, reject) => {
            const valueStr = JSON.stringify(value);
            const timestamp = new Date().toISOString();
            
            this.db.run(`
                INSERT OR REPLACE INTO bot_data (key, value, updated_at) 
                VALUES (?, ?, ?)
            `, [key, valueStr, timestamp], function(err) {
                if (err) reject(err);
                else resolve(value);
            });
        });
    }

    async get(key, defaultValue = null) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT value FROM bot_data WHERE key = ?',
                [key],
                (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    if (!row) {
                        resolve(defaultValue);
                        return;
                    }
                    
                    try {
                        resolve(JSON.parse(row.value));
                    } catch {
                        resolve(row.value);
                    }
                }
            );
        });
    }

    async delete(key) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'DELETE FROM bot_data WHERE key = ?',
                [key],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    async has(key) {
        const value = await this.get(key);
        return value !== null;
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT key, value FROM bot_data', (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const result = {};
                for (const row of rows) {
                    try {
                        result[row.key] = JSON.parse(row.value);
                    } catch {
                        result[row.key] = row.value;
                    }
                }
                
                resolve(result);
            });
        });
    }

    async close() {
        if (this.db) {
            return new Promise((resolve) => {
                this.db.close(resolve);
            });
        }
    }
}

module.exports = SQLiteProvider;