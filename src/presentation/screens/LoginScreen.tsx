import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useLoginViewModel} from '../viewmodels/useLoginViewModel';

export const LoginScreen = () => {
  const {
    username,
    password,
    loading,
    error,
    successMessage,
    setUsername,
    setPassword,
    onLogin,
  } = useLoginViewModel();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>FIMA</Text>
        <Text style={styles.subtitle}>Mobile Attendance</Text>

        <TextInput
          autoCapitalize="none"
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          secureTextEntry
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onLogin}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 36,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    marginTop: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  success: {
    marginTop: 16,
    color: '#059669',
    textAlign: 'center',
  },
});
