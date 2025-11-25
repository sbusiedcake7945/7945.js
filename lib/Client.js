const WebSocket = require('ws');
const EventEmitter = require('events');
const CommandManager = require('./Command');
const DatabaseManager = require('./Database');
const MusicSystem = require('./Music');
const ComponentManager = require('./Components');

class Client extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.token = options.token;
        this.prefix = options.prefix || "!";
        this.intents = options.intents || 32509;
        
        // Alt sistemleri başlat
        this.commands = new CommandManager(this);
        this.database = new DatabaseManager(this);
        this.music = new MusicSystem(this);
        this.components = new ComponentManager(this);
        
        this.ws = null;
        this.sequence = null;
        this.sessionId = null;
        this.heartbeatInterval = null;
        this.isReady = false;
        
        this._init();
    }
    
    _init() {
        this._loadDefaultCommands();
        this._setupHeartbeat();
    }
    
    async login(token = this.token) {
        this.token = token;
        await this._connect();
    }
    
    async _connect() {
        try {
            const gateway = await this._getGateway();
            this._connectWebSocket(gateway.url);
        } catch (error) {
            this.emit('error', error);
        }
    }
    
    async _getGateway() {
        const response = await fetch('https://discord.com/api/v10/gateway', {
            headers: {
                'Authorization': `Bot ${this.token}`,
                'User-Agent': 'DiscordBot (7945.js, 1.0.0)'
            }
        });
        
        if (!response.ok) throw new Error('Gateway alınamadı');
        return response.json();
    }
    
    _connectWebSocket(gatewayUrl) {
        this.ws = new WebSocket(`${gatewayUrl}?v=10&encoding=json`);
        
        this.ws.on('open', () => {
            console.log('✓ Discord bağlantısı açıldı');
        });
        
        this.ws.on('message', (data) => {
            const payload = JSON.parse(data);
            this._handleGatewayPayload(payload);
        });
        
        this.ws.on('close', () => {
            console.log('Bağlantı kapandı, yeniden bağlanılıyor...');
            setTimeout(() => this._connect(), 5000);
        });
        
        this.ws.on('error', (error) => {
            this.emit('error', error);
        });
    }
    
    _handleGatewayPayload(payload) {
        const { op, d, s, t } = payload;
        this.sequence = s;
        
        switch (op) {
            case 10: // HELLO
                this._handleHello(d);
                break;
            case 11: // HEARTBEAT ACK
                break;
            case 0: // DISPATCH
                this._handleDispatch(t, d);
                break;
        }
    }
    
    _handleHello(data) {
        // Identify gönder
        this._sendIdentify();
        
        // Heartbeat başlat
        this.heartbeatInterval = setInterval(() => {
            this._sendHeartbeat();
        }, data.heartbeat_interval);
    }
    
    _sendIdentify() {
        const identify = {
            op: 2,
            d: {
                token: this.token,
                intents: this.intents,
                properties: {
                    $os: process.platform,
                    $browser: '7945.js',
                    $device: '7945.js'
                }
            }
        };
        
        this.ws.send(JSON.stringify(identify));
    }
    
    _sendHeartbeat() {
        const heartbeat = { op: 1, d: this.sequence };
        this.ws.send(JSON.stringify(heartbeat));
        
        // Uyku modu kontrolü
        this.emit('heartbeat', { timestamp: Date.now() });
    }
    
    _handleDispatch(event, data) {
        switch (event) {
            case 'READY':
                this.sessionId = data.session_id;
                this.user = data.user;
                this.isReady = true;
                this.emit('ready', this);
                break;
                
            case 'MESSAGE_CREATE':
                const message = this._createMessage(data);
                this.emit('message', message);
                this.commands.handleMessage(message);
                break;
                
            case 'INTERACTION_CREATE':
                this.components.handleInteraction(data);
                break;
        }
        
        this.emit(event, data);
    }
    
    _createMessage(data) {
        return {
            id: data.id,
            content: data.content,
            author: {
                id: data.author.id,
                username: data.author.username,
                bot: data.author.bot
            },
            channel: {
                id: data.channel_id,
                send: (content) => this.sendMessage(data.channel_id, content)
            },
            guild: data.guild_id ? { id: data.guild_id } : null,
            reply: (content) => this.sendMessage(data.channel_id, content)
        };
    }
    
    async sendMessage(channelId, content) {
        const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: typeof content === 'string' ? content : content.content,
                embeds: content.embeds
            })
        });
        
        return response.json();
    }
    
    _loadDefaultCommands() {
        this.commands.add({
            name: 'ping',
            description: 'Bot gecikmesini gösterir',
            execute: (message) => {
                message.reply('🏓 Pong!');
            }
        });
        
        this.commands.add({
            name: 'help',
            description: 'Yardım menüsünü gösterir',
            execute: (message) => {
                let helpText = '📋 **Komutlar:**\n';
                this.commands.all.forEach(cmd => {
                    helpText += `**${this.prefix}${cmd.name}** - ${cmd.description}\n`;
                });
                message.reply(helpText);
            }
        });
    }
    
    _setupHeartbeat() {
        // 5 saniyede bir heartbeat
        setInterval(() => {
            this.emit('heartbeat', {
                timestamp: Date.now(),
                status: this.isReady ? 'active' : 'sleeping'
            });
        }, 5000);
    }
    
    createWebPanel(port = 3000) {
        const WebPanel = require('./WebPanel');
        return new WebPanel(this, port);
    }
    
    destroy() {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        if (this.ws) this.ws.close();
    }
}

module.exports = Client;