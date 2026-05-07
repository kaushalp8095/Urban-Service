import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import apiRoutes from './routes';

const app: Application = express();

// Security and utility middlewares
app.use(helmet());
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Always allow localhost in dev + any vercel.app preview URLs
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Exact matches from env
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);

    // Allow any *.vercel.app subdomain (covers preview deployments)
    if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return callback(null, true);

    // Allow localhost in any port (dev)
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);

    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight for all routes
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
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
