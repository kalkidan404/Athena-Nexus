# Netlify Deployment Guide for Athena Nexus

## Current Issue: API 404 Errors

If you're seeing `404` errors for `/api/auth/signup` or other API endpoints, it means your frontend can't reach your backend server. **Netlify only hosts static files (your React app), not your Node.js backend.**

## Solution: Deploy Backend Separately

You need to deploy your backend server to a separate service. Here are recommended options:

### Option 1: Render (Recommended - Free Tier Available)

1. **Go to [Render](https://render.com)** and sign up
2. **Create a New Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `athena-nexus-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Set Environment Variables:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate using `cd server && npm run generate-secret`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Netlify frontend URL (e.g., `https://your-app.netlify.app`)
6. **Deploy**

### Option 2: Railway

1. Go to [Railway](https://railway.app)
2. Create new project from GitHub
3. Select your repository
4. Add new service → Select `server` directory
5. Set environment variables (same as above)
6. Deploy

### Option 3: Heroku

1. Install Heroku CLI
2. Create app: `heroku create athena-nexus-backend`
3. Set environment variables
4. Deploy: `git subtree push --prefix server heroku main`

## Step 2: Configure Netlify Frontend

After deploying your backend, you need to tell your frontend where to find it:

1. **Go to Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**
2. **Add Environment Variable:**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your backend URL (e.g., `https://athena-nexus-backend.onrender.com`)
3. **Redeploy** your site (Netlify will automatically rebuild with the new environment variable)

## Step 3: Update Backend CORS Settings

Make sure your backend allows requests from your Netlify frontend:

1. In your backend environment variables, set:
   - `FRONTEND_URL` or `CLIENT_URL`: `https://your-app.netlify.app`
2. Or update `server/index.js` CORS settings if needed

## Quick Fix Summary

1. ✅ Deploy backend to Render/Railway/Heroku
2. ✅ Get backend URL (e.g., `https://your-backend.onrender.com`)
3. ✅ Add `REACT_APP_API_URL` in Netlify environment variables
4. ✅ Set `FRONTEND_URL` in backend environment variables
5. ✅ Redeploy both frontend and backend

## Testing

After setup:
- Open your Netlify site
- Try to sign up or login
- Check browser console - API calls should go to your backend URL
- Check Network tab - requests should be successful (not 404)

## Environment Variables Checklist

### Netlify (Frontend)
- [ ] `REACT_APP_API_URL` = `https://your-backend-url.com`

### Backend (Render/Railway/Heroku)
- [ ] `MONGODB_URI` = Your MongoDB connection string
- [ ] `JWT_SECRET` = Generated secret key
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = `https://your-netlify-site.netlify.app`

## Troubleshooting

### Still Getting 404 Errors?
- Verify `REACT_APP_API_URL` is set in Netlify
- Check that the variable name is exactly `REACT_APP_API_URL` (case-sensitive)
- Redeploy after adding environment variables
- Check browser console to see what URL is being called

### CORS Errors?
- Make sure `FRONTEND_URL` is set in backend
- Check backend CORS configuration in `server/index.js`

### Backend Not Starting?
- Check backend deployment logs
- Verify all environment variables are set
- Check MongoDB connection string is correct

