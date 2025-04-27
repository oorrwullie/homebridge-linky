import fastify, { FastifyInstance } from 'fastify';
import { Logging } from 'homebridge';
import { LinkyPlatformContext } from './types';
import { setupDeviceRoutes } from './api/devices';

export async function startServer(platform: LinkyPlatformContext, log: Logging, port: number) {
  const server: FastifyInstance = fastify({
    logger: false,
  });

  setupDeviceRoutes(server, platform, log);

  try {
    await server.listen({ port: port, host: '0.0.0.0' });
    log.info(`Linky API server started on port ${port}`);
  } catch (error) {
    log.error('Failed to start Linky server', error);
    process.exit(1);
  }
}
