import { z } from 'zod';

// --- Tickets ---

export const createTicketSchema = z.object({
  external_ticket_id: z.string().min(1, 'ID do ticket obrigatório'),
  client_name: z.string().min(2, 'Nome do cliente obrigatório'),
  client_email: z.string().email('Email inválido'),
  client_id: z.string().optional(),
  subject: z.string().min(3, 'Assunto deve ter no mínimo 3 caracteres'),
  body: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  category: z.enum(['support', 'commercial', 'financial', 'technical', 'other']).default('support'),
});

export const ticketReplySchema = z.object({
  external_ticket_id: z.string().min(1, 'ID do ticket obrigatório'),
  external_client_id: z.string().min(1, 'ID do cliente obrigatório'),
  external_client_name: z.string().min(2, 'Nome do cliente obrigatório'),
  body: z.string().min(1, 'Mensagem não pode ser vazia'),
});

export const ticketIdSchema = z.object({
  ticketId: z.string().min(1, 'ID do ticket obrigatório'),
});

// --- Clientes ---

export const syncClientSchema = z.object({
  viahub_client_id: z.string().min(1, 'ID do cliente ViaHub obrigatório'),
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  document: z.string().optional(),
  agency_name: z.string().optional(),
});

// --- Orçamentos ---

export const quoteNotificationSchema = z.object({
  viahub_quote_id: z.string().min(1, 'ID do orçamento obrigatório'),
  client_name: z.string().min(2, 'Nome do cliente obrigatório'),
  client_email: z.string().email('Email inválido'),
  destination: z.string().min(2, 'Destino obrigatório'),
  travel_date: z.string().min(1, 'Data da viagem obrigatória'),
  total_brl: z.number().positive('Valor deve ser positivo'),
  status: z.enum(['pending', 'approved', 'rejected']),
  items_count: z.number().int().positive(),
});

// --- Paginação ---

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
});
