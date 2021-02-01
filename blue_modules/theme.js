import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStorage } from '../class';
import DefaultPreference from 'react-native-default-preference';
import RNWidgetCenter from 'react-native-widget-center';
let preferredTheme = 'auto';

const STRUCT = {
  LAST_UPDATED: 'LAST_UPDATED',
};

/**
 * Saves to storage preferred currency, whole object
 * from `./models/fiatUnit`
 *
 * @param item {String} one of `auto`, `light`, `dark`
 * @returns {Promise<void>}
 */
async function setPreferredTheme(item) {
  await AsyncStorage.setItem(AppStorage.PREFERRED_THEME, item);
  await DefaultPreference.setName('group.io.bluewallet.bluewallet');
  await DefaultPreference.set('preferredTheme', item);
  console.log("preferred theme saved to: " + item);
  RNWidgetCenter.reloadAllTimelines();
}

async function getPreferredTheme() {
  const preferredTheme = await AsyncStorage.getItem(AppStorage.PREFERRED_THEME);
  await DefaultPreference.set('preferredTheme', preferredTheme);
  console.log("[Theme.js:29] preferred theme loaded as: " + preferredTheme);
  return preferredTheme;
}

/**
 * Used to mock data in tests
 *
 * @param {object} theme, one of `auto`, `light`, `dark`
 */
function _setPreferredTheme(theme) {
  preferredTheme = theme;
}

module.exports.STRUCT = STRUCT;
module.exports.setPreferredTheme = setPreferredTheme;
module.exports.getPreferredTheme = getPreferredTheme;
module.exports._setPreferredTheme = _setPreferredTheme; // export it to mock data in tests
