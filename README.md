# ZenSocial — Full-stack starter

A real working social-app starter with a white Liquid Glass UI and a SQLite backend.

## Features
- Login/register; first registered account becomes `SUPER_ADMIN` server-side.
- No seeded users, posts, followers, messages or notifications.
- Feed, Explore/search, Reels, Create post/reel upload, Profile, Follow/unfollow.
- Likes, comments, save, share-copy, reports, notifications.
- Basic 1-to-1 messaging.
- Appearance: theme, font, emoji/location style settings, Liquid Glass.
- Zen/distraction-free toggles.
- Admin panel: stats, users, verify/unverify, ban/unban, reports, announcements, audit logs.
- SQLite database and local media uploads.

## Run on PC/Termux/Replit
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Set `JWT_SECRET` in production.
4. Run `npm start`.
5. Open `http://localhost:3000`.

For a public multi-device deployment, use a persistent disk/volume for `zensocial.db` and `uploads`, or move the DB/media to managed services.
