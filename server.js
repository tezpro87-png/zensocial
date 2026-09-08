const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let posts = [{ id: 1, username: "admin_hasan", isVerified: true, type: "image", mediaUrl: "https://picsum.photos/600/600", caption: "ZenSocial Engine Online! 🚀" }];
let reels = [{ id: 101, username: "admin_hasan", isVerified: true, videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4", caption: "First official Reel! 🎬", likes: 89 }];

app.get('/api/posts', (req, res) => res.json(posts));
app.get('/api/reels', (req, res) => res.json(reels));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
