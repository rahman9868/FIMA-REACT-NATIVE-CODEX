import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthToken} from '../../domain/entities/AuthToken';
import {EmployeeAcl} from '../../domain/entities/EmployeeAcl';

const STORAGE_KEY = 'fima_auth_token';
const ACL_STORAGE_KEY = 'fima_employee_acl';

export class TokenStorage {
  async save(token: AuthToken): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(token));
  }

  async saveEmployeeAcl(acl: EmployeeAcl): Promise<void> {
    await AsyncStorage.setItem(ACL_STORAGE_KEY, JSON.stringify(acl));
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
