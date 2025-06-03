import AsyncStorage from '@react-native-async-storage/async-storage';

const API_VERSION_KEY = 'apiVersion';

/**
 * Returns the stored API version string, or null if none is set.
 */
export async function getLocalVersion() {
  try {
    const v = await AsyncStorage.getItem(API_VERSION_KEY);
    if (v === null) {
      return 0;
    }
    const intV = parseInt(v, 10);
    // If parseInt gives NaN, treat as 0:
    return Number.isNaN(intV) ? 0 : intV;
  } catch (err) {
    console.error('getLocalVersion failed', err);
    return 0;
  }
}

/**
 * Overwrites the stored API version to `v`.
 */
export async function setLocalVersion(versionInt) {
  try {
    await AsyncStorage.setItem(API_VERSION_KEY, String(versionInt));
  } catch (err) {
    console.error('setLocalVersion failed', err);
  }
}