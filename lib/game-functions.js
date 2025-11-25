// game-functions.js
class GameFunctions {
    constructor(bot) {
        this.bot = bot;
        this.games = new Map();
        this.userStats = new Map();
    }
    
    // Sayı tahmin oyunu
    startGuessGame(userId, maxNumber = 100) {
        const targetNumber = Math.floor(Math.random() * maxNumber) + 1;
        const game = {
            type: 'guess',
            target: targetNumber,
            attempts: 0,
            maxAttempts: 10,
            startedAt: Date.now()
        };
        
        this.games.set(userId, game);
        return `🎯 1-${maxNumber} arasında bir sayı tuttum! Tahmin et bakalım!`;
    }
    
    processGuess(userId, guess) {
        const game = this.games.get(userId);
        if (!game || game.type !== 'guess') {
            return '❌ Aktif bir tahmin oyunun yok!';
        }
        
        game.attempts++;
        const guessNum = parseInt(guess);
        
        if (isNaN(guessNum)) {
            return '❌ Lütfen geçerli bir sayı gir!';
        }
        
        if (guessNum === game.target) {
            this.games.delete(userId);
            this.updateUserStats(userId, 'guess_wins', 1);
            return `🎉 Tebrikler! Doğru tahmin! ${game.attempts} denemede buldun!`;
        }
        
        if (game.attempts >= game.maxAttempts) {
            this.games.delete(userId);
            return `💥 Maalesef! Doğru cevap ${game.target} idi!`;
        }
        
        const hint = guessNum < game.target ? 'daha büyük' : 'daha küçük';
        return `📊 ${hint} bir sayı tahmin et! (${game.attempts}/${game.maxAttempts})`;
    }
    
    // Kelime oyunu
    startWordGame(userId) {
        const words = ['javascript', 'discord', 'bot', 'programming', 'computer'];
        const targetWord = words[Math.floor(Math.random() * words.length)];
        const scrambled = this.scrambleWord(targetWord);
        
        const game = {
            type: 'word',
            target: targetWord,
            scrambled: scrambled,
            attempts: 0,
            maxAttempts: 5
        };
        
        this.games.set(userId, game);
        return `🔤 Kelimeyi çöz: "${scrambled}"`;
    }
    
    scrambleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5).join('');
    }
    
    processWordGuess(userId, guess) {
        const game = this.games.get(userId);
        if (!game || game.type !== 'word') {
            return '❌ Aktif bir kelime oyunun yok!';
        }
        
        game.attempts++;
        
        if (guess.toLowerCase() === game.target) {
            this.games.delete(userId);
            this.updateUserStats(userId, 'word_wins', 1);
            return `🎉 Doğru! Kelime: ${game.target}`;
        }
        
        if (game.attempts >= game.maxAttempts) {
            this.games.delete(userId);
            return `💥 Maalesef! Doğru kelime: ${game.target}`;
        }
        
        return `❌ Yanlış! Tekrar dene. (${game.attempts}/${game.maxAttempts})`;
    }
    
    // Kullanıcı istatistikleri
    updateUserStats(userId, stat, value = 1) {
        if (!this.userStats.has(userId)) {
            this.userStats.set(userId, {
                guess_wins: 0,
                word_wins: 0,
                total_games: 0
            });
        }
        
        const stats = this.userStats.get(userId);
        stats[stat] = (stats[stat] || 0) + value;
        stats.total_games++;
    }
    
    getUserStats(userId) {
        return this.userStats.get(userId) || {
            guess_wins: 0,
            word_wins: 0,
            total_games: 0
        };
    }
}

module.exports = GameFunctions;