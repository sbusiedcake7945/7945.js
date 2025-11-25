const { createBot } = require('../index.js');

const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!'
});

// JSON veritabanı (varsayılan)
// bot.database.use('json', { path: './data.json' });

// MySQL veritabanı
// bot.database.use('mysql', {
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: '7945js'
// });

// MongoDB veritabanı
// bot.database.use('mongodb', {
//     url: 'mongodb://localhost:27017',
//     database: '7945js'
// });

// SQLite veritabanı
bot.database.use('sqlite', { path: './bot-data.sqlite' });

// Veritabanı komutları
bot.commands.add({
    name: 'kaydet',
    description: 'Veritabanına veri kaydeder',
    usage: '!kaydet <anahtar> <değer>',
    execute: async (message, args) => {
        if (args.length < 2) {
            return message.reply('❌ Kullanım: !kaydet <anahtar> <değer>');
        }

        const key = args[0];
        const value = args.slice(1).join(' ');

        await bot.database.set(key, value);
        message.reply(`✅ **${key}** anahtarına **${value}** değeri kaydedildi!`);
    }
});

bot.commands.add({
    name: 'al',
    description: 'Veritabanından veri alır',
    usage: '!al <anahtar>',
    execute: async (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen bir anahtar girin!');
        }

        const key = args[0];
        const value = await bot.database.get(key, 'Değer bulunamadı');

        message.reply(`📁 **${key}**: ${value}`);
    }
});

bot.commands.add({
    name: 'sil',
    description: 'Veritabanından veri siler',
    usage: '!sil <anahtar>',
    execute: async (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen bir anahtar girin!');
        }

        const key = args[0];
        const deleted = await bot.database.delete(key);

        if (deleted) {
            message.reply(`🗑️ **${key}** anahtarı silindi!`);
        } else {
            message.reply('❌ Anahtar bulunamadı!');
        }
    }
});

bot.commands.add({
    name: 'profil',
    description: 'Kullanıcı profilini kaydeder/gösterir',
    execute: async (message, args) => {
        const userId = message.author.id;
        const key = `user_${userId}`;

        if (args.length === 0) {
            // Profili göster
            const profile = await bot.database.get(key, {});
            
            if (!profile.name) {
                return message.reply('❌ Profiliniz bulunamadı! Profil oluşturmak için: `!profil <isim> <yaş> <şehir>`');
            }

            message.reply(`👤 **Profil Bilgileri:**\n**İsim:** ${profile.name}\n**Yaş:** ${profile.age}\n**Şehir:** ${profile.city}`);
        } else {
            // Profili kaydet
            if (args.length < 3) {
                return message.reply('❌ Kullanım: !profil <isim> <yaş> <şehir>');
            }

            const profile = {
                name: args[0],
                age: args[1],
                city: args.slice(2).join(' '),
                updatedAt: new Date().toISOString()
            };

            await bot.database.set(key, profile);
            message.reply('✅ Profiliniz kaydedildi!');
        }
    }
});

bot.commands.add({
    name: 'seviye',
    description: 'Kullanıcı seviye sistemi',
    execute: async (message) => {
        const userId = message.author.id;
        const key = `level_${userId}`;

        // Seviyeyi artır
        const newLevel = await bot.database.increment(key, 1);
        
        message.reply(`🎉 **Tebrikler!**\nSeviye atladın: **${newLevel}**. seviye`);
    }
});

bot.commands.add({
    name: 'istatistik',
    description: 'Bot istatistiklerini gösterir',
    execute: async (message) => {
        const stats = {
            komutSayisi: bot.commands.all.length,
            calismaSuresi: process.uptime(),
            bellekKullanimi: process.memoryUsage().heapUsed / 1024 / 1024
        };

        await bot.database.set('bot_stats', stats);

        message.reply(
            `📊 **Bot İstatistikleri:**\n` +
            `🛠️ Komut Sayısı: ${stats.komutSayisi}\n` +
            `⏱️ Çalışma Süresi: ${Math.round(stats.calismaSuresi)}s\n` +
            `💾 Bellek: ${stats.bellekKullanimi.toFixed(2)}MB\n` +
            `✅ İstatistikler veritabanına kaydedildi!`
        );
    }
});

bot.on('ready', () => {
    console.log('🗄️ Veritabanı botu çevrimiçi!');
});

bot.createWebPanel(3002);

bot.login();