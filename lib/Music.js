class MusicSystem {
    constructor(client) {
        this.client = client;
        this.players = new Map();
    }
    
    async play(guildId, query) {
        let player = this.players.get(guildId);
        if (!player) {
            player = new MusicPlayer(guildId, this.client);
            this.players.set(guildId, player);
        }
        return await player.play(query);
    }
    
    stop(guildId) {
        this.players.get(guildId)?.stop();
    }
    
    skip(guildId) {
        this.players.get(guildId)?.skip();
    }
    
    pause(guildId) {
        this.players.get(guildId)?.pause();
    }
    
    resume(guildId) {
        this.players.get(guildId)?.resume();
    }
}

class MusicPlayer {
    constructor(guildId, client) {
        this.guildId = guildId;
        this.client = client;
        this.queue = [];
        this.isPlaying = false;
        this.currentTrack = null;
    }
    
    async play(query) {
        const track = await this._search(query);
        this.queue.push(track);
        
        if (!this.isPlaying) {
            this._playNext();
        }
        
        return track;
    }
    
    async _search(query) {
        // Basit search simülasyonu
        return {
            title: query,
            url: `https://youtube.com/watch?v=${Math.random().toString(36).substring(7)}`,
            duration: "3:45",
            thumbnail: "https://i.ytimg.com/vi/test/hqdefault.jpg"
        };
    }
    
    _playNext() {
        if (this.queue.length === 0) {
            this.isPlaying = false;
            this.currentTrack = null;
            return;
        }
        
        this.currentTrack = this.queue.shift();
        this.isPlaying = true;
        
        this.client.emit('trackStart', this.guildId, this.currentTrack);
        
        // Simüle edilmiş çalma
        setTimeout(() => {
            this._playNext();
        }, 10000);
    }
    
    stop() {
        this.queue = [];
        this.isPlaying = false;
        this.currentTrack = null;
    }
    
    skip() {
        this._playNext();
    }
    
    pause() {
        this.isPlaying = false;
    }
    
    resume() {
        this.isPlaying = true;
    }
}

module.exports = MusicSystem;