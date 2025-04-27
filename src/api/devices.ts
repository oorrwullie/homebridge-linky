import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Logging } from 'homebridge';
import { LinkyPlatformContext } from '../types';
import { listDevices, getDeviceState, setDeviceState } from '../utils/deviceManager';
import { errorResponse, DeviceError } from '../utils/error';
import os from 'os';

const LINKY_VERSION = '0.0.1';
const serverStartTime = Date.now();

export function setupDeviceRoutes(
  server: FastifyInstance,
  platform: LinkyPlatformContext,
  log: Logging
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.get('/', async (_request: FastifyRequest, _reply: FastifyReply) => {
    const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
    return {
      name: 'Linky',
      version: LINKY_VERSION,
      uptime: `${uptimeSeconds} seconds`,
      status: 'ok',
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.get('/healthz', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return {
      status: 'healthy',
      uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.get('/metrics', async (_request: FastifyRequest, reply: FastifyReply) => {
    const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
    const devices = listDevices();
    const totalDevices = devices.length;
    const reachableDevices = devices.filter((d) => d.reachable).length;
    const memoryUsage = process.memoryUsage();
    const loadAvg = os.loadavg();

    reply.type('text/plain').send(`
# HELP linky_uptime_seconds Linky server uptime
# TYPE linky_uptime_seconds gauge
linky_uptime_seconds ${uptimeSeconds}
# HELP linky_device_count Total devices
# TYPE linky_device_count gauge
linky_device_count ${totalDevices}
# HELP linky_device_reachable_count Reachable devices
# TYPE linky_device_reachable_count gauge
linky_device_reachable_count ${reachableDevices}
# HELP linky_memory_heap_total_bytes Heap total bytes
# TYPE linky_memory_heap_total_bytes gauge
linky_memory_heap_total_bytes ${memoryUsage.heapTotal}
# HELP linky_memory_heap_used_bytes Heap used bytes
# TYPE linky_memory_heap_used_bytes gauge
linky_memory_heap_used_bytes ${memoryUsage.heapUsed}
# HELP linky_cpu_load_average_1m CPU load avg 1m
# TYPE linky_cpu_load_average_1m gauge
linky_cpu_load_average_1m ${loadAvg[0]}
# HELP linky_cpu_load_average_5m CPU load avg 5m
# TYPE linky_cpu_load_average_5m gauge
linky_cpu_load_average_5m ${loadAvg[1]}
# HELP linky_cpu_load_average_15m CPU load avg 15m
# TYPE linky_cpu_load_average_15m gauge
linky_cpu_load_average_15m ${loadAvg[2]}
    `);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.get('/config', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return {
      name: 'Linky',
      version: LINKY_VERSION,
      port: platform.config?.port || 8081,
      apiEnabled: true,
      secure: true,
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.get('/rotate-key-secret', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return { secret: platform.getRotateKeySecret() };
  });

  server.post('/rotate-key', async (request: FastifyRequest, reply: FastifyReply) => {
    const adminHeader = request.headers['x-linky-admin'];
    if (adminHeader !== platform.getRotateKeySecret()) {
      return errorResponse(reply, 403, 'Forbidden - Invalid Admin Header', 'forbidden');
    }
    const newKey = await platform.rotateApiKey();
    return { success: true, newApiKey: newKey };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.get('/devices', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return listDevices();
  });

  server.get(
    '/device/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      const state = getDeviceState(id);
      if (!state) {
        return errorResponse(reply, 404, 'Device not found', 'not_found');
      }
      return { id, state };
    }
  );

  server.post(
    '/device/:id/on',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        await setDeviceState(id, 'On', true);
        return { id, action: 'on', success: true };
      } catch (error) {
        log.error('Failed to turn device on', error);
        return handleError(reply, error);
      }
    }
  );

  server.post(
    '/device/:id/off',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        await setDeviceState(id, 'On', false);
        return { id, action: 'off', success: true };
      } catch (error) {
        log.error('Failed to turn device off', error);
        return handleError(reply, error);
      }
    }
  );

  server.post(
    '/device/:id/set',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { characteristic: string; value: unknown };
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { characteristic, value } = request.body;
      if (!characteristic) {
        return errorResponse(reply, 400, 'Missing characteristic name', 'invalid_request');
      }
      try {
        await setDeviceState(id, characteristic, value);
        return { id, action: 'set', characteristic, value, success: true };
      } catch (error) {
        log.error('Failed to set characteristic', error);
        return handleError(reply, error);
      }
    }
  );
}

function handleError(reply: FastifyReply, error: unknown) {
  if (error instanceof DeviceError) {
    return errorResponse(reply, getHttpStatusForError(error.code), error.message, error.code);
  }
  return errorResponse(reply, 500, 'Internal Server Error', 'internal_error');
}

function getHttpStatusForError(code: string) {
  switch (code) {
    case 'not_found':
      return 404;
    case 'unreachable':
      return 503;
    case 'invalid_request':
      return 400;
    default:
      return 500;
  }
}
