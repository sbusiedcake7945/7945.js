const { createBot, Utils } = require('./index.js');

const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!'
});

// MySQL veritabanı kullan
bot.database.use('mysql', {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: '7945js'
});

// Kullanıcı profili sistemi
bot.commands.add({
    name: 'profil',
    description: 'Kullanıcı profilini yönetir',
    execute: async (message, args) => {
        const userId = message.author.id;
        const [action, ...values] = args;
        
        switch (action) {
            case 'oluştur':
                const profile = {
                    username: message.author.username,
                    created: new Date().toISOString(),
                    level: 1,
                    xp: 0
                };
                await bot.database.set(`profile_${userId}`, profile);
                message.reply('✅ Profil oluşturuldu!');
                break;
                
            case 'göster':
                const userProfile = await bot.database.get(`profile_${userId}`, null);
                if (!userProfile) {
                    return message.reply('❌ Profiliniz bulunamadı! `!profil oluştur`');
                }
                
                const embed = Utils.createEmbed(
                    `👤 ${userProfile.username} Profili`,
                    `**Seviye:** ${userProfile.level}\n` +
                    `**XP:** ${userProfile.xp}\n` +
                    `**Oluşturulma:** ${Utils.formatRelativeTime(new Date(userProfile.created))}`
                );
                
                message.channel.send({ embeds: [embed] });
                break;
                
            default:
                message.reply('📝 **Profil Sistemi:**\n• `!profil oluştur`\n• `!profil göster`');
        }
    }
});

// İstatistik komutu
bot.commands.add({
    name: 'istatistik',
    description: 'Bot istatistiklerini gösterir',
    execute: async (message) => {
        const stats = {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            commands: bot.commands.all.length,
            users: 'Veritabanından alınıyor...'
        };
        
        // Veritabanı istatistikleri
        const dbStats = await bot.database.get('bot_stats', {});
        
        message.reply(
            `📊 **İstatistikler:**\n` +
            `⏱️ Çalışma Süresi: ${Math.round(stats.uptime)}s\n` +
            `💾 Bellek: ${(stats.memory.heapUsed / 1024 / 1024).toFixed(2)}MB\n` +
            `🛠️ Komutlar: ${stats.commands}\n` +
            `🌐 Web Panel: http://localhost:3000`
        );
    }
});

// Gelişmiş web panel
const webPanel = bot.createWebPanel(3000);

webPanel.addCustomRoute('/api/profiles', async (req, res) => {
    // Burada veritabanından profil verilerini çek
    const profiles = {
        total: 100,
        active: 75,
        newToday: 5
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(profiles));
});

bot.login();