

# Sunday Mail

> **Status:** 🚧 _This project is currently in testing, pending review by Google Cloud Authentication Services. To request access, please email [sundaydeveleopers@gmail.com](mailto:sundaydeveleopers@gmail.com)_

---

## Overview

**Sunday Mail** is a modern, full-stack automation platform for email processing, built to help users manage, categorize, and automate their inbox workflows with ease.
**Demo Link** https://www.loom.com/share/f35eb9def5b64e028a9e2d081e30e898?sid=18b2abf2-1285-4ce8-b2fb-07dbe3d9f55a

---

## Features

- **Google OAuth Login**: Secure authentication with Google accounts
- **Automated Email Processing**: Categorize, label, and automate actions on incoming emails
- **Custom Automations**: Create rules for labeling, replying, forwarding, and more
- **Memories Tab**: View a complete history of processed emails and automations
- **Quick Stats & Insights**: Dashboard with real-time stats and performance metrics
- **Modern UI**: Responsive, glassmorphism-inspired design for a premium experience
- **Profile & Settings**: Manage your account, integrations, and preferences

---

## Tech Stack

- **Frontend**: React 18, React Router, Framer Motion, CSS Modules
- **Backend**: Node.js, Express, Passport.js, Google APIs, MongoDB (Mongoose)
- **Authentication**: Google OAuth 2.0
- **Session Store**: MongoDB via connect-mongo
- **Deployment**: Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sunday-mail.git
cd sunday-mail
```

### 2. Setup Environment Variables
Create `.env` files in both `backend/` and `frontend/` as needed. Example for backend:
```env
GMAIL_CLIENT_ID=your-google-client-id
GMAIL_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-uri
SESSION_SECRET=your-random-session-secret
FRONTEND_URL=<YOUR_FRONTEND_URL>
BACKEND_URL=<YOUR_BACKEND_URL>
NODE_ENV=development
```

### 3. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run Locally
- **Backend:**
  ```bash
  cd backend
  node server.js
  ```
- **Frontend:**
  ```
  cd frontend
  npm start
  ```


---

## Project Structure

```
Sunday-Mail/
├── backend/         # Express API, Passport, MongoDB models
├── frontend/        # React app (src/, components/, pages/)
└── README.md
```

---

<p align="center"><b>Made by Haris Malik, inspired by https://www.friday.so</b></p>
