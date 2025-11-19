# Troubleshooting Guide

## Common Errors and Solutions

### 500 Internal Server Error on Login

**Possible Causes:**

1. **Backend server not running**
   - Solution: Make sure the backend server is running on port 5000
   - Check: Open http://localhost:5000/api/health in your browser
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **MongoDB not connected**
   - Solution: Check your MongoDB connection
   - For local MongoDB: Make sure MongoDB is running
   - For Atlas: Check your connection string and IP whitelist
   - Check server console for MongoDB connection errors

3. **Missing JWT_SECRET**
   - Solution: Make sure you have a `.env` file in the `server` folder
   - Run: `cd server && npm run generate-secret`
   - Add the generated secret to your `.env` file as `JWT_SECRET=...`

4. **Missing environment variables**
   - Solution: Create `server/.env` file with:
     ```
     PORT=5000
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-generated-secret
     JWT_EXPIRE=1h
     NODE_ENV=development
     ```

### How to Check What's Wrong

1. **Check backend server console**
   - Look for error messages in the terminal where you ran `npm run dev` or `cd server && npm run dev`
   - Common errors will be logged there

2. **Check browser console**
   - Open browser DevTools (F12)
   - Look at the Network tab to see the full error response
   - Check the Console tab for JavaScript errors

3. **Test backend directly**
   - Open http://localhost:5000/api/health
   - If this doesn't work, the backend isn't running

4. **Check MongoDB connection**
   - Look for "MongoDB Connected" message in server console
   - If you see "MongoDB connection error", fix your connection string

### Quick Fixes

**If backend isn't running:**
```bash
cd server
npm run dev
```

**If frontend can't connect to backend:**
- Make sure backend is running on port 5000
- Check that `client/package.json` has `"proxy": "http://localhost:5000"`

**If MongoDB connection fails:**
- Local: Start MongoDB service
- Atlas: Check connection string, IP whitelist, and database user credentials

**If JWT errors occur:**
- Make sure `JWT_SECRET` is set in `server/.env`
- Generate a new secret: `cd server && npm run generate-secret`

### Still Having Issues?

1. Check all dependencies are installed:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules server/node_modules client/node_modules
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. Check Node.js version (should be 18+):
   ```bash
   node --version
   ```

