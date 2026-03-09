import {useMemo, useState} from 'react';
import {LoginUseCase} from '../../domain/usecases/LoginUseCase';
import {AuthRepositoryImpl} from '../../data/repositories/AuthRepositoryImpl';
import {HttpClient} from '../../infra/network/HttpClient';
import {TokenStorage} from '../../infra/storage/TokenStorage';
import {API_CONFIG} from '../../core/config/apiConfig';

type UseLoginViewModelParams = {
  onLoginSuccess: () => void;
};

export const useLoginViewModel = ({onLoginSuccess}: UseLoginViewModelParams) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loginUseCase = useMemo(() => {
    const httpClient = new HttpClient(API_CONFIG.baseUrl);
    const tokenStorage = new TokenStorage();
    const authRepository = new AuthRepositoryImpl(httpClient, tokenStorage);
    return new LoginUseCase(authRepository);
  }, []);

  const onLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await loginUseCase.execute(username, password);
      setSuccessMessage(
        `Login success. ${result.todayAssignment.attendanceTypeStr} assignment, POI, and config synced for ${result.acl.account?.name || result.acl.account?.username || 'employee'}.`,
      );
      setPassword('');
      onLoginSuccess();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to login';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    password,
    loading,
    error,
    successMessage,
    setUsername,
    setPassword,
    onLogin,
  };
};
