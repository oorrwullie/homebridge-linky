export interface LinkyPlatformContext {
  config: {
    port?: number;
  };
  getRotateKeySecret: () => string;
  rotateApiKey: () => Promise<string>;
}

export interface DeviceStateRecord {
  [deviceId: string]: Record<string, unknown>;
}
