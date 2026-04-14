import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// Cliente Supabase do ViaHub (service role — acesso total)
export const viahubAdmin: SupabaseClient = createClient(
  env.VIAHUB_SUPABASE_URL,
  env.VIAHUB_SUPABASE_SERVICE_KEY
);

// Cliente Supabase do MAXIS (service role — acesso total)
export const maxisAdmin: SupabaseClient = createClient(
  env.MAXIS_SUPABASE_URL,
  env.MAXIS_SUPABASE_SERVICE_KEY
);

// Cliente público do MAXIS (para operações com RLS)
export const maxisPublic: SupabaseClient = createClient(
  env.MAXIS_SUPABASE_URL,
  env.MAXIS_SUPABASE_ANON_KEY
);
