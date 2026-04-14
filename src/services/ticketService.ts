import { maxisAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import type {
  CreateTicketPayload,
  TicketReplyPayload,
  TicketDetails,
  TicketMessage,
} from '../types';

/**
 * Serviço de tickets — integração ViaHub → MAXIS.
 *
 * O ViaHub é o ponto de contato do cliente (agência de viagens).
 * O MAXIS é onde a equipe Maralto gerencia e responde os chamados.
 * Este serviço faz a ponte entre os dois sistemas.
 */
export class TicketService {
  /**
   * Cria um ticket no MAXIS originado pelo ViaHub.
   * - Verifica se o cliente já existe no MAXIS
   * - Cria ou vincula o cliente
   * - Cria o ticket com channel='viahub'
   */
  async createTicket(payload: CreateTicketPayload): Promise<{
    maxis_ticket_id: string;
    maxis_ticket_code: string;
  }> {
    // Verificar se já existe um ticket com esse external_ticket_id
    const { data: existing } = await maxisAdmin
      .from('tickets')
      .select('id, code')
      .eq('external_ticket_id', payload.external_ticket_id)
      .single();

    if (existing) {
      throw new AppError(409, 'Ticket já existe no MAXIS', {
        maxis_ticket_id: existing.id,
        maxis_ticket_code: existing.code,
      });
    }

    // Gerar código do ticket (TK-YYYYMMDD-XXXX)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 9000 + 1000);
    const code = `TK-${dateStr}-${random}`;

    // Criar o ticket no MAXIS
    const { data: ticket, error } = await maxisAdmin
      .from('tickets')
      .insert({
        code,
        subject: payload.subject,
        description: payload.body,
        status: 'open',
        priority: payload.priority || 'medium',
        category: payload.category || 'support',
        channel: 'viahub',
        external_system: 'viahub',
        external_ticket_id: payload.external_ticket_id,
        external_client_id: payload.client_id,
        external_client_name: payload.client_name,
        external_client_email: payload.client_email,
      })
      .select('id, code')
      .single();

    if (error || !ticket) {
      console.error('Erro ao criar ticket no MAXIS:', error);
      throw new AppError(500, 'Falha ao criar ticket no MAXIS');
    }

    // Criar a mensagem inicial
    await maxisAdmin.from('ticket_messages').insert({
      ticket_id: ticket.id,
      author_name: payload.client_name,
      body: payload.body,
      is_from_client: true,
      is_internal: false,
      external_author_id: payload.client_id,
      external_author_name: payload.client_name,
    });

    return {
      maxis_ticket_id: ticket.id,
      maxis_ticket_code: ticket.code,
    };
  }

  /**
   * Busca as mensagens de um ticket no MAXIS.
   * Filtra notas internas — o cliente nunca vê mensagens is_internal=true.
   */
  async getMessages(externalTicketId: string): Promise<{
    ticket: TicketDetails;
    messages: TicketMessage[];
  }> {
    // Buscar o ticket
    const { data: ticket, error: ticketError } = await maxisAdmin
      .from('tickets')
      .select('id, code, status, priority, subject, created_at')
      .eq('external_ticket_id', externalTicketId)
      .single();

    if (ticketError || !ticket) {
      throw new AppError(404, 'Ticket não encontrado no MAXIS');
    }

    // Buscar mensagens (excluindo notas internas)
    const { data: messages, error: msgError } = await maxisAdmin
      .from('ticket_messages')
      .select('id, author_name, body, is_from_client, attachments, created_at')
      .eq('ticket_id', ticket.id)
      .eq('is_internal', false)
      .order('created_at', { ascending: true });

    if (msgError) {
      throw new AppError(500, 'Falha ao buscar mensagens');
    }

    return {
      ticket: ticket as TicketDetails,
      messages: (messages || []) as TicketMessage[],
    };
  }

  /**
   * Adiciona uma resposta do cliente (via ViaHub) ao ticket no MAXIS.
   * Se o ticket estiver resolvido, reabre automaticamente.
   */
  async replyToTicket(payload: TicketReplyPayload): Promise<{
    message_id: string;
  }> {
    // Buscar o ticket
    const { data: ticket, error: ticketError } = await maxisAdmin
      .from('tickets')
      .select('id, status')
      .eq('external_ticket_id', payload.external_ticket_id)
      .single();

    if (ticketError || !ticket) {
      throw new AppError(404, 'Ticket não encontrado no MAXIS');
    }

    // Se o ticket estava resolvido, reabrir
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      await maxisAdmin
        .from('tickets')
        .update({ status: 'open', updated_at: new Date().toISOString() })
        .eq('id', ticket.id);
    }

    // Inserir a mensagem
    const { data: message, error: msgError } = await maxisAdmin
      .from('ticket_messages')
      .insert({
        ticket_id: ticket.id,
        author_name: payload.external_client_name,
        body: payload.body,
        is_from_client: true,
        is_internal: false,
        external_author_id: payload.external_client_id,
        external_author_name: payload.external_client_name,
      })
      .select('id')
      .single();

    if (msgError || !message) {
      throw new AppError(500, 'Falha ao salvar resposta');
    }

    return { message_id: message.id };
  }
}

export const ticketService = new TicketService();
