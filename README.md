# MailSense - AI-Powered Personal Inbox Intelligence

MailSense is an intelligent layer on top of your email inbox. It transforms an overwhelming list of emails into an actionable, prioritized dashboard. Instead of being a generic email client, MailSense focuses on finding what's important—deadlines, actions, required responses, and critical updates—using an abstracted AI pipeline.

## Features

- **Daily Briefing Dashboard:** A high-level overview of urgent items, upcoming deadlines, and required responses.
- **AI Email Intelligence:** Automatically categorizes emails, determines priority, generates 1-3 sentence summaries, and extracts hidden deadlines/actions.
- **Action Extraction to Tasks:** Convert an email's required action into a tracked Task with a single click.
- **Follow-ups Tracking:** Never drop the ball on emails that require your reply.
- **Natural Language Search:** "Ask MailSense" to find emails using everyday language (e.g., "Show me important emails from recruiters").
- **Visual Analytics:** View charts of your inbox behavior, priority breakdowns, and category distributions.
- **Demo Mode:** Runs flawlessly without needing actual Google OAuth or AI API keys by using a deterministic heuristic engine and an in-memory database.

## Architecture

MailSense uses a clean decoupled Full-Stack architecture:
- **Frontend:** React, Vite, Tailwind CSS, React Router, Recharts, Lucide Icons.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose ODM).
- **Authentication:** JWT for local sessions + Google OAuth 2.0 for Gmail API integration.
- **Security:** Helmet, CORS, bcrypt, and JWT bearer authentication. Secure deployments should move the token from local storage to HttpOnly cookies.

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Optional for Demo Mode, required for Production)
- Google Cloud Console Project (For Gmail API OAuth)

### 2. Environment Variables
Create a `.env` file in the `backend` directory based on the `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mailsense
JWT_SECRET=super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
AI_API_KEY=your_ai_api_key
```
*Note: If `MONGODB_URI` points to `127.0.0.1` and fails, or is set to `memory`, the app will automatically boot an in-memory database and seed it for Demo Mode.*

### 3. Installation
**Backend:**
```bash
cd backend
npm install
npm run seed # optional: manually seed a local MongoDB database
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Demo Mode
If you start the backend without a running local MongoDB, MailSense will automatically detect this, spawn an in-memory database (`mongodb-memory-server`), and seed it with realistic mock data (Career, Finance, Education emails). When local MongoDB is running, an empty development database is seeded automatically as well. You can also run `npm run seed` manually. Log in with the pre-filled credentials on the login screen.

## Disclaimer
MailSense is a productivity tool intended for personal organization. The AI summaries and prioritizations are best-effort heuristic estimations and should not be relied upon for critical medical, legal, or financial decisions without verification.
