import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthToken} from '../../domain/entities/AuthToken';

const STORAGE_KEY = 'fima_auth_token';

export class TokenStorage {
  async save(token: AuthToken): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(token));
  }

  async getAccessToken(): Promise<string | null> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as AuthToken;
    return parsed.accessToken;
  }
}
