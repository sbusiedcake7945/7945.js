const { createBot } = require('../index.js');

const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!'
});

// Özel web panel route'ları
const webPanel = bot.createWebPanel(3000);

// Özel web panel özellikleri ekle
webPanel.addRoute('/api/dashboard', (req, res) => {
    const dashboardData = {
        bot: {
            username: bot.user?.username || 'Bağlanıyor...',
            id: bot.user?.id || 'N/A',
            guilds: bot.guilds?.size || 0
        },
        system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            platform: process.platform,
            nodeVersion: process.version
        },
        commands: bot.commands.all.map(cmd => ({
            name: cmd.name,
            description: cmd.description,
            usage: cmd.usage
        }))
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dashboardData));
});

// Bot komutları
bot.commands.add({
    name: 'panel',
    description: 'Web panel linkini gönderir',
    execute: (message) => {
        message.reply(`🌐 **Web Panel:** http://localhost:3000\n📊 Bot istatistiklerini canlı takip edin!`);
    }
});

bot.commands.add({
    name: 'istatistik',
    description: 'Detaylı bot istatistikleri',
    execute: async (message) => {
        const stats = {
            komutlar: bot.commands.all.length,
            calismaSuresi: process.uptime(),
            bellek: process.memoryUsage().heapUsed / 1024 / 1024,
            platform: process.platform
        };

        const ilerlemeCubugu = bot.utils.createProgressBar(stats.bellek, 100, 10);

        message.reply(
            `📊 **Detaylı İstatistikler:**\n` +
            `🛠️ Komut Sayısı: ${stats.komutlar}\n` +
            `⏱️ Çalışma Süresi: ${Math.round(stats.calismaSuresi)}s\n` +
            `💾 Bellek Kullanımı: ${stats.bellek.toFixed(2)}MB\n` +
            `${ilerlemeCubugu}\n` +
            `🖥️ Platform: ${stats.platform}\n` +
            `🌐 Web Panel: http://localhost:3000`
        );
    }
});

bot.commands.add({
    name: 'sunucular',
    description: 'Botun olduğu sunucular',
    execute: (message) => {
        // Gerçek implementasyonda sunucu listesi
        message.reply(`🏠 **Sunucular:** ${bot.guilds?.size || 0} sunucuda hizmet veriliyor\n` +
                     `📈 Detaylar için web paneli ziyaret edin!`);
    }
});

// Utility komutları
bot.commands.add({
    name: 'format',
    description: 'Zaman formatlama örneği',
    execute: (message, args) => {
        if (!args.length) {
            const sure = 3665000; // 1 saat 1 dakika 5 saniye
            const formatli = bot.utils.formatTime(sure);
            return message.reply(`⏰ ${sure}ms = ${formatli}`);
        }

        const sure = parseInt(args[0]);
        if (isNaN(sure)) {
            return message.reply('❌ Geçerli bir sayı girin!');
        }

        const formatli = bot.utils.formatTime(sure);
        message.reply(`⏰ ${sure}ms = ${formatli}`);
    }
});

bot.commands.add({
    name: 'rastgele',
    description: 'Rastgele seçim yapar',
    execute: (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen seçenekleri girin!');
        }

        const secilen = bot.utils.randomChoice(args);
        message.reply(`🎲 **Rastgele Seçim:** ${secilen}`);
    }
});

bot.commands.add({
    name: 'karistir',
    description: 'Listeyi karıştırır',
    execute: (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen liste öğelerini girin!');
        }

        const karisik = bot.utils.shuffleArray(args);
        message.reply(`🔀 **Karıştırılmış Liste:** ${karisik.join(', ')}`);
    }
});

bot.on('ready', () => {
    console.log('🌐 Web panel botu çevrimiçi!');
    console.log('📊 Web panel: http://localhost:3000');
});

bot.login();