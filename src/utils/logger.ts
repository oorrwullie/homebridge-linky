import { Logging } from 'homebridge';

export function wrapLogger(log: Logging) {
  return {
    info: (msg: string, ...args: unknown[]) => log.info('[Linky]', msg, ...args),
    warn: (msg: string, ...args: unknown[]) => log.warn('[Linky]', msg, ...args),
    error: (msg: string, ...args: unknown[]) => log.error('[Linky]', msg, ...args),
    debug: (msg: string, ...args: unknown[]) => log.debug('[Linky]', msg, ...args),
  };
}
