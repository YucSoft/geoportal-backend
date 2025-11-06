// src/config/cors.config.js
const allowedOrigins = [
    'https://sigyucatan.com',
    'http://localhost:5173'
];

// Configuración de CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    optionsSuccessStatus: 200
};

export default corsOptions;