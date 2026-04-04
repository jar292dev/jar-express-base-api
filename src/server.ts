import { Server } from 'http';
import { env } from './config/env';
import { prisma } from './database/prisma.client';

let server: Server;

async function bootstrap(): Promise<void> {
  try {
    // 1. Conectar Prisma
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log('✅  Conexión a la base de datos establecida');

    // 2. Importar app de forma dinámica
    const { default: app } = await import('./app');

    // 3. Iniciar el servidor
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
      await prisma.$disconnect();
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
