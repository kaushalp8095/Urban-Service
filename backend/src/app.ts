import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import apiRoutes from './routes';

const app: Application = express();

// Trust Vercel's proxy headers for express-rate-limit
app.set('trust proxy', 1);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow no-origin requests (Postman, server-to-server, curl)
    if (!origin) return callback(null, true);
    // Exact match from env var
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // Any *.vercel.app preview deployment
    if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return callback(null, true);
    // localhost dev
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);

    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// 1. CORS FIRST — must be before helmet so headers are not stripped
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle all preflight OPTIONS requests

// 2. Helmet — disable crossOriginResourcePolicy which blocks cross-origin fetches
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
}));

app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Urban Service API is running normally' });
});

// Setup primary router
app.use('/api/v1', apiRoutes);
// Global error handler
app.use(errorHandler);

export default app;
