import React, {useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {HomeScreen} from './src/presentation/screens/HomeScreen';
import {LoginScreen} from './src/presentation/screens/LoginScreen';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    return <HomeScreen />;
  }

  return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
};

export default () => {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
};
