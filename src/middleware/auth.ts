import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * Middleware de autenticação via API key.
 *
 * Valida o header `x-api-key` contra o secret configurado.
 * Usado para proteger todos os endpoints da API de integração.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string | undefined;

  if (!apiKey) {
    res.status(401).json({
      success: false,
      error: 'Header x-api-key ausente',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (apiKey !== env.API_SECRET) {
    res.status(403).json({
      success: false,
      error: 'API key inválida',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
}

/**
 * Middleware para identificar o sistema de origem.
 * Extrai o header `x-source-system` e injeta no request.
 */
export function sourceIdentifier(req: Request, _res: Response, next: NextFunction): void {
  const source = req.headers['x-source-system'] as string | undefined;
  (req as any).sourceSystem = source || 'unknown';
  next();
}
