import crypto from 'crypto';
import axios from 'axios';
import { API, DynamicPlatformPlugin, Logger, PlatformConfig, PlatformAccessory } from 'homebridge';
import { wrapLogger } from './utils/logger';
import { initializeDevices } from './utils/deviceManager';
import { startServer } from './server';
import { generateApiKey } from './utils/auth';

export class LinkyPlatform implements DynamicPlatformPlugin {
  private readonly log: ReturnType<typeof wrapLogger>;
  private readonly api: API;
  private readonly config: PlatformConfig;
  private apiKey: string;
  private rotateKeySecret: string;

  constructor(log: Logger, config: PlatformConfig, api: API) {
    this.log = wrapLogger(log);
    this.config = config;
    this.api = api;

    this.apiKey = config.apiKey || generateApiKey();
    this.rotateKeySecret = this.generateRotateKeySecret();

    if (!config.apiKey) {
      this.log.warn('No API key set. Generated random secure key.');
    }

    this.api.on('didFinishLaunching', () => {
      this.log.info('Linky Plugin finished launching');
      initializeDevices(this.api);
      startServer(this, this.log, this.config.port || 8081);
    });
  }

  private generateRotateKeySecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getRotateKeySecret(): string {
    return this.rotateKeySecret;
  }

  public async rotateApiKey(): Promise<string> {
    const newKey = generateApiKey();
    this.apiKey = newKey;
    this.log.warn('API key rotated dynamically.');

    await this.saveApiKeyToConfig(newKey);
    return newKey;
  }

  private async saveApiKeyToConfig(newKey: string): Promise<void> {
    try {
      await axios.put(
        'http://localhost:8581/api/config-editor/save',
        {
          platform: 'Linky',
          key: 'apiKey',
          value: newKey,
        },
        {
          headers: {
            'x-hb-control': 'true',
          },
        }
      );
      this.log.info('Saved new API key to Homebridge config.');
    } catch (error) {
      this.log.error('Failed to auto-save API key to Homebridge config', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configureAccessory(_accessory: PlatformAccessory): void {
    // No-op
  }
}
