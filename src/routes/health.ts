import { Router, Request, Response } from 'express';
import { healthService } from '../services/healthService';

const router = Router();

/**
 * GET /health
 * Retorna o status da API e conectividade com ViaHub e MAXIS.
 * Este endpoint NÃO exige autenticação.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const health = await healthService.check();
    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (err) {
    res.status(503).json({
      status: 'down',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        viahub: 'disconnected',
        maxis: 'disconnected',
      },
    });
  }
});

export default router;
