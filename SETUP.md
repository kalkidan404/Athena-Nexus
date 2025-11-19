# Quick Setup Guide

## Step 1: Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Step 2: Configure Environment

1. Navigate to `server` folder
2. Create a `.env` file (copy from `.env.example` if it exists, or create new)

### Generate JWT Secret Key

**Option 1: Use the provided script (Recommended)**
```bash
cd server
npm run generate-secret
```
This will generate a secure random key. Copy it to your `.env` file.

**Option 2: Generate manually using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 3: Use an online generator**
- Visit: https://generate-secret.vercel.app/32 (or similar)
- Generate a 64-character hex string

3. Add the following to your `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sisterhood-challenges
JWT_SECRET=paste-your-generated-secret-here
JWT_EXPIRE=1h
NODE_ENV=development
```

**Important**: 
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- The JWT_SECRET should be a long, random string (64 characters recommended)
- Never commit your `.env` file to version control

## Step 3: Start MongoDB (Skip if using MongoDB Atlas)

**If using MongoDB Atlas (Cloud):**
- ✅ **Skip this step** - MongoDB Atlas runs in the cloud, no local installation needed
- Just make sure you have your Atlas connection string ready for Step 2

**If using Local MongoDB:**
Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start manually:
net start MongoDB
```

**Mac/Linux:**
```bash
mongod
```

## Step 4: Create Admin User

```bash
cd server
npm run create-admin
```

This will create an admin user with:
- Username: `admin`
- Password: `Admin123!`

**Change this password immediately after first login!**

## Step 5: Run the Application

From the root directory:

```bash
npm run dev
```

This will start both:
- Backend server on http://localhost:5000
- Frontend React app on http://localhost:3000

## Step 6: Access the Application

1. Open http://localhost:3000 in your browser
2. Click "Login" in the navigation bar
3. **To login as Admin:**
   - Username: `admin`
   - Password: `Admin123!` (or the password you set when creating admin)
   - After login, you'll see an "Admin" link in the navbar
4. Navigate to Admin Panel to create your first week and group
5. **For teams:** Click "Register Team" to create a new group account

## Troubleshooting

### MongoDB Connection Error
- **For Local MongoDB**: Make sure MongoDB is running on your system
- **For MongoDB Atlas**: 
  - Check your connection string in `.env` file
  - Ensure your IP address is whitelisted in Atlas Network Access
  - Verify your database user credentials are correct
- Check your `MONGODB_URI` format in `.env` file

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using the port

### Module Not Found Errors
- Make sure you've run `npm install` in all directories
- Delete `node_modules` and reinstall if needed

### Admin User Creation Fails
- Make sure MongoDB is connected
- Check that no admin user already exists
- Verify `.env` file has correct `MONGODB_URI`

## Next Steps

1. **Create your first week**: Go to Admin Panel → Weeks → Create New Week
2. **Create a group**: Go to Admin Panel → Users → Create New Group
3. **Test submission**: Login as the group user and submit a project
4. **Approve submission**: Go back to Admin Panel → Submissions → Approve

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use a production MongoDB instance (Atlas recommended)
4. Configure CORS properly for your domain
5. Set up HTTPS
6. Configure environment variables on your hosting platform

