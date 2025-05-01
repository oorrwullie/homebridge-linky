import { API } from 'homebridge';
import { LinkyPlatform } from './linkyPlatform.js';

export = (api: API) => {
  api.registerPlatform('homebridge-linky', 'Linky', LinkyPlatform);
};
