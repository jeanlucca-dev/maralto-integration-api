import app from './app';
import { env } from './config/env';

const PORT = parseInt(env.PORT, 10);

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║       Maralto Integration API v1.0.0         ║');
  console.log('║       ViaHub ↔ MAXIS Bridge                  ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Ambiente: ${env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('');
});
