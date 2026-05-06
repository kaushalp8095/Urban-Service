import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import apiRoutes from './routes';

const app: Application = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
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
