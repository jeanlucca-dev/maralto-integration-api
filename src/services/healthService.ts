import { viahubAdmin, maxisAdmin } from '../config/supabase';
import type { HealthCheckResponse } from '../types';

/**
 * Serviço de health check — verifica a conectividade
 * com ambos os bancos Supabase (ViaHub e MAXIS).
 */
export class HealthService {
  async check(): Promise<HealthCheckResponse> {
    const [viahubStatus, maxisStatus] = await Promise.all([
      this.checkSupabase(viahubAdmin, 'viahub'),
      this.checkSupabase(maxisAdmin, 'maxis'),
    ]);

    const allConnected = viahubStatus === 'connected' && maxisStatus === 'connected';

    return {
      status: allConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        viahub: viahubStatus,
        maxis: maxisStatus,
      },
    };
  }

  private async checkSupabase(
    client: typeof viahubAdmin,
    name: string
  ): Promise<'connected' | 'disconnected'> {
    try {
      // Tenta uma query leve para verificar conectividade
      const { error } = await client.from('_health_check').select('*').limit(1);

      // Se a tabela não existir, mas a conexão funcionou, está ok
      if (error && error.code === 'PGRST116') {
        return 'connected';
      }

      // Se não deu erro, está conectado
      if (!error) {
        return 'connected';
      }

      // Erros de autenticação/conexão indicam problema
      console.warn(`⚠️ Health check ${name}:`, error.message);
      return 'disconnected';
    } catch (err) {
      console.error(`❌ Health check ${name} falhou:`, err);
      return 'disconnected';
    }
  }
}

export const healthService = new HealthService();
