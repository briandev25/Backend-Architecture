import rateLimit from 'express-rate-limit';

export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, 
    message: 'Too many password reset requests,please try again later',
});

export const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: 'Too many password reset attempts,please try again later',
})