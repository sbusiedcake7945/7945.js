const { createBot } = require('./index.js');

// 1. Bot oluştur
const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!'
});

// 2. Basit komut ekle
bot.commands.add({
    name: 'merhaba',
    description: 'Selamlama',
    execute: (message) => {
        message.reply('👋 Merhaba! 7945.js ile yazıldım!');
    }
});

// 3. Web panel başlat
bot.createWebPanel(3000);

// 4. Botu başlat
bot.login().then(() => {
    console.log('✅ Bot başlatıldı!');
});