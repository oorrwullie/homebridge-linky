import { PlatformAccessory, Service, Characteristic, Perms, CharacteristicValue } from 'homebridge';
import { DeviceError } from './error';
import { DeviceStateRecord, LinkyPlatformContext } from '../types';

const CATEGORY_MAP: { [key: number]: string } = {
  1: 'Other',
  5: 'Lightbulb',
  6: 'Switch',
  10: 'Thermostat',
  15: 'Lock Mechanism',
  26: 'Window',
  28: 'Garage Door Opener',
  29: 'Doorbell',
};

const CONTROLLABLE_CHARACTERISTICS = ['On', 'Brightness', 'TargetTemperature', 'LockTargetState'];

const accessories: PlatformAccessory[] = [];
const deviceState: DeviceStateRecord = {};

export function initializeDevices(platform: LinkyPlatformContext) {
  const platformAccessories = platform.accessories || [];

  console.log(`[Linky] Initializing devices. Found ${platformAccessories.length} accessories.`);

  for (const accessory of platformAccessories) {
    console.log(`[Linky] Found accessory: ${accessory.displayName} (${accessory.UUID})`);
    accessories.push(accessory);
  }
}

export function listDevices() {
  return accessories.map((acc) => {
    const category = acc.category || 1;
    const typeName = CATEGORY_MAP[category] || 'Unknown';

    const servicesInfo = (acc.services || []).map((service: Service) => ({
      serviceName: service.displayName || service.name,
      serviceType: service.UUID,
      characteristics: service.characteristics.map((char: Characteristic) => ({
        type: char.displayName,
        writable: char.props.perms.includes('pw' as Perms),
      })),
    }));

    const allCharacteristics = servicesInfo.flatMap((serviceInfo) =>
      serviceInfo.characteristics.map((char) => char.type)
    );

    const isControllable = allCharacteristics.some((name) =>
      CONTROLLABLE_CHARACTERISTICS.includes(name)
    );

    const deviceReachable = deviceState[acc.UUID]?.reachable ?? true;

    return {
      id: acc.UUID,
      name: acc.displayName,
      type: typeName,
      manufacturer: acc.context?.manufacturer || 'Unknown',
      model: acc.context?.model || 'Unknown',
      serialNumber: acc.context?.serialNumber || 'Unknown',
      reachable: deviceReachable,
      controllable: isControllable,
      services: servicesInfo,
      state: deviceState[acc.UUID] || {},
    };
  });
}

export function getDeviceState(deviceId: string) {
  return deviceState[deviceId] || null;
}

export async function setDeviceState(deviceId: string, characteristicName: string, value: unknown) {
  const device = accessories.find((acc) => acc.UUID === deviceId);
  if (!device) {
    throw new DeviceError('Device not found', 'not_found');
  }
  if (device.reachable === false) {
    throw new DeviceError('Device is unreachable', 'unreachable');
  }
  for (const service of device.services) {
    const characteristic = service.characteristics.find(
      (c) => c.displayName === characteristicName
    );
    if (characteristic) {
      return new Promise<void>((resolve, reject) => {
        characteristic.setValue(value as CharacteristicValue, (error: Error | null) => {
          if (error) {
            return reject(
              new DeviceError(`Failed to set value: ${error.message}`, 'internal_error')
            );
          }
          resolve();
        });
      });
    }
  }
  throw new DeviceError(`Characteristic ${characteristicName} not found`, 'invalid_request');
}

export function registerAccessory(accessory: PlatformAccessory) {
  accessories.push(accessory);
}
