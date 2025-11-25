const { createBot } = require('../index.js');

const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!',
    intents: 32509
});

// Çoklu veritabanı kullanımı
bot.database.use('json', { path: './data.json' }); // Ana veritabanı

// Moderation sistemi
const warns = new Map();

bot.commands.add({
    name: 'uyar',
    description: 'Kullanıcıyı uyarır',
    usage: '!uyar <@kullanıcı> <sebep>',
    execute: async (message, args) => {
        if (args.length < 2) {
            return message.reply('❌ Kullanım: !uyar <@kullanıcı> <sebep>');
        }

        const userId = args[0].replace(/[<@!>]/g, '');
        const reason = args.slice(1).join(' ');
        
        // Uyarıyı kaydet
        const userWarns = warns.get(userId) || [];
        userWarns.push({
            reason,
            moderator: message.author.id,
            timestamp: Date.now()
        });
        warns.set(userId, userWarns);

        await bot.database.set(`warns_${userId}`, userWarns);

        message.reply(`⚠️ <@${userId}> kullanıcısı uyarıldı!\n**Sebep:** ${reason}\n**Toplam Uyarı:** ${userWarns.length}`);
    }
});

bot.commands.add({
    name: 'uyarilar',
    description: 'Kullanıcının uyarılarını gösterir',
    execute: async (message, args) => {
        const userId = args[0] ? args[0].replace(/[<@!>]/g, '') : message.author.id;
        
        const userWarns = await bot.database.get(`warns_${userId}`, []);
        
        if (userWarns.length === 0) {
            return message.reply('✅ Bu kullanıcının hiç uyarısı yok!');
        }

        let warnText = `⚠️ **Uyarılar (${userWarns.length}):**\n`;
        userWarns.forEach((warn, index) => {
            warnText += `${index + 1}. ${warn.reason} - <t:${Math.floor(warn.timestamp / 1000)}:R>\n`;
        });

        message.reply(warnText);
    }
});

// Oyun sistemi
bot.commands.add({
    name: 'soru',
    description: 'Rastgele soru sorar',
    execute: (message) => {
        const sorular = [
            "En sevdiğin renk nedir?",
            "Hangi dili öğrenmek istersin?",
            "En son izlediğin film?",
            "Favori yemeğin nedir?",
            "Hobilerin neler?"
        ];

        const soru = bot.utils.randomChoice(sorular);
        message.reply(`❓ **Soru:** ${soru}`);
    }
});

bot.commands.add({
    name: 'hesapla',
    description: 'Matematik işlemi yapar',
    execute: (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen bir işlem girin! Örnek: !hesapla 5 + 3');
        }

        try {
            const islem = args.join(' ');
            // Basit güvenlik kontrolü
            if (/[a-zA-Z]/.test(islem)) {
                return message.reply('❌ Güvenlik nedeniyle sadece sayılar ve matematik operatörleri kullanılabilir!');
            }

            const sonuc = eval(islem);
            message.reply(`🧮 **Sonuç:** ${islem} = **${sonuc}**`);
        } catch (error) {
            message.reply('❌ Geçersiz işlem!');
        }
    }
});

// API entegrasyonu
bot.commands.add({
    name: 'havadurumu',
    description: 'Hava durumu bilgisi (simülasyon)',
    execute: (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen bir şehir adı girin!');
        }

        const sehir = args.join(' ');
        const durumlar = ['Güneşli ☀️', 'Bulutlu ☁️', 'Yağmurlu 🌧️', 'Karlı ❄️', 'Fırtınalı ⚡'];
        const sicaklik = Math.floor(Math.random() * 35) + 5;
        const durum = bot.utils.randomChoice(durumlar);

        message.reply(
            `🌤️ **${bot.utils.capitalize(sehir)} Hava Durumu:**\n` +
            `🌡️ Sıcaklık: ${sicaklik}°C\n` +
            `📊 Durum: ${durum}\n` +
            `💨 Nem: %${Math.floor(Math.random() * 100)}`
        );
    }
});

// Yönetim komutları
bot.commands.add({
    name: 'temizle',
    description: 'Mesajları temizler',
    usage: '!temizle <sayı>',
    execute: async (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen silinecek mesaj sayısını girin!');
        }

        const count = parseInt(args[0]);
        if (isNaN(count) || count < 1 || count > 100) {
            return message.reply('❌ Lütfen 1-100 arasında bir sayı girin!');
        }

        // Bu kısım gerçek Discord API implementasyonunda olacak
        message.reply(`🗑️ ${count} mesaj silinecek... (Simülasyon)`);
    }
});

// Eğlence komutları
bot.commands.add({
    name: 'zar',
    description: 'Zar atar',
    execute: (message) => {
        const zar1 = Math.floor(Math.random() * 6) + 1;
        const zar2 = Math.floor(Math.random() * 6) + 1;
        
        message.reply(`🎲 **Zar Atıldı:** ${zar1} + ${zar2} = **${zar1 + zar2}**`);
    }
});

bot.commands.add({
    name: 'yazitura',
    description: 'Yazı tura atar',
    execute: (message) => {
        const sonuc = Math.random() < 0.5 ? 'Yazı 📀' : 'Tura 🪙';
        message.reply(`🪙 **Yazı Tura:** ${sonuc}`);
    }
});

bot.on('ready', () => {
    console.log('🚀 Gelişmiş bot çevrimiçi!');
    
    // Bot durumunu ayarla
    setInterval(() => {
        const aktiviteler = [
            `${bot.guilds?.size || 0} sunucu | !yardım`,
            `${bot.commands.all.length} komut | 7945.js`,
            'Discord bot geliştirme'
        ];
        
        const aktivite = bot.utils.randomChoice(aktiviteler);
        // Durum güncelleme Discord API'de implemente edilecek
    }, 30000);
});

bot.createWebPanel(3004);

bot.login();