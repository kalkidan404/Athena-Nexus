# Environment Setup

## Quick Setup

1. Create a file named `.env` in the `server` folder
2. Add the following content (replace with your values):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sisterhood-challenges
JWT_SECRET=0b99c73202ac04e225a75c1c8a28a4f2b153dca4a640719c8e7204f2903536f2
JWT_EXPIRE=1h
NODE_ENV=development
```

## For MongoDB Atlas

If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## Generate New JWT Secret

If you need a new JWT secret:
```bash
cd server
npm run generate-secret
```

