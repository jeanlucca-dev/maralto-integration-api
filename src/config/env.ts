import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3500'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // ViaHub
  VIAHUB_SUPABASE_URL: z.string().url().default('https://placeholder.supabase.co'),
  VIAHUB_SUPABASE_SERVICE_KEY: z.string().default('placeholder'),
  VIAHUB_SUPABASE_ANON_KEY: z.string().default('placeholder'),

  // MAXIS
  MAXIS_SUPABASE_URL: z.string().url().default('https://placeholder.supabase.co'),
  MAXIS_SUPABASE_SERVICE_KEY: z.string().default('placeholder'),
  MAXIS_SUPABASE_ANON_KEY: z.string().default('placeholder'),
  MAXIS_API_KEY: z.string().default('00000000-0000-0000-0000-000000000000'),

  // API
  API_SECRET: z.string().default('dev-secret-1234567890'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Variaveis de ambiente invalidas:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
