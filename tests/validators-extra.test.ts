import { describe, it, expect } from 'vitest';
import { quoteNotificationSchema, paginationSchema, ticketIdSchema } from '../src/utils/validators';

describe('Validacao - quoteNotificationSchema', () => {
  it('deve aceitar notificacao de orcamento valida', () => {
    const payload = {
      viahub_quote_id: 'vh-quote-001',
      client_name: 'Agencia Exemplo',
      client_email: 'contato@agencia.com',
      destination: 'Cancun',
      travel_date: '2026-07-15',
      total_brl: 4500.00,
      status: 'pending' as const,
      items_count: 3,
    };
    const result = quoteNotificationSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar valor negativo em total_brl', () => {
    const payload = {
      viahub_quote_id: 'vh-quote-002',
      client_name: 'Agencia Teste',
      client_email: 'teste@agencia.com',
      destination: 'Paris',
      travel_date: '2026-08-01',
      total_brl: -100,
      status: 'approved' as const,
      items_count: 1,
    };
    const result = quoteNotificationSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('deve rejeitar status invalido', () => {
    const payload = {
      viahub_quote_id: 'vh-quote-003',
      client_name: 'Agencia X',
      client_email: 'x@agencia.com',
      destination: 'Roma',
      travel_date: '2026-09-10',
      total_brl: 3000,
      status: 'cancelled',
      items_count: 2,
    };
    const result = quoteNotificationSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

describe('Validacao - paginationSchema', () => {
  it('deve aplicar defaults quando nenhum valor for passado', () => {
    const result = paginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.per_page).toBe(20);
  });

  it('deve converter strings para numeros', () => {
    const result = paginationSchema.parse({ page: '3', per_page: '50' });
    expect(result.page).toBe(3);
    expect(result.per_page).toBe(50);
  });

  it('deve rejeitar per_page acima de 100', () => {
    const result = paginationSchema.safeParse({ page: 1, per_page: 200 });
    expect(result.success).toBe(false);
  });

  it('deve rejeitar page negativa', () => {
    const result = paginationSchema.safeParse({ page: -1 });
    expect(result.success).toBe(false);
  });
});

describe('Validacao - ticketIdSchema', () => {
  it('deve aceitar ticketId valido', () => {
    const result = ticketIdSchema.safeParse({ ticketId: 'tk-001' });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar ticketId vazio', () => {
    const result = ticketIdSchema.safeParse({ ticketId: '' });
    expect(result.success).toBe(false);
  });
});
