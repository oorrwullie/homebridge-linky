import { API, DynamicPlatformPlugin, Logger, Logging, PlatformConfig } from 'homebridge';
import { startServer } from './server';
import { wrapLogger } from './utils/logger';
import { initializeDevices } from './utils/deviceManager';
import { generateApiKey } from './utils/auth';
import axios from 'axios';
import crypto from 'crypto';

export class LinkyPlatform implements DynamicPlatformPlugin {
  private readonly api: API;
  readonly config: PlatformConfig;
  readonly uiPort: number;
  private readonly log: ReturnType<typeof wrapLogger>;
  private apiKey: string;
  private rotateKeySecret: string;

  constructor(log: Logger, config: PlatformConfig, api: API) {
    this.log = wrapLogger(log);
    this.config = config;
    this.api = api;
    this.uiPort = config.uiPort || 8581;

    this.apiKey = config.apiKey || generateApiKey();
    this.rotateKeySecret = this.generateRotateKeySecret();

    if (!config.apiKey) {
      this.log.warn('No API key set. Generated random secure key.');
      this.saveApiKeyToConfig(this.apiKey);
    }

    this.api.on('didFinishLaunching', () => {
      this.log.info('Linky Plugin finished launching');
      initializeDevices(this.api);

      startServer(
        {
          config: { port: this.config.port },
          getApiKey: this.getApiKey.bind(this),
          getRotateKeySecret: this.getRotateKeySecret.bind(this),
          rotateApiKey: this.rotateApiKey.bind(this),
        },
        log as unknown as Logging,
        this.config.port || 8081
      );
    });
  }

  generateRotateKeySecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  getApiKey(): string {
    return this.apiKey;
  }

  getRotateKeySecret(): string {
    return this.rotateKeySecret;
  }

  async rotateApiKey(): Promise<string> {
    const newKey = generateApiKey();
    this.apiKey = newKey;
    this.log.warn('API key rotated dynamically.');

    await this.saveApiKeyToConfig(newKey);
    return newKey;
  }

  async saveApiKeyToConfig(newKey: string) {
    try {
      await axios.post(
        `http://localhost:${this.uiPort}/api/config-editor/plugin/homebridge-linky`,
        {
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

  configureAccessory() {
    // No-op
  }
}
