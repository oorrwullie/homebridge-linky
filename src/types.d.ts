import type { PlatformAccessory, PlatformConfig } from 'homebridge';

export interface LinkyPlatformContext {
  config: PlatformConfig;
  accessories: PlatformAccessory[];

  getApiKey(): string;
  getRotateKeySecret(): string;
  rotateApiKey(): Promise<string>;
}

export interface DeviceStateRecord {
  [deviceId: string]: Record<string, unknown>;
}
