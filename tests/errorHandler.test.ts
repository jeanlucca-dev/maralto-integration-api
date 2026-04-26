import { describe, it, expect } from 'vitest';
import { AppError } from '../src/middleware/errorHandler';

describe('AppError', () => {
  it('deve criar erro com statusCode e mensagem', () => {
    const error = new AppError(404, 'Nao encontrado');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Nao encontrado');
    expect(error.name).toBe('AppError');
  });

  it('deve criar erro com details opcionais', () => {
    const details = { field: 'email', reason: 'invalido' };
    const error = new AppError(400, 'Dados invalidos', details);
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual(details);
  });

  it('deve ser instancia de Error', () => {
    const error = new AppError(500, 'Erro interno');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });
});
