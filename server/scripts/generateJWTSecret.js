// Simple script to generate a secure JWT secret
// Run with: node scripts/generateJWTSecret.js

import crypto from 'crypto';

const generateSecret = () => {
  // Generate a random 64-character hex string
  return crypto.randomBytes(32).toString('hex');
};

const secret = generateSecret();
console.log('\n=== JWT Secret Key ===');
console.log(secret);
console.log('\nCopy this to your .env file as:');
console.log(`JWT_SECRET=${secret}\n`);

