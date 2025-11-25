const { createBot } = require('../index.js');

const bot = createBot({
    token: 'BOT_TOKENINIZ',
    prefix: '!'
});

// Buton component'leri
bot.components.button('merhaba_btn', (interaction) => {
    interaction.reply('👋 Butona tıklandı! Merhaba!');
});

bot.components.button('renk_sec', (interaction) => {
    const renkler = ['🔴 Kırmızı', '🟢 Yeşil', '🔵 Mavi', '🟡 Sarı'];
    const rastgeleRenk = renkler[Math.floor(Math.random() * renkler.length)];
    
    interaction.reply(`🎨 Seçilen renk: ${rastgeleRenk}`);
});

bot.components.button('zar_at', (interaction) => {
    const zar = Math.floor(Math.random() * 6) + 1;
    interaction.reply(`🎲 Zar atıldı: **${zar}**`);
});

// Select Menu component'leri
bot.components.selectMenu('oyun_sec', (interaction) => {
    const secilen = interaction.data.values[0];
    const oyunlar = {
        'minecraft': '🎮 Minecraft',
        'amongus': '👨‍🚀 Among Us', 
        'valorant': '🔫 Valorant',
        'lol': '⚔️ League of Legends'
    };
    
    interaction.reply(`✅ Seçilen oyun: ${oyunlar[secilen] || 'Bilinmeyen'}`);
});

// Komutlarla component entegrasyonu
bot.commands.add({
    name: 'butonlar',
    description: 'Butonları gösterir',
    execute: async (message) => {
        // Butonları olan mesaj gönder
        const butonlar = {
            content: '🔘 **Butonları Deneyin:**',
            components: [
                {
                    type: 1, // Action Row
                    components: [
                        {
                            type: 2, // Button
                            style: 1, // Primary
                            label: 'Merhaba',
                            custom_id: 'merhaba_btn'
                        },
                        {
                            type: 2,
                            style: 3, // Success
                            label: 'Renk Seç',
                            custom_id: 'renk_sec'
                        },
                        {
                            type: 2,
                            style: 4, // Danger
                            label: 'Zar At',
                            custom_id: 'zar_at'
                        }
                    ]
                }
            ]
        };

        await message.channel.send(butonlar);
    }
});

bot.commands.add({
    name: 'menu',
    description: 'Select menu gösterir',
    execute: async (message) => {
        const menu = {
            content: '🎮 **Oyun Seçin:**',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3, // Select Menu
                            custom_id: 'oyun_sec',
                            placeholder: 'Bir oyun seçin...',
                            options: [
                                {
                                    label: 'Minecraft',
                                    value: 'minecraft',
                                    description: 'Açık dünya sandbox oyunu',
                                    emoji: '🎮'
                                },
                                {
                                    label: 'Among Us',
                                    value: 'amongus',
                                    description: 'Sosyal dedüksiyon oyunu',
                                    emoji: '👨‍🚀'
                                },
                                {
                                    label: 'Valorant',
                                    value: 'valorant',
                                    description: 'Taktiksel FPS oyunu',
                                    emoji: '🔫'
                                },
                                {
                                    label: 'League of Legends',
                                    value: 'lol',
                                    description: 'MOBA oyunu',
                                    emoji: '⚔️'
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        await message.channel.send(menu);
    }
});

bot.commands.add({
    name: 'anket',
    description: 'Anket oluşturur',
    execute: async (message, args) => {
        if (!args.length) {
            return message.reply('❌ Lütfen anket sorusu girin!');
        }

        const soru = args.join(' ');
        
        const anket = {
            content: `📊 **Anket:** ${soru}`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 1,
                            label: '👍 Evet',
                            custom_id: 'evet_anket'
                        },
                        {
                            type: 2,
                            style: 1,
                            label: '👎 Hayır',
                            custom_id: 'hayir_anket'
                        },
                        {
                            type: 2,
                            style: 2,
                            label: '🤷 Belki',
                            custom_id: 'belki_anket'
                        }
                    ]
                }
            ]
        };

        await message.channel.send(anket);
    }
});

// Anket butonları
bot.components.button('evet_anket', (interaction) => {
    interaction.reply('✅ **Evet** oyu verdiniz!');
});

bot.components.button('hayir_anket', (interaction) => {
    interaction.reply('❌ **Hayır** oyu verdiniz!');
});

bot.components.button('belki_anket', (interaction) => {
    interaction.reply('🤷 **Belki** oyu verdiniz!');
});

bot.on('ready', () => {
    console.log('🔘 Component botu çevrimiçi!');
});

bot.createWebPanel(3003);

bot.login();