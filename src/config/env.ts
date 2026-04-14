import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3500'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // ViaHub
  VIAHUB_SUPABASE_URL: z.string().url(),
  VIAHUB_SUPABASE_SERVICE_KEY: z.string().min(1),
  VIAHUB_SUPABASE_ANON_KEY: z.string().min(1),

  // MAXIS
  MAXIS_SUPABASE_URL: z.string().url(),
  MAXIS_SUPABASE_SERVICE_KEY: z.string().min(1),
  MAXIS_SUPABASE_ANON_KEY: z.string().min(1),
  MAXIS_API_KEY: z.string().uuid(),

  // API
  API_SECRET: z.string().min(16),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Variáveis de ambiente inválidas:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
