import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Middleware global de tratamento de erros.
 * Captura erros de validação (Zod), erros de aplicação e erros inesperados.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const timestamp = new Date().toISOString();

  // Erros de validação do Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      timestamp,
    });
    return;
  }

  // Erros controlados da aplicação
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
      timestamp,
    });
    return;
  }

  // Erros inesperados
  console.error('❌ Erro inesperado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    timestamp,
  });
}
