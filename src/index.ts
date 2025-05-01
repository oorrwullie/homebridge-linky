import { API } from 'homebridge';
import { LinkyPlatform } from './linkyPlatform.js';

export default (api: API) => {
  api.registerPlatform('homebridge-linky', 'Linky', LinkyPlatform);
};
