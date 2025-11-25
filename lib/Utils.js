const fs = require('fs');
const path = require('path');

class Utils {
    static formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}g ${hours % 24}sa ${minutes % 60}d`;
        if (hours > 0) return `${hours}sa ${minutes % 60}d ${seconds % 60}sn`;
        if (minutes > 0) return `${minutes}d ${seconds % 60}sn`;
        return `${seconds}sn`;
    }

    static parseDuration(duration) {
        const matches = duration.match(/(\d+)([smhd])/g);
        if (!matches) return 0;

        let totalMs = 0;
        for (const match of matches) {
            const value = parseInt(match);
            const unit = match.slice(-1);

            switch (unit) {
                case 's': totalMs += value * 1000; break;
                case 'm': totalMs += value * 60 * 1000; break;
                case 'h': totalMs += value * 60 * 60 * 1000; break;
                case 'd': totalMs += value * 24 * 60 * 60 * 1000; break;
            }
        }

        return totalMs;
    }

    static escapeMarkdown(text) {
        return text.replace(/([_*~`|\\])/g, '\\$1');
    }

    static chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static generateId(length = 8) {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static formatNumber(number) {
        return new Intl.NumberFormat('tr-TR').format(number);
    }

    static getFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    static deepMerge(target, source) {
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], this.deepMerge(target[key], source[key]));
            }
        }
        return Object.assign(target, source);
    }

    static async loadJSON(filePath) {
        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }

    static async saveJSON(filePath, data) {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    static paginate(array, page, limit) {
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            data: array.slice(start, end),
            total: array.length,
            pages: Math.ceil(array.length / limit),
            current: page
        };
    }

    static createProgressBar(value, max, size = 20) {
        const percentage = value / max;
        const progress = Math.round(size * percentage);
        const empty = size - progress;
        
        return '█'.repeat(progress) + '░'.repeat(empty) + ` ${Math.round(percentage * 100)}%`;
    }

    static parseArgs(args) {
        const parsed = {};
        let currentKey = null;

        for (const arg of args) {
            if (arg.startsWith('--')) {
                currentKey = arg.slice(2);
                parsed[currentKey] = true;
            } else if (arg.startsWith('-')) {
                currentKey = arg.slice(1);
                parsed[currentKey] = true;
            } else if (currentKey) {
                parsed[currentKey] = arg;
                currentKey = null;
            }
        }

        return parsed;
    }

    static capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    static isSnowflake(id) {
        return /^\d{17,19}$/.test(id);
    }

    static getTimestamp(snowflake) {
        return Math.floor(parseInt(snowflake) / 4194304 + 1420070400000);
    }
     static createCustomFunction(name, func) {
        this[name] = func;
        return this;
    }
    
    // Matematik fonksiyonları
    static calculate(expression) {
        try {
            // Güvenli hesaplama
            const safeExpression = expression.replace(/[^0-9+\-*/().]/g, '');
            return eval(safeExpression);
        } catch (error) {
            throw new Error('Geçersiz matematik ifadesi');
        }
    }
    
    // String işlemleri
    static reverseText(text) {
        return text.split('').reverse().join('');
    }
    
    static capitalizeWords(text) {
        return text.replace(/\b\w/g, char => char.toUpperCase());
    }
    
    // Zaman fonksiyonları
    static getTurkishDate() {
        return new Date().toLocaleString('tr-TR');
    }
    
    // Rastgele fonksiyonlar
    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    createEmbed(title, description, color = 0x0099ff, footer) {
        return {
            title: title,
            description: description,
            color: color,
            timestamp: new Date().toISOString(),
            footer: footer
        };
    }
    
    createPagination(array, page, itemsPerPage = 10) {
        const totalPages = Math.ceil(array.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const items = array.slice(start, end);
        
        return {
            items: items,
            page: page,
            totalPages: totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    }
    
    // Text utility
    truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    
    // Number utility
    formatCurrency(amount, currency = 'TRY') {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    // Date utility
    formatRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minute = 60 * 1000;
        const hour = minute * 60;
        const day = hour * 24;
        
        if (diff < minute) return 'az önce';
        if (diff < hour) return `${Math.floor(diff / minute)} dakika önce`;
        if (diff < day) return `${Math.floor(diff / hour)} saat önce`;
        return `${Math.floor(diff / day)} gün önce`;
    }
}


module.exports = Utils;