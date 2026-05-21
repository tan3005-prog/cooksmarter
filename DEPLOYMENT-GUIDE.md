# CookSmart - Deployment Guide (Vercel + Render)

## Architecture

```
User Browser
    ↓
Vercel Frontend (https://your-app.vercel.app)
    ↓ API calls
Render Backend (https://your-api.onrender.com)
    ↓
MongoDB Atlas
```

---

## Part 1: Backend Deployment (Render)

### Prerequisites
- MongoDB Atlas account & connection string
- Render.com account (free tier available)
- GitHub account (repo connected)

### Step 1: Prepare Backend

1. **Update `.env` file in `backend/` with:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cooksmart
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

2. **Verify `render.yaml` exists** at `backend/render.yaml` ✅ (already created)

3. **Test locally:**
```bash
cd backend
npm start
# Should connect to MongoDB successfully
```

### Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)** → Sign up/login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Fill in the form:**
   - **Name:** `cooksmart-backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free or Starter ($7/month)

5. **Add Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Add these variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `FRONTEND_URL`: Your Vercel frontend URL (add later after frontend deployment)
     - `NODE_ENV`: `production`

6. **Deploy:**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy the URL (e.g., `https://cooksmart-backend.onrender.com`)

⚠️ **Important:** Render free tier may sleep after 15 min of inactivity. Use Starter plan for production.

---

## Part 2: Frontend Deployment (Vercel)

### Prerequisites
- Vercel.com account (free)
- GitHub repo connected
- Backend deployed on Render (get the URL)

### Step 1: Prepare Frontend

1. **Create `.env.production` in `frontend/`:**
```
VITE_API_URL=https://your-backend.onrender.com
```

2. **Verify `vercel.json` exists** at `frontend/vercel.json` ✅ (already created)

3. **Test build locally:**
```bash
cd frontend
npm run build
# Should create dist/ folder
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** → Sign up/login with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://your-backend.onrender.com`
     - **Environments:** Production, Preview, Development

6. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Copy the URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update Backend CORS

1. **Go to Render Dashboard** → Your backend service → "Environment"
2. **Edit `FRONTEND_URL`:** Set to your Vercel URL (e.g., `https://your-app.vercel.app`)
3. **Save and redeploy**

---

## How API Calls Work

### In Frontend Code

```javascript
// Your existing code works with relative paths:
fetch('/api/recipes')

// During development: http://localhost:3001 → http://localhost:3000 (Vite proxy)
// In production: https://your-app.vercel.app → https://your-api.onrender.com (Vercel + env var)
```

When the frontend is deployed, Vercel automatically replaces `/api` requests with the `VITE_API_URL` environment variable.

---

## Testing

### Before Deploying

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```
Visit `http://localhost:3001` and test features.

### After Deploying

1. Visit `https://your-app.vercel.app`
2. Open DevTools → Network tab
3. Test login/recipes/search
4. Verify API calls go to `https://your-backend.onrender.com/api/...`

---

## Troubleshooting

### "CORS error" on production
- Check `FRONTEND_URL` is set correctly in Render
- Check it includes `https://` 
- Render might need 5 min to reload configs

### "Cannot find module" errors on Render
- Make sure `package.json` has all dependencies
- Run `npm install` locally to verify

### "API returns 404" on Vercel
- Verify `VITE_API_URL` is set in Vercel environment
- Use browser DevTools → Network to see actual request URL
- Make sure Render backend is deployed and running

### Vercel build fails
- Check `npm run build` works locally
- Verify all assets are in `public/` or `src/`
- Check `.vercelignore` doesn't exclude needed files

### Render deployment gets stuck
- Check build logs in Render dashboard
- Verify `render.yaml` is correct
- Try redeploying

---

## Common Info

**Backend URL (Example):** `https://cooksmart-backend.onrender.com`  
**Frontend URL (Example):** `https://cooksmart.vercel.app`  

**API Base Path:** Always `/api` (mapped via environment variables)

**Free Tier Limitations:**
- Vercel: Limited deployments per month
- Render: Services sleep after 15 min inactivity
- MongoDB Atlas: Limited free tier

---

## Next Steps

1. Deploy backend to Render → Get backend URL
2. Set `VITE_API_URL` in frontend `.env.production`
3. Deploy frontend to Vercel
4. Update Render `FRONTEND_URL` with Vercel URL
5. Test in production
