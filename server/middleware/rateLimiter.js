import rateLimit from 'express-rate-limit';
import ActivityLog from '../models/ActivityLog.js';

// Login rate limiter - 3 attempts per 5 minutes
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 attempts
  message: 'Too many login attempts, please try again after 5 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP directly, don't rely on X-Forwarded-For for local development
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  // Skip X-Forwarded-For validation for local development
  validate: {
    xForwardedForHeader: false
  },
  handler: async (req, res) => {
    // Log failed attempt
    try {
      await ActivityLog.create({
        action: 'failed_login',
        detail: `Rate limit exceeded for IP: ${req.ip || 'unknown'}`
      });
    } catch (error) {
      console.error('Error logging rate limit:', error);
    }
    res.status(429).json({
      message: 'Too many login attempts, please try again after 5 minutes'
    });
  }
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  message: 'Too many requests from this IP, please try again later',
  // Use IP directly, don't rely on X-Forwarded-For for local development
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  // Skip X-Forwarded-For validation for local development
  validate: {
    xForwardedForHeader: false
  }
});

