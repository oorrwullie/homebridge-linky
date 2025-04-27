import { FastifyRequest, FastifyReply } from 'fastify';
import { Logging } from 'homebridge';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  configuredKey: string,
  log: Logging
) {
  const providedKey = request.headers['x-api-key'];
  if (!providedKey || providedKey !== configuredKey) {
    log.warn('Unauthorized API access attempt');
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }
}
