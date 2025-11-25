const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

class WebPanel {
    constructor(client, port = 3000) {
        this.client = client;
        this.port = port;
        this.server = null;
        this._start();
    }
    
    _start() {
        this.server = http.createServer((req, res) => {
            this._handleRequest(req, res);
        });
        
        this.server.listen(this.port, () => {
            console.log(`✓ 7945.js Web Panel: http://localhost:${this.port}`);
        });
    }
    
    _handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        // API routes
        if (pathname === '/api/stats') {
            this._sendStats(res);
        } else if (pathname === '/api/commands') {
            this._sendCommands(res);
        } else {
            this._sendDashboard(res);
        }
    }
    
    _sendStats(res) {
        const stats = {
            guilds: 0, // Gerçek implementasyonda this.client.guilds.size
            commands: this.client.commands.all.length,
            uptime: process.uptime(),
            memory: process.memoryUsage()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
    }
    
    _sendCommands(res) {
        const commands = this.client.commands.all.map(cmd => ({
            name: cmd.name,
            description: cmd.description,
            usage: cmd.usage || `!${cmd.name}`
        }));
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(commands));
    }
    
    _sendDashboard(res) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>7945.js Bot Panel</title>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                .container { 
                    max-width: 1000px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 30px; 
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 20px;
                }
                .stats { 
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .stat-card { 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                }
                .stat-value {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .commands {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                }
                .command {
                    background: white;
                    margin: 10px 0;
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 7945.js Bot Panel</h1>
                    <p>Kolay Discord Bot Yönetimi</p>
                </div>
                
                <div class="stats" id="stats">
                    <!-- JavaScript ile doldurulacak -->
                </div>
                
                <div class="commands">
                    <h3>📋 Komutlar</h3>
                    <div id="commandsList">
                        <!-- JavaScript ile doldurulacak -->
                    </div>
                </div>
            </div>

            <script>
                async function loadData() {
                    try {
                        // İstatistikleri yükle
                        const statsResponse = await fetch('/api/stats');
                        const stats = await statsResponse.json();
                        
                        document.getElementById('stats').innerHTML = \`
                            <div class="stat-card">
                                <div>Sunucular</div>
                                <div class="stat-value">\${stats.guilds}</div>
                            </div>
                            <div class="stat-card">
                                <div>Komutlar</div>
                                <div class="stat-value">\${stats.commands}</div>
                            </div>
                            <div class="stat-card">
                                <div>Çalışma Süresi</div>
                                <div class="stat-value">\${Math.round(stats.uptime)}s</div>
                            </div>
                            <div class="stat-card">
                                <div>Bellek</div>
                                <div class="stat-value">\${Math.round(stats.memory.heapUsed / 1024 / 1024)}MB</div>
                            </div>
                        \`;
                        
                        // Komutları yükle
                        const commandsResponse = await fetch('/api/commands');
                        const commands = await commandsResponse.responseText ? await commandsResponse.json() : [];
                        
                        const commandsHTML = commands.map(cmd => \`
                            <div class="command">
                                <strong>\${cmd.name}</strong> - \${cmd.description}
                                <br><small>Kullanım: \${cmd.usage}</small>
                            </div>
                        \`).join('');
                        
                        document.getElementById('commandsList').innerHTML = commandsHTML;
                    } catch (error) {
                        console.error('Veri yüklenirken hata:', error);
                    }
                }
                
                // Sayfa yüklendiğinde ve her 5 saniyede bir verileri güncelle
                loadData();
                setInterval(loadData, 5000);
            </script>
        </body>
        </html>
        `;
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
    
    close() {
        if (this.server) {
            this.server.close();
        }
    }
}

module.exports = WebPanel;