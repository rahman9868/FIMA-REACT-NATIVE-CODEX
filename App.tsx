import React, {useState} from 'react';
import {HomeScreen} from './src/presentation/screens/HomeScreen';
import {LoginScreen} from './src/presentation/screens/LoginScreen';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    return <HomeScreen />;
  }

  return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
};

export default App;
