// bridge.js
const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');

let state = {
    title: "",
    artist: "",
    album: "",
    albumArt: "",
    duration: 0,
    position: 0,
    status: "stopped",
    volume: 0
};

// HTTP Server for Rainmeter
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify(state));
});

server.listen(3000, () => console.log('✔ Feishin Bridge server running on http://localhost:3000'));

// Connect to Feishin WebSocket
let ws;

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:4333');
    
    ws.on('open', () => console.log('✔ Connected to Feishin WebSocket'));
    ws.on('error', err => console.error('❌ WebSocket Error:', err));
    ws.on('close', () => {
        console.log('❌ WebSocket Closed');
        setTimeout(() => connectWebSocket());
    });

    ws.on('message', (msg) => {
        try {
            const packet = JSON.parse(msg);
            if (packet.event === 'state') {
                const s = packet.data;
                const song = s.song || {};
                state.title = song.name || "";
                state.artist = song.artistName || "";
                state.album = song.album || "";
                state.albumArt = song.imageUrl || "";
                state.duration = song.duration || 0;
                state.position = s.position || 0;
                state.status = s.status || "stopped";
                state.volume = s.volume || 0;
            } else if (packet.event === 'position') {
                state.position = packet.data;
                if (state.position === 0) {
                    console.log('🔄️ Closing websocket to update the currently playing song');
                    ws.close(1000, 'Reconnecting for song update');
                }
            }
        } catch (e) {
            console.error("JSON parse error:", e);
        }
    });
}

connectWebSocket();
