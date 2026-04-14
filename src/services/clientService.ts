import { maxisAdmin, viahubAdmin } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import type { SyncClientPayload, ClientMapping } from '../types';

/**
 * Serviço de sincronização de clientes entre ViaHub e MAXIS.
 *
 * Quando um cliente é cadastrado ou atualizado no ViaHub,
 * este serviço garante que ele exista também no MAXIS,
 * mantendo um mapeamento de IDs entre os dois sistemas.
 */
export class ClientService {
  /**
   * Sincroniza um cliente do ViaHub para o MAXIS.
   * - Se já existe (por email), atualiza os dados
   * - Se não existe, cria um novo registro
   * - Salva o mapeamento viahub_id ↔ maxis_id
   */
  async syncClient(payload: SyncClientPayload): Promise<ClientMapping> {
    // Verificar se já existe mapeamento
    const { data: existingMapping } = await maxisAdmin
      .from('client_mappings')
      .select('viahub_id, maxis_id, synced_at')
      .eq('viahub_id', payload.viahub_client_id)
      .single();

    if (existingMapping) {
      // Atualizar dados do cliente no MAXIS
      await maxisAdmin
        .from('clients')
        .update({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          document: payload.document,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingMapping.maxis_id);

      // Atualizar timestamp do mapeamento
      const now = new Date().toISOString();
      await maxisAdmin
        .from('client_mappings')
        .update({ synced_at: now })
        .eq('viahub_id', payload.viahub_client_id);

      return {
        viahub_id: existingMapping.viahub_id,
        maxis_id: existingMapping.maxis_id,
        synced_at: now,
      };
    }

    // Verificar se cliente já existe no MAXIS por email
    const { data: existingClient } = await maxisAdmin
      .from('clients')
      .select('id')
      .eq('email', payload.email)
      .single();

    let maxisClientId: string;

    if (existingClient) {
      maxisClientId = existingClient.id;

      // Atualizar dados
      await maxisAdmin
        .from('clients')
        .update({
          name: payload.name,
          phone: payload.phone,
          document: payload.document,
          updated_at: new Date().toISOString(),
        })
        .eq('id', maxisClientId);
    } else {
      // Criar novo cliente no MAXIS
      const { data: newClient, error } = await maxisAdmin
        .from('clients')
        .insert({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          document: payload.document,
          source: 'viahub',
          notes: payload.agency_name
            ? `Agência: ${payload.agency_name} (importado do ViaHub)`
            : 'Importado do ViaHub',
        })
        .select('id')
        .single();

      if (error || !newClient) {
        throw new AppError(500, 'Falha ao criar cliente no MAXIS');
      }

      maxisClientId = newClient.id;
    }

    // Criar mapeamento
    const now = new Date().toISOString();
    await maxisAdmin.from('client_mappings').insert({
      viahub_id: payload.viahub_client_id,
      maxis_id: maxisClientId,
      synced_at: now,
    });

    return {
      viahub_id: payload.viahub_client_id,
      maxis_id: maxisClientId,
      synced_at: now,
    };
  }

  /**
   * Busca o mapeamento de um cliente por ID do ViaHub.
   */
  async getMapping(viahubId: string): Promise<ClientMapping | null> {
    const { data } = await maxisAdmin
      .from('client_mappings')
      .select('viahub_id, maxis_id, synced_at')
      .eq('viahub_id', viahubId)
      .single();

    return data as ClientMapping | null;
  }

  /**
   * Lista todos os mapeamentos de clientes.
   */
  async listMappings(page: number = 1, perPage: number = 20): Promise<{
    mappings: ClientMapping[];
    total: number;
  }> {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count, error } = await maxisAdmin
      .from('client_mappings')
      .select('viahub_id, maxis_id, synced_at', { count: 'exact' })
      .order('synced_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new AppError(500, 'Falha ao listar mapeamentos');
    }

    return {
      mappings: (data || []) as ClientMapping[],
      total: count || 0,
    };
  }
}

export const clientService = new ClientService();
