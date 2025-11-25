class CommandManager {
    constructor(client) {
        this.client = client;
        this.commands = new Map();
        this.aliases = new Map();
    }
    
    add(command) {
        if (typeof command === 'function') {
            command = { execute: command };
        }
        
        this.commands.set(command.name, command);
        
        // Alias kayıt
        if (command.aliases) {
            command.aliases.forEach(alias => {
                this.aliases.set(alias, command.name);
            });
        }
        
        return this;
    }
    
    handleMessage(message) {
        if (!message.content.startsWith(this.client.prefix)) return;
        
        const args = message.content.slice(this.client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = this.commands.get(commandName) || 
                       this.commands.get(this.aliases.get(commandName));
        
        if (command) {
            try {
                command.execute(message, args);
            } catch (error) {
                this.client.emit('commandError', error, message);
                message.reply('❌ Komut çalıştırılırken hata oluştu!');
            }
        }
    }
    
    get all() {
        return Array.from(this.commands.values());
    }
}

class Command {
    constructor(options) {
        this.name = options.name;
        this.description = options.description || '';
        this.usage = options.usage || '';
        this.aliases = options.aliases || [];
        this.execute = options.execute;
    }
}

module.exports = CommandManager;
module.exports.Command = Command;