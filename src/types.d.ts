import type { PlatformAccessory } from 'homebridge';

export interface LinkyPlatformContext {
  config: {
    port?: number;
  };
  accessories: PlatformAccessory[];
  getApiKey: () => string;
  getRotateKeySecret: () => string;
  rotateApiKey: () => Promise<string>;
}

export interface DeviceStateRecord {
  [deviceId: string]: Record<string, unknown>;
}
