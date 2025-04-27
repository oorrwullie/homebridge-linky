import crypto from 'crypto';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Logging } from 'homebridge';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  configuredKey: string,
  log: Logging
) {
  const apiKey = request.headers['x-linky-key'];

  if (apiKey !== configuredKey) {
    log.warn('Unauthorized access attempt.');
    reply.code(401).send({ error: 'Unauthorized' });
    return reply.sent;
  }

  return;
}

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex'); // 64-character secure API key
}
