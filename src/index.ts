import { API } from 'homebridge';
import { LinkyPlatform } from './linkyPlatform';

export default (api: API) => {
  api.registerPlatform('homebridge-linky', 'Linky', LinkyPlatform);
};
