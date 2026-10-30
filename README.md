# SpeakZen — Social Language Exchange Platform

A full-stack real-time social platform for language learners built with MERN + Stream Chat & Video.

Connect with people worldwide, practice languages through chat and calls, and build your language learning network in a modern social-media experience.

---

## ✨ Features

### 🔐 Auth & Profiles
- Signup / Login with JWT sessions
- Upload profile picture (stored in database, no external API)
- Edit bio, native language, and learning language
- Settings page with UI theme selection (32 themes)

### 🤝 Social & Discovery
- Discover language partners matched by native/learning language
- Send, accept, and reject friend requests
- Real-time notification badge that persists across page refreshes
- Block / Unblock users — frozen conversation on both sides, restores on unblock

### 💬 Chat
- One-to-one real-time messaging (Stream Chat)
- Group chats up to 100 members with group icon and name
- Voice notes (in-chat audio recording)
- Photo, video, and file sharing
- Message reactions and replies
- Pin and mute conversations
- Search across chats
- Back button navigation in chat

### 📞 Calls
- One-to-one video calls (Stream Video)
- One-to-one voice calls
- In-call controls (mute, camera, end)

### 👥 Groups
- Create groups with a custom icon image
- Add/remove members (server-enforced 100-member cap)
- Edit group name and icon after creation
- Group info panel

### 🟢 Presence
- Real-time online/offline status
- Last seen indicator
- Status visible on friend cards, chat headers, and conversation list

### 🎨 Themes
- 32 daisyUI themes across the whole app
- Chat page background and message bubbles follow the active theme
- Theme persists across sessions

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 3, daisyUI 4, Zustand, TanStack Query 5 |
| Real-time Chat | Stream Chat (`stream-chat`, `stream-chat-react`) |
| Real-time Video/Voice | Stream Video (`@stream-io/video-react-sdk`) |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas + Mongoose 8 |
| Auth | JWT + HTTP-only cookies |
| Deployment | Vercel (backend as serverless, frontend as static) |

---

## ⚙️ Local Setup

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/speakzen.git
cd speakzen
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
JWT_SECRET_KEY=your-long-random-secret
STREAM_API_KEY=your-stream-api-key
STREAM_API_SECRET=your-stream-api-secret
CORS_ORIGIN=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_STREAM_API_KEY=your-stream-api-key
VITE_DEV_API_BASE_URL=http://localhost:8000/api
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## 🚀 Deployment (Vercel)

Both backend and frontend deploy as separate Vercel projects from the same repo.

**Backend** — Root Directory: `backend`
- Framework: Other
- Env vars: `MONGO_URI`, `JWT_SECRET_KEY`, `STREAM_API_KEY`, `STREAM_API_SECRET`, `CORS_ORIGIN` (set to frontend URL)

**Frontend** — Root Directory: `frontend`
- Framework: Vite
- Env vars: `VITE_STREAM_API_KEY`, `VITE_API_BASE_URL` (set to backend Vercel URL + `/api`)

MongoDB Atlas: add `0.0.0.0/0` to Network Access so Vercel's dynamic IPs can connect.

---

## 📂 Project Structure

```
speakzen/
├── backend/
│   ├── src/
│   │   ├── api/index.js        # Express app + Vercel entry
│   │   ├── controllers/        # auth, user, chat
│   │   ├── lib/                # db, stream, profile helpers
│   │   ├── middleware/         # protectRoute
│   │   ├── models/             # User, FriendRequest, GroupImage
│   │   └── routes/             # auth, user, chat
│   ├── vercel.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/         # Sidebar, Navbar, Avatar, CallButton, etc.
    │   ├── context/            # ChatProvider, ChatContext
    │   ├── hooks/              # useBlockStatus, useThemeStore, etc.
    │   ├── lib/                # axios, api helpers
    │   └── page/               # Home, ChatPage, Chats, Profile, Settings, etc.
    ├── public/                 # logo.svg, favicon.svg
    ├── vercel.json
    └── package.json
```

---

## 👨‍💻 Author

**Abdul Samad**  

MERN Stack · Real-Time Systems · Full-Stack Product Development

---

⭐ Star this repo if you found it useful!
