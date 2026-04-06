# Quick Deployment Checklist

## ✅ What's Already Done

- [x] Updated `backend/server.js` with CORS for production
- [x] Created `backend/render.yaml` for Render deployment
- [x] Created `frontend/vercel.json` for Vercel deployment
- [x] Updated `frontend/vite.config.js` to use `VITE_API_URL`
- [x] Created `.env.example` files as reference
- [x] Created `api-config.js` helper for API calls

---

## 📋 Deployment Steps

### Step 1: Backend Deployment (Render) - 5 minutes

- [ ] Go to https://render.com and sign up/login
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository (tan3005-prog/CookSmartt)
- [ ] Fill form:
  - **Name:** `cooksmart-backend`
  - **Branch:** `main`
  - **Runtime:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `node server.js`
  - **Instance Type:** Free or Starter
- [ ] Click "Advanced" and add Environment Variables:
  ```
  MONGO_URI = your_connection_string
  NODE_ENV = production
  ```
- [ ] Click "Create Web Service"
- [ ] Wait 2-3 minutes
- [ ] Copy the deployed URL (e.g., `https://cooksmart-backend.onrender.com`)
- [ ] Save this URL - you'll need it next

---

### Step 2: Frontend Deployment (Vercel) - 5 minutes

- [ ] Go to https://vercel.com and sign up/login with GitHub
- [ ] Click "New Project"
- [ ] Select your repository (tan3005-prog/CookSmartt)
- [ ] Configure:
  - **Framework:** Other
  - **Root Directory:** `frontend`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Install Command:** `npm install`
- [ ] Add Environment Variable:
  - **Name:** `VITE_API_URL`
  - **Value:** `https://your-backend.onrender.com` (from Step 1)
  - **Environments:** Production, Preview, Development
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] Copy the deployed URL (e.g., `https://cooksmart.vercel.app`)
- [ ] Save this URL

---

### Step 3: Update Backend CORS - 2 minutes

- [ ] Go to Render Dashboard
- [ ] Click on your `cooksmart-backend` service
- [ ] Click "Environment"
- [ ] Click "Edit" next to `FRONTEND_URL`
- [ ] Set value to: `https://your-app.vercel.app` (from Step 2)
- [ ] Click "Save"
- [ ] Wait for redeploy (1-2 minutes)

---

### Step 4: Test in Production - 5 minutes

- [ ] Visit `https://your-app.vercel.app` in browser
- [ ] Open DevTools (F12) → Network tab
- [ ] Try these actions:
  - [ ] Refresh page (should see requests to your backend URL)
  - [ ] Login (check API call to `/api/auth/login`)
  - [ ] Search recipes (check API call to `/api/recipes`)
  - [ ] Check response is from `your-backend.onrender.com`
- [ ] If all green ✅, you're done!

---

## 🆘 Common Issues

### "API is returning 404 or CORS error"
1. Check `VITE_API_URL` in Vercel Environment Variables
2. Check `FRONTEND_URL` in Render Environment Variables
3. Render may need 5 minutes to reload - try again

### "Cannot find module" on Render
1. Check all dependencies are in `backend/package.json`
2. Try rebuilding in Render dashboard

### "Build fails on Vercel"
1. Run `npm run build` locally in `frontend/` to verify
2. Check all files are committed to Git

### Vercel/Render free tier is slow
1. Render free tier sleeps after 15 min - use Starter plan for production
2. Vercel free is usually fast - check network tab in DevTools

---

## 📞 URLs After Deployment

Save these:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`

---

## 🚀 Next Steps

1. **Monitor:** Check Render/Vercel dashboards for errors
2. **Share:** Your app is now live at `https://your-app.vercel.app`
3. **Update:** Any changes pushed to GitHub will auto-deploy
