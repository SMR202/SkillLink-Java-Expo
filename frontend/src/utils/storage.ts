import { Platform } from 'react-native';

// expo-secure-store doesn't work on web — use localStorage as fallback
const webStorage = {
  getItemAsync: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
  },
  setItemAsync: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
  },
  deleteItemAsync: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
  },
};

let SecureStore: typeof webStorage;

if (Platform.OS === 'web') {
  SecureStore = webStorage;
} else {
  // Dynamic import for native
  SecureStore = require('expo-secure-store');
}

export default SecureStore;
