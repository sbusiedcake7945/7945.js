const { createBot } = require('../index.js');

// Basit bir bot oluştur
const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!',
    intents: 32509
});

// Bot hazır olduğunda
bot.on('ready', () => {
    console.log(`✅ ${bot.user.username} çevrimiçi!`);
    console.log(`📊 ${bot.guilds.size} sunucuda hizmet veriyor`);
});

// Mesaj olayı
bot.on('message', (message) => {
    console.log(`💬 ${message.author.username}: ${message.content}`);
});

// Hata yönetimi
bot.on('error', (error) => {
    console.error('❌ Bot hatası:', error);
});

// Heartbeat izleme
bot.on('heartbeat', (data) => {
    console.log(`💓 Heartbeat: ${data.status} - ${new Date(data.timestamp).toLocaleTimeString()}`);
});

// Basit komutlar
bot.commands.add({
    name: 'merhaba',
    description: 'Basit bir selamlama komutu',
    execute: (message) => {
        message.reply('👋 Merhaba! 7945.js ile yazıldım!');
    }
});

bot.commands.add({
    name: 'ping',
    description: 'Bot gecikmesini gösterir',
    execute: (message) => {
        const start = Date.now();
        message.reply('🏓 Pinging...').then(sentMessage => {
            const latency = Date.now() - start;
            message.reply(`📊 Bot Gecikmesi: ${latency}ms`);
        });
    }
});

bot.commands.add({
    name: 'sunucu',
    description: 'Sunucu bilgilerini gösterir',
    execute: (message) => {
        if (!message.guild) {
            return message.reply('❌ Bu komut sadece sunucularda çalışır!');
        }
        
        message.reply(`🏠 Sunucu: ${message.guild.id}\n👥 Üye Sayısı: Bilgi alınıyor...`);
    }
});

bot.commands.add({
    name: 'kullanıcı',
    description: 'Kullanıcı bilgilerini gösterir',
    execute: (message) => {
        message.reply(`👤 Kullanıcı: ${message.author.username}\n🆔 ID: ${message.author.id}`);
    }
});

// Web paneli başlat
bot.createWebPanel(3000);

// Botu başlat
bot.login().then(() => {
    console.log('🚀 Bot başlatılıyor...');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Bot kapatılıyor...');
    bot.destroy();
    process.exit(0);
});