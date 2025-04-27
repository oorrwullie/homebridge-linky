import { FastifyReply } from 'fastify';

export function errorResponse(
  reply: FastifyReply,
  statusCode: number,
  message: string,
  code: string
) {
  return reply.code(statusCode).send({
    error: {
      code,
      message,
    },
  });
}

export class DeviceError extends Error {
  public code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'DeviceError';
    this.code = code;
  }
}
