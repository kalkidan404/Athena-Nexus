# Deployment Guide for Athena Nexus

This guide will help you deploy Athena Nexus to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- MongoDB Atlas account (or your own MongoDB instance)

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Athena Nexus"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for Vercel)
5. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/athena-nexus`)

## Step 3: Deploy Backend to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import your GitHub repository**
3. **Configure Project**:
   - Framework Preset: **Other**
   - Root Directory: Leave as is (or set to `server` if deploying separately)
   - Build Command: Leave empty (or `cd server && npm install`)
   - Output Directory: Leave empty

4. **Set Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate using `npm run generate-secret` in server directory
   - `NODE_ENV`: `production`
   - `PORT`: Leave default (Vercel sets this automatically)

5. **Deploy**

## Step 4: Deploy Frontend to Vercel

1. **Create a new Vercel project** (or use the same one with different settings)
2. **Configure Project**:
   - Framework Preset: **Create React App**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Set Environment Variables**:
   - `REACT_APP_API_URL`: Your backend API URL from Step 3
     - Example: `https://your-backend.vercel.app`

4. **Deploy**

## Alternative: Deploy Both Together

If you want to deploy both frontend and backend in one Vercel project:

1. Use the `vercel.json` configuration file (already included)
2. Set all environment variables in Vercel dashboard
3. Deploy from root directory

## Step 5: Create Admin User

After deployment, you need to create an admin user. You can:

1. **Use MongoDB Atlas UI**:
   - Go to your cluster
   - Browse Collections
   - Find the `users` collection
   - Insert a document with:
     ```json
     {
       "username": "admin",
       "password_hash": "<hashed-password>",
       "role": "admin",
       "displayName": "Administrator"
     }
     ```
   - Use bcrypt to hash your password (or use the createAdmin script locally)

2. **Or run the createAdmin script locally** (pointing to your production MongoDB):
   ```bash
   cd server
   MONGODB_URI=your-production-mongodb-uri node scripts/createAdmin.js
   ```

## Environment Variables Summary

### Backend (Server)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: `production`
- `PORT`: (Optional, Vercel sets automatically)

### Frontend (Client)
- `REACT_APP_API_URL`: Backend API URL
  - Example: `https://your-backend.vercel.app`
  - Leave empty if using proxy (development only)

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] Admin user is created
- [ ] Test login functionality
- [ ] Test API endpoints
- [ ] Update CORS settings if needed

## Troubleshooting

### CORS Issues
- Update `FRONTEND_URL` or `CLIENT_URL` in backend environment variables
- Or update CORS settings in `server/index.js`

### API Not Working
- Check `REACT_APP_API_URL` in frontend environment variables
- Verify backend is deployed and accessible
- Check Vercel function logs

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes Vercel IPs
- Check connection string format
- Verify database user credentials

## Support

For issues, check:
- Vercel deployment logs
- MongoDB Atlas connection logs
- Browser console for frontend errors
- Network tab for API errors

