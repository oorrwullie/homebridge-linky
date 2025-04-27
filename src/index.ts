import { API } from 'homebridge';
import { LinkyPlatform } from './linkyPlatform';

export = (api: API) => {
  api.registerPlatform('homebridge-linky', 'Linky', LinkyPlatform);
};
