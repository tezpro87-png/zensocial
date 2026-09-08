const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let users = [
  { id: 1, email: "hasanfam319@gmail.com", username: "admin_hasan", role: "admin", isVerified: true, isBanned: false, ghostMode: false, followers: 12500, following: 120 },
  { id: 2, email: "user@gmail.com", username: "tez_user", role: "user", isVerified: false, isBanned: false, ghostMode: false, followers: 340, following: 210 }
];

let posts = [
  {
    id: 101,
    username: "admin_hasan",
    isVerified: true,
    userPic: "https://i.pravatar.cc/150?img=11",
    type: "image",
    mediaUrl: "https://picsum.photos/600/600",
    caption: "ZenSocial Pro System fully functional! 🔥 #admin",
    likes: 120,
    liked: false,
    comments: [{ user: "tez_user", text: "Verified badge looks clean!" }]
  }
];

// Admin Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === "hasanfam319@gmail.com" && password === "8619hasan") {
    const adminUser = users.find(u => u.email === email);
    return res.json({ success: true, user: adminUser, token: "admin-secret-token" });
  }
  res.status(401).json({ success: false, message: "Invalid Credentials" });
});

app.get('/api/users', (req, res) => res.json(users));
app.get('/api/posts', (req, res) => res.json(posts));

// Admin Controls API
app.post('/api/admin/action', (req, res) => {
  const { targetUsername, action, value } = req.body;
  const user = users.find(u => u.username === targetUsername);
  
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  if (action === 'verify') user.isVerified = value;
  if (action === 'ban') user.isBanned = value;
  if (action === 'role') user.role = value;

  res.json({ success: true, user });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
