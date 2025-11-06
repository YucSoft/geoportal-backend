import express from 'express';
import cors from 'cors';
import corsOptions from './src/config/cors.config.js';
import loggingMiddleware from './src/middlewares/logging.middleware.js';
import errorMiddleware from './src/middlewares/error.middleware.js';
import v1Routes from './src/api/v1/index.js';

// Initialize Express app
const app = express();

// Middleware setup
app.set('trust proxy', 1);
app.use(loggingMiddleware); 
app.use(cors(corsOptions)); 
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', v1Routes);
app.use(errorMiddleware);

export default app;