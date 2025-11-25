// custom-events.js
class CustomEvents {
    constructor(bot) {
        this.bot = bot;
        this.customEvents = new Map();
        this.setupCustomEvents();
    }
    
    setupCustomEvents() {
        // Özel event'leri tanımla
        this.customEvents.set('userJoin', this.handleUserJoin.bind(this));
        this.customEvents.set('messageStats', this.handleMessageStats.bind(this));
        this.customEvents.set('levelUp', this.handleLevelUp.bind(this));
    }
    
    // Kullanıcı katılma event'i
    handleUserJoin(member) {
        const welcomeMessages = [
            `Hoş geldin ${member.user.username}! 🎉`,
            `Aramıza katıldığ için teşekkürler ${member.user.username}! 👋`,
            `Yeni bir kahraman geldi: ${member.user.username}! 🦸`
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        return randomMessage;
    }
    
    // Mesaj istatistikleri
    handleMessageStats(userId, messageCount) {
        const levels = [
            { min: 0, max: 10, title: 'Yeni Başlayan' },
            { min: 11, max: 50, title: 'Aktif Üye' },
            { min: 51, max: 100, title: 'Süper Yazar' },
            { min: 101, max: 500, title: 'Sohbet Ustası' },
            { min: 501, max: Infinity, title: 'Efsane' }
        ];
        
        const userLevel = levels.find(level => 
            messageCount >= level.min && messageCount <= level.max
        );
        
        return {
            level: userLevel?.title || 'Yeni Başlayan',
            progress: ((messageCount - userLevel.min) / (userLevel.max - userLevel.min)) * 100
        };
    }
    
    // Seviye atlama
    handleLevelUp(userId, oldLevel, newLevel) {
        const rewards = {
            5: '🎨 Özel renk rolü',
            10: '⭐ VIP rolü', 
            20: '🏆 Champion rolü',
            50: '👑 Legend rolü'
        };
        
        const reward = rewards[newLevel];
        return reward ? `Tebrikler! ${reward} kazandın!` : `Seviye atladın! Yeni seviye: ${newLevel}`;
    }
}

module.exports = CustomEvents;