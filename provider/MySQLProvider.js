const mysql = require('mysql2/promise');

class MySQLProvider {
    constructor() {
        this.connection = null;
        this.config = null;
    }

    async init(config) {
        this.config = config;
        this.connection = await mysql.createConnection({
            host: config.host || 'localhost',
            port: config.port || 3306,
            user: config.user || 'root',
            password: config.password || '',
            database: config.database || '7945js',
            charset: config.charset || 'utf8mb4'
        });

        // Tabloyu oluştur
        await this.connection.execute(`
            CREATE TABLE IF NOT EXISTS bot_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                data_key VARCHAR(255) UNIQUE NOT NULL,
                data_value JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    }

    async set(key, value) {
        const query = `
            INSERT INTO bot_data (data_key, data_value) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE data_value = VALUES(data_value)
        `;
        
        await this.connection.execute(query, [key, JSON.stringify(value)]);
        return value;
    }

    async get(key, defaultValue = null) {
        const [rows] = await this.connection.execute(
            'SELECT data_value FROM bot_data WHERE data_key = ?',
            [key]
        );

        if (rows.length === 0) return defaultValue;
        
        try {
            return JSON.parse(rows[0].data_value);
        } catch {
            return rows[0].data_value;
        }
    }

    async delete(key) {
        const [result] = await this.connection.execute(
            'DELETE FROM bot_data WHERE data_key = ?',
            [key]
        );
        return result.affectedRows > 0;
    }

    async has(key) {
        const [rows] = await this.connection.execute(
            'SELECT 1 FROM bot_data WHERE data_key = ?',
            [key]
        );
        return rows.length > 0;
    }

    async getAll() {
        const [rows] = await this.connection.execute('SELECT data_key, data_value FROM bot_data');
        const result = {};
        
        for (const row of rows) {
            try {
                result[row.data_key] = JSON.parse(row.data_value);
            } catch {
                result[row.data_key] = row.data_value;
            }
        }
        
        return result;
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
        }
    }
}

module.exports = MySQLProvider;