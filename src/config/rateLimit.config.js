import rateLimit from 'express-rate-limit';

// Límite de peticiones para la API
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Demasiadas peticiones. Inténtalo de nuevo más tarde.",
});

// Límite de peticiones para el login
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "Demasiados intentos de inicio de sesión.",
});