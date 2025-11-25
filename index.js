const Client = require('./lib/Client');
const { CommandManager, Command } = require('./lib/Command');
const DatabaseManager = require('./lib/Database');
const MusicSystem = require('./lib/Music');
const WebPanel = require('./lib/WebPanel');
const ComponentManager = require('./lib/Components');
const Utils = require('./lib/Utils');
const GameFunctions = require('./lib/game-functions')
const CustomEvents = require('./lib/custom-event')

// Tüm sınıfları export et
module.exports = {
    // Ana sınıf
    Client,
    
    // Alt sınıflar
    CommandManager,
    Command,
    DatabaseManager,
    MusicSystem,
    WebPanel,
    ComponentManager,
    Utils,
    CustomEvents,
    GameFunctions,
    
    // Veritabanı sağlayıcıları
    JSONProvider: require('./providers/JSONProvider'),
    MySQLProvider: require('./providers/MySQLProvider'),
    MongoDBProvider: require('./providers/MongoDBProvider'),
    SQLiteProvider: require('./providers/SQLiteProvider'),
    KeyValueProvider: require('./providers/KeyValueProvider'),
    
    // Kısayol fonksiyon
    createBot: (options) => new Client(options)
};