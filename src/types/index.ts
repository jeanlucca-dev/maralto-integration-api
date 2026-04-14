// =============================================
// Tipos compartilhados — Integração ViaHub ↔ MAXIS
// =============================================

// --- Tickets ---

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_client' | 'resolved' | 'closed';
export type TicketChannel = 'viahub' | 'email' | 'whatsapp' | 'phone' | 'internal';
export type TicketCategory = 'support' | 'commercial' | 'financial' | 'technical' | 'other';

export interface CreateTicketPayload {
  external_ticket_id: string;
  client_name: string;
  client_email: string;
  client_id?: string;
  subject: string;
  body: string;
  priority?: TicketPriority;
  category?: TicketCategory;
}

export interface TicketReplyPayload {
  external_ticket_id: string;
  external_client_id: string;
  external_client_name: string;
  body: string;
}

export interface TicketMessage {
  id: string;
  author_name: string;
  body: string;
  is_from_client: boolean;
  attachments: unknown[];
  created_at: string;
}

export interface TicketDetails {
  id: string;
  code: string;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  created_at: string;
}

// --- Clientes ---

export interface SyncClientPayload {
  viahub_client_id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  agency_name?: string;
}

export interface ClientMapping {
  viahub_id: string;
  maxis_id: string;
  synced_at: string;
}

// --- Orçamentos ---

export interface QuoteNotificationPayload {
  viahub_quote_id: string;
  client_name: string;
  client_email: string;
  destination: string;
  travel_date: string;
  total_brl: number;
  status: 'pending' | 'approved' | 'rejected';
  items_count: number;
}

// --- Health Check ---

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  version: string;
  services: {
    viahub: 'connected' | 'disconnected';
    maxis: 'connected' | 'disconnected';
  };
}

// --- Respostas da API ---

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
