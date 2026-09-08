const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let posts = [
  {
    id: 1,
    username: "tez_hasan",
    userPic: "https://i.pravatar.cc/150?img=12",
    postImg: "https://picsum.photos/600/600",
    caption: "Welcome to ZenSocial! 🚀 #instagram #clone",
    likes: 12
  }
];

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
