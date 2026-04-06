# CookSmart - Separate Frontend & Backend Setup

## Architecture

```
Frontend Dev Server (http://localhost:3001) 
    ↓ (proxy for /api)
Backend Server (http://localhost:3000)
    ↓
MongoDB Atlas
```

## Prerequisites

- Node.js (v14+)
- MongoDB Atlas connection string (in `.env`)

## Installation

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create or update `.env` file in `backend/` directory:
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd frontend
npm run dev
# Dev server runs on http://localhost:3001
# Open http://localhost:3001 in your browser
```

### What Happens

- Frontend dev server (Vite) runs on **port 3001** with hot-reload enabled
- Backend API server runs on **port 3000** (API only, no static files)
- Vite proxy automatically routes all `/api/*` requests to `http://localhost:3000`
- Your frontend code can use relative paths like `/api/recipes` - they automatically go to the backend

### Production Build

```bash
cd frontend
npm run build
# Creates optimized build in frontend/dist/

# Then serve the dist folder with your backend or a static server
```

## Key Changes Made

✅ **Backend (`server.js`):**
- Removed `app.use(express.static(...))` - no longer serves frontend files
- Removed root GET `/` route that served index.html
- Kept all API routes intact
- CORS is already configured for cross-origin requests

✅ **Frontend (`package.json`):**
- Added Vite as dev dependency
- Added `npm run dev` script (starts dev server on port 3001)
- Added `npm run build` script (creates production build)

✅ **Frontend (`vite.config.js`):**
- Configured Vite to serve on port 3001
- Set up proxy to forward `/api` requests to backend on port 3000
- Configured static asset serving from `public/` directory

✅ **Frontend (`index.html`):**
- Moved to frontend root so Vite can serve it
- All relative paths to styles, scripts, and images still work

## Troubleshooting

**Port 3001 already in use?**
```bash
# Vite will automatically try the next available port (3002, 3003, etc.)
# Or manually specify: npm run dev -- --port 3002
```

**API calls returning 404?**
1. Make sure backend is running on port 3000
2. Check that backend routes exist at `/api/recipes`, `/api/auth`, etc.
3. Check browser DevTools → Network tab to see the actual request URL

**Hot reload not working?**
- Make sure you're accessing via `http://localhost:3001` (not 3000)
- Restart the dev server: `npm run dev`

## API Endpoints

Available at `http://localhost:3000`:

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/recipes` - Get all recipes
- `GET /api/search?ingredients=...` - Search recipes
- `GET /health` - Health check

When running from frontend (port 3001), use relative paths like:
```javascript
fetch('/api/recipes')  // Automatically goes to http://localhost:3000/api/recipes
```
