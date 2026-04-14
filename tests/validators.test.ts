import { describe, it, expect } from 'vitest';
import { createTicketSchema, ticketReplySchema, syncClientSchema } from '../src/utils/validators';

describe('Validação — createTicketSchema', () => {
  it('deve aceitar payload válido completo', () => {
    const payload = {
      external_ticket_id: 'vh-ticket-001',
      client_name: 'Agência Exemplo',
      client_email: 'contato@agencia.com',
      client_id: 'vh-client-001',
      subject: 'Erro ao gerar orçamento',
      body: 'Ao tentar gerar um orçamento para CUN, o sistema retorna erro 500.',
      priority: 'high' as const,
      category: 'technical' as const,
    };

    const result = createTicketSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('deve aplicar defaults para priority e category', () => {
    const payload = {
      external_ticket_id: 'vh-ticket-002',
      client_name: 'Agência Teste',
      client_email: 'teste@agencia.com',
      subject: 'Dúvida sobre plano',
      body: 'Gostaria de saber a diferença entre os planos Pro e Elite.',
    };

    const result = createTicketSchema.parse(payload);
    expect(result.priority).toBe('medium');
    expect(result.category).toBe('support');
  });

  it('deve rejeitar email inválido', () => {
    const payload = {
      external_ticket_id: 'vh-ticket-003',
      client_name: 'Agência Erro',
      client_email: 'nao-eh-email',
      subject: 'Teste',
      body: 'Corpo da mensagem com pelo menos dez caracteres.',
    };

    const result = createTicketSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('deve rejeitar body muito curto', () => {
    const payload = {
      external_ticket_id: 'vh-ticket-004',
      client_name: 'Agência Curta',
      client_email: 'curta@agencia.com',
      subject: 'Teste',
      body: 'Curto',
    };

    const result = createTicketSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

describe('Validação — ticketReplySchema', () => {
  it('deve aceitar resposta válida', () => {
    const payload = {
      external_ticket_id: 'vh-ticket-001',
      external_client_id: 'vh-client-001',
      external_client_name: 'Agência Exemplo',
      body: 'Obrigado, o problema foi resolvido!',
    };

    const result = ticketReplySchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar body vazio', () => {
    const payload = {
      external_ticket_id: 'vh-ticket-001',
      external_client_id: 'vh-client-001',
      external_client_name: 'Agência Exemplo',
      body: '',
    };

    const result = ticketReplySchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

describe('Validação — syncClientSchema', () => {
  it('deve aceitar cliente válido', () => {
    const payload = {
      viahub_client_id: 'vh-client-001',
      name: 'Agência Sol Viagens',
      email: 'contato@solviagens.com.br',
      phone: '41999998888',
      document: '12.345.678/0001-90',
      agency_name: 'Sol Viagens',
    };

    const result = syncClientSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('deve aceitar sem campos opcionais', () => {
    const payload = {
      viahub_client_id: 'vh-client-002',
      name: 'Agência Lua',
      email: 'lua@viagens.com',
    };

    const result = syncClientSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});
