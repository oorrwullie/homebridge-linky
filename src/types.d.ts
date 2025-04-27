export interface LinkyPlatformContext {
  config: {
    port?: number;
  };
  getApiKey: () => string;
  getRotateKeySecret: () => string;
  rotateApiKey: () => Promise<string>;
}

export interface DeviceStateRecord {
  [deviceId: string]: Record<string, unknown>;
}
