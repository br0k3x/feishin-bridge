// main.js
// Feishin Bridge
const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');

const createDefaultState = () => ({
    title: "",
    artist: "",
    album: "",
    albumId: "",
    albumArt: "",
    duration: 0,
    position: 0,
    status: "stopped",
    volume: 0,
    id: "",
    repeat: "",
    shuffle: false,
    bitDepth: 0,
    bitRate: 0,
    channels: 0,
    createdAt: "",
    genres: [],
    serverId: "",
    serverType: "",
    trackNumber: 0,
    playCount: 0,
    releaseDate: "",
    releaseYear: 2025,
    size: "",
    userFavorite: false,
    userRating: 0,
    uniqueId: "",
    sampleRate: 0,
    lyrics: "",
    comment: "",
    compilation: "",
    container: "",
    discNumber: 0,
    discSubtitle: "",
    explicitStatus: false,
    imagePlaceholderUrl: "",
    mbzRecordingId: "",
    mbzTrackId: "",
    peak: "",
    updatedAt: "",
    participants: {},
    gain: {},
    path: "",
    itemType: "",
    lastPlayedAt: ""
});

let state = createDefaultState();

// HTTP Server init
const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(state));
        return;
    }

    if (req.method === "POST" && req.url === "/events/pause") {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: "pause" }));
        }
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/events/play") {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: "play" }));
        }
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/events/next") {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: "next" }));
        }
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/events/favorite") {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: "favorite", favorite: true, id: state.id }));
        }
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/events/unfavorite") {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: "favorite", favorite: false, id: state.id }));
        }
        res.writeHead(204);
        res.end();
        return;
    }

    res.writeHead(404);
    res.end();
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
                const s = packet.data || {};
                const song = s.song || {};
                state = {
                    ...createDefaultState(),
                    ...song,
                    title: song.title ?? song.name ?? "",
                    artist: song.artist ?? song.artistName ?? "",
                    album: song.album ?? song.albumName ?? "",
                    albumArt: song.albumArt ?? song.imageUrl ?? "",
                    duration: song.duration ?? 0,
                    position: song.position ?? song.position ?? 0,
                    status: s.status ?? song.status ?? "stopped",
                    volume: s.volume ?? song.volume ?? 0,
                    repeat: s.repeat ?? s.repeat ?? "none"
                };
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
