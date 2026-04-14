import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { authMiddleware, sourceIdentifier } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import ticketRoutes from './routes/tickets';
import clientRoutes from './routes/clients';

const app = express();

// --- Middlewares globais ---

app.use(helmet());
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'x-source-system'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Rotas públicas ---

app.use('/health', healthRoutes);

// --- Rotas protegidas ---

app.use('/api/v1/tickets', authMiddleware, sourceIdentifier, ticketRoutes);
app.use('/api/v1/clients', authMiddleware, sourceIdentifier, clientRoutes);

// --- Rota raiz ---

app.get('/', (_req, res) => {
  res.json({
    name: 'Maralto Integration API',
    description: 'API de integração entre ViaHub e MAXIS',
    version: '1.0.0',
    docs: '/health',
  });
});

// --- 404 ---

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    timestamp: new Date().toISOString(),
  });
});

// --- Error handler global ---

app.use(errorHandler);

export default app;
