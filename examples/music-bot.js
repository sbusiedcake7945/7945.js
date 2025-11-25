const { createBot } = require('../index.js');

const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!',
    intents: 32509
});

// Müzik event'leri
bot.on('trackStart', (guildId, track) => {
    console.log(`🎵 [${guildId}] Çalıyor: ${track.title}`);
});

bot.on('trackEnd', (guildId, track) => {
    console.log(`⏹️ [${guildId}] Bitti: ${track.title}`);
});

// Müzik komutları
bot.commands.add({
    name: 'çal',
    description: 'Müzik çalar',
    usage: '!çal <şarkı adı/url>',
    execute: async (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen bir şarkı adı veya URL girin!');
        }

        const query = args.join(' ');
        message.reply('🔍 Şarkı aranıyor...').then(async (msg) => {
            try {
                const track = await bot.music.play(message.guild.id, query);
                
                msg.edit(`🎵 **Çalıyor:** ${track.title}\n⏱️ ${track.duration}\n🖼️ ${track.thumbnail}`);
            } catch (error) {
                msg.edit('❌ Şarkı çalınırken hata oluştu!');
                console.error('Müzik hatası:', error);
            }
        });
    }
});

bot.commands.add({
    name: 'dur',
    description: 'Müziği durdurur',
    execute: (message) => {
        bot.music.stop(message.guild.id);
        message.reply('⏹️ Müzik durduruldu!');
    }
});

bot.commands.add({
    name: 'geç',
    description: 'Sıradaki şarkıya geçer',
    execute: (message) => {
        bot.music.skip(message.guild.id);
        message.reply('⏭️ Şarkı geçildi!');
    }
});

bot.commands.add({
    name: 'duraklat',
    description: 'Müziği duraklatır',
    execute: (message) => {
        bot.music.pause(message.guild.id);
        message.reply('⏸️ Müzik duraklatıldı!');
    }
});

bot.commands.add({
    name: 'devam',
    description: 'Duraklatılan müziği devam ettirir',
    execute: (message) => {
        bot.music.resume(message.guild.id);
        message.reply('▶️ Müzik devam ediyor!');
    }
});

bot.commands.add({
    name: 'ara',
    description: 'Şarkı arama sonuçlarını gösterir',
    execute: async (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen aramak için bir şarkı adı girin!');
        }

        const query = args.join(' ');
        const results = await bot.music.search(query, 'youtube', 5);
        
        let resultText = '🔍 **Arama Sonuçları:**\n';
        results.forEach((result, index) => {
            resultText += `${index + 1}. **${result.title}** (${result.duration})\n`;
        });
        resultText += '\n🎵 Şarkıyı çalmak için: `!çal <numara>`';

        message.reply(resultText);
    }
});

bot.on('ready', () => {
    console.log('🎵 Müzik botu çevrimiçi!');
});

bot.createWebPanel(3001);

bot.login();