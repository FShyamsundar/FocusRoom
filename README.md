# FocusRoom

FocusRoom is a production-style MERN app for silent real-time co-working. Users enter a shared virtual focus room, start a Pomodoro block, appear live to everyone else, complete tasks, build streaks, and review weekly analytics without turning the product into chat, video, or social noise.

## Product Philosophy

FocusRoom is intentionally not a chat app.

- No messaging
- No WebRTC
- No video calls
- No social feed mechanics

The product insight is simple: being seen working is enough.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Real-time: Socket.io
- Auth: JWT
- Charts: Recharts
- Notifications: Browser Notification API
- Email: Nodemailer

## Project Structure

```text
FocusRoom/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── PROJECT-PLAYBOOK.md
│   └── REALTIME.md
└── package.json
```

## Features

- Real-time focus presence using one global Socket.io channel
- Pomodoro sessions with `25 / 50 / 90` minute presets
- JWT auth across REST and websocket layers
- Daily streak tracking and total focus hours
- Weekly Recharts dashboard analytics
- Browser notifications when a timer finishes
- Public completion feed and completed-today history
- Weekly digest email infrastructure with Nodemailer

## Installation

Prerequisites:

- Node.js 20+
- MongoDB local instance or MongoDB Atlas

Install dependencies:

```bash
npm install
```

Copy env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Important environment variables:

### Backend

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/focusroom
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-user
SMTP_PASS=your-pass
SMTP_FROM=FocusRoom <noreply@focusroom.app>
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run locally:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Core User Flow

1. Register or login to receive a JWT.
2. Enter the Focus Room and choose a task plus a Pomodoro duration.
3. Start a session and immediately appear in the live presence sidebar for all connected users.
4. Finish the block and mark it done.
5. Backend writes a `CompletionLog`, updates streaks, recalculates totals, and broadcasts a fresh activity feed.
6. Dashboard surfaces weekly trends and productivity insights.

## Socket Event Flow

Client start event:

```js
socket.emit("focus:start", {
  taskName,
  duration,
  startedAt
});
```

Client end event:

```js
socket.emit("focus:end", {
  sessionId,
  completed: true
});
```

See full details in [docs/REALTIME.md](/d:/dev/FocusRoom/docs/REALTIME.md).

## API and Architecture Docs

- [API documentation](/d:/dev/FocusRoom/docs/API.md)
- [Real-time event flow](/d:/dev/FocusRoom/docs/REALTIME.md)
- [Architecture notes, schema explanations, auth flow, scalability](/d:/dev/FocusRoom/docs/ARCHITECTURE.md)
- [4-week roadmap, resume blurb, interview talking points, future features](/d:/dev/FocusRoom/docs/PROJECT-PLAYBOOK.md)

## Deployment

### Frontend -> Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set the project root to `frontend`.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add `VITE_API_URL` and `VITE_SOCKET_URL` environment variables.
7. Deploy.

### Backend -> Render

1. Create a new Web Service in Render.
2. Set the root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `backend/.env.example`.
6. Add your MongoDB Atlas connection string.
7. Set `CLIENT_URL` to the deployed Vercel frontend URL.
8. Deploy and verify `/api/health`.

## Production Notes

- The backend clears stale `active` sessions on boot to avoid ghost presence after restarts.
- Presence state is kept in memory for fast fan-out and persisted in MongoDB for session durability.
- The app is ready for a Redis-backed presence layer if multi-instance websocket scaling is needed.

## Standout Interview Angles

- Elegant real-time architecture without overbuilding collaboration features
- Clean separation between live room state and analytical history
- Silent accountability as a differentiated product thesis
- Practical production touches: weekly digest email, protected sockets, streak logic, responsive analytics
