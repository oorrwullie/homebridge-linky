import { FastifyRequest, FastifyReply } from 'fastify';
import { Logging } from 'homebridge';

const requestCounts: Map<string, { count: number; timestamp: number }> = new Map();
const WINDOW_SIZE = 60_000; // 1 minute
const MAX_REQUESTS = 100;

export async function rateLimitMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  log: Logging
) {
  const ip = request.ip;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return;
  }

  const record = requestCounts.get(ip)!;
  if (now - record.timestamp > WINDOW_SIZE) {
    record.count = 1;
    record.timestamp = now;
  } else {
    record.count++;
  }

  if (record.count > MAX_REQUESTS) {
    log.warn(`Rate limit exceeded for IP: ${ip}`);
    reply.code(429).send({ error: 'Rate limit exceeded' });
    return;
  }
}
