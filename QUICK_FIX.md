# Quick Fix for 500 Error

## The Problem
The server was starting before MongoDB connected, causing database queries to fail.

## The Solution
I've updated the server to wait for MongoDB connection before starting.

## What to Do Now

1. **Restart your backend server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   cd server
   npm run dev
   ```

2. **Check the console output:**
   You should see:
   ```
   Connecting to MongoDB...
   ✅ MongoDB Connected
   ✅ Server running on port 5000
   ```

3. **If you see MongoDB connection errors:**
   - Check your `server/.env` file has `MONGODB_URI` set correctly
   - For local MongoDB: Make sure MongoDB is running
   - For Atlas: Check your connection string and IP whitelist

4. **If you see JWT_SECRET warning:**
   ```bash
   cd server
   npm run generate-secret
   ```
   Then add the generated secret to `server/.env` as `JWT_SECRET=...`

5. **Test the health endpoint:**
   Open http://localhost:5000/api/health
   Should return: `{"status":"OK","message":"Server is running","database":"connected"}`

## Still Getting 500 Error?

Check the backend console (terminal) for the actual error message. The improved error handling will now show you exactly what's wrong.

