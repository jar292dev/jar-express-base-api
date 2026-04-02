import { Server } from 'http';
import { env } from './config/env';
import { KyselyClient } from './db/kysely';

let server: Server;

async function bootstrap(): Promise<void> {
  try {
    // 1. Crear el pool — DEBE ir antes de cualquier import que use container
    KyselyClient.connect();

    // 2. Verificar que la BD responde
    await KyselyClient.ping();
    // eslint-disable-next-line no-console
    console.log('✅  Conexión a la base de datos establecida');

    // 3. Importar app de forma dinámica — así container.ts se resuelve
    //    después de que connect() ya ha inicializado la instancia
    const { default: app } = await import('./app');

    // 4. Iniciar el servidor
    server = app.listen(env.PORT, env.HOST, () => {
      // eslint-disable-next-line no-console
      console.log(
        `🚀 Servidor escuchando en http://${env.HOST}:${env.PORT} en modo ${env.NODE_ENV}`,
      );
    });
  } catch (error) {
    console.error('❌ Error arrancando el servidor:', error);
    process.exit(1);
  }
}

async function shutdown(signal: string): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} recibido — cerrando servidor...`);

  server.close(async () => {
    try {
      await KyselyClient.disconnect();
      // eslint-disable-next-line no-console
      console.log('✅ Cierre limpio completado');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error durante el cierre:', error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('⚠️  Cierre forzado por timeout');
    process.exit(1);
  }, 10_000);
}

// Manejar señales de cierre
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Manejar errores no capturados
process.on('uncaughtException', (error: Error) => {
  console.error('❌ uncaughtException:', error);
  process.exit(1);
});

// Manejar promesas rechazadas no capturadas
process.on('unhandledRejection', (reason: unknown) => {
  console.error('❌ unhandledRejection:', reason);
  process.exit(1);
});

// Arrancar el servidor
bootstrap();
