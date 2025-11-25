const { createBot } = require('../index.js');

const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!'
});

// Bot instance'ına fonksiyon ekleme
bot.myFunctions = {
    // Kullanıcı doğrulama
    isAdmin: (userId) => {
        const adminIds = ['ADMIN_ID_1', 'ADMIN_ID_2'];
        return adminIds.includes(userId);
    },
    
    // Formatlama fonksiyonları
    formatUser: (user) => {
        return `👤 ${user.username} (${user.id})`;
    },
    
    // Hesaplama fonksiyonları
    calculateXP: (level) => {
        return level * 100 + Math.pow(level, 2) * 50;
    },
    
    // Zaman fonksiyonları
    getUptime: () => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        return `${hours}sa ${minutes}d ${seconds}sn`;
    }
};

// Komutlarda fonksiyon kullanımı
bot.commands.add({
    name: 'admin',
    description: 'Admin kontrolü',
    execute: (message) => {
        if (bot.myFunctions.isAdmin(message.author.id)) {
            message.reply('✅ Sen bir adminsin!');
        } else {
            message.reply('❌ Admin değilsin!');
        }
    }
});

bot.commands.add({
    name: 'seviye',
    description: 'Seviye XP hesaplama',
    execute: (message, args) => {
        const level = parseInt(args[0]) || 1;
        const xp = bot.myFunctions.calculateXP(level);
        message.reply(`🎯 Seviye ${level} için gerekli XP: ${xp}`);
    }
});

bot.commands.add({
    name: 'uptime',
    description: 'Bot çalışma süresi',
    execute: (message) => {
        const uptime = bot.myFunctions.getUptime();
        message.reply(`⏰ Bot çalışma süresi: ${uptime}`);
    }
});