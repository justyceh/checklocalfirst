// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// General purpose — applies to most routes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' }
});

// Stricter — for auth routes specifically (login, signup)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // only 10 attempts per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many attempts, please try again later.' }
});