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
import { initializeDevices, registerAccessory } from './utils/deviceManager';
import { generateApiKey } from './utils/auth';
import { name as pluginName } from '../package.json';
import type { LinkyPlatformContext } from './types';

export class LinkyPlatform implements DynamicPlatformPlugin, LinkyPlatformContext {
  public readonly config: PlatformConfig;
  public readonly accessories: PlatformAccessory[] = [];

  private readonly api: API;
  private readonly log: ReturnType<typeof wrapLogger>;
  private readonly uiPort: number;
  private readonly uiUsername: string;
  private readonly uiPassword: string;
  private apiKey: string;
  private readonly rotateKeySecret: string;

  constructor(log: Logger, config: PlatformConfig, api: API) {
    this.log = wrapLogger(log);
    this.api = api;
    this.config = config;

    this.uiPort = config.uiPort ?? 8581;
    this.uiUsername = config.uiUsername ?? 'admin';
    this.uiPassword = config.uiPassword ?? 'admin';

    this.apiKey = config.apiKey ?? generateApiKey();
    this.rotateKeySecret = this.generateRotateKeySecret();

    if (!config.apiKey) {
      this.log.warn('No API key set. Generated random secure key.');
      this.saveApiKeyToConfig(this.apiKey);
    }

    this.api.on('didFinishLaunching', () => {
      this.log.info('Linky Plugin finished launching');

      initializeDevices(this);

      startServer(
        {
          config: this.config,
          accessories: this.accessories,
          getApiKey: this.getApiKey.bind(this),
          getRotateKeySecret: this.getRotateKeySecret.bind(this),
          rotateApiKey: this.rotateApiKey.bind(this),
        },
        log as unknown as Logging,
        this.config.port ?? 8081
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
