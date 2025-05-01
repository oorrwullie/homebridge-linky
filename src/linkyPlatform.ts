import {
  API,
  DynamicPlatformPlugin,
  Logger,
  Logging,
  PlatformAccessory,
  PlatformConfig,
} from 'homebridge';
import axios from 'axios';
import crypto from 'crypto';
import { startServer } from './server';
import { wrapLogger } from './utils/logger';
import { initializeDevices } from './utils/deviceManager';
import { registerAccessory } from './utils/deviceManager';
import { generateApiKey } from './utils/auth';
import { name as pluginName } from '../package.json';

export class LinkyPlatform implements DynamicPlatformPlugin {
  private readonly api: API;
  private readonly log: ReturnType<typeof wrapLogger>;
  private readonly uiPort: number;
  private readonly uiUsername: string;
  private readonly uiPassword: string;
  private readonly accessories: PlatformAccessory[] = [];
  private apiKey: string;
  private readonly rotateKeySecret: string;

  constructor(log: Logger, config: PlatformConfig, api: API) {
    this.log = wrapLogger(log);
    this.api = api;
    this.uiPort = (config.uiPort as number) ?? 8581;
    this.uiUsername = (config.uiUsername as string) ?? 'admin';
    this.uiPassword = (config.uiPassword as string) ?? 'admin';

    this.apiKey = (config.apiKey as string) ?? generateApiKey();
    this.rotateKeySecret = this.generateRotateKeySecret();

    if (!config.apiKey) {
      this.log.warn('No API key set. Generated random secure key.');
      this.saveApiKeyToConfig(this.apiKey);
    }

    this.api.on('didFinishLaunching', () => {
      this.log.info('Linky Plugin finished launching');

      initializeDevices({
        config: { port: this.uiPort },
        getApiKey: this.getApiKey.bind(this),
        getRotateKeySecret: this.getRotateKeySecret.bind(this),
        rotateApiKey: this.rotateApiKey.bind(this),
        accessories: this.accessories,
      });

      startServer(
        {
          config: { port: this.uiPort },
          getApiKey: this.getApiKey.bind(this),
          getRotateKeySecret: this.getRotateKeySecret.bind(this),
          rotateApiKey: this.rotateApiKey.bind(this),
          accessories: this.accessories,
        },
        log as unknown as Logging,
        this.uiPort ?? 8081
      );
    });
  }

  private generateRotateKeySecret(): string {
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

  private async saveApiKeyToConfig(newKey: string): Promise<void> {
    const base = `http://localhost:${this.uiPort}`;

    try {
      const loginRes = await axios.post(`${base}/api/auth/login`, {
        username: this.uiUsername,
        password: this.uiPassword,
      });
      const token = loginRes.data.token;

      await axios.post(
        `${base}/api/config-editor/plugin/${pluginName}`,
        { key: 'apiKey', value: newKey },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-hb-control': 'true',
          },
        }
      );

      this.log.info('Saved new API key to Homebridge config.');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        this.log.error(
          'Config UI login failed (403 Forbidden). ' +
            'Please verify `uiUsername`/`uiPassword` in your Linky config match your Config UI X credentials, ' +
            'or reset to defaults by deleting auth.json.'
        );
        return;
      }
      if (error instanceof Error) {
        this.log.error('Failed to auto-save API key to Homebridge config', error);
      } else {
        this.log.error(
          'Failed to auto-save API key to Homebridge config',
          new Error(String(error))
        );
      }
    }
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.accessories.push(accessory);
    registerAccessory(accessory);
  }
}
