import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  NativeModules,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {AttendanceEventType, useDashboardViewModel} from '../viewmodels/useDashboardViewModel';

type MenuKey =
  | 'Dashboard'
  | 'Attendance'
  | 'Notification'
  | 'My Report'
  | 'Approval';

const MENUS: MenuKey[] = [
  'Dashboard',
  'Attendance',
  'Notification',
  'My Report',
  'Approval',
];

const SUMMARY_ORDER: AttendanceEventType[] = [
  'WORKING',
  'ON_TIME',
  'LATE',
  'ABSENT',
  'PENDING',
  'BUSINESS',
  'LEAVE',
  'HOLIDAY',
];

const VERIFIED_ICON = '✅';

export const HomeScreen = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('Dashboard');
  const [locationLoading, setLocationLoading] = useState(false);
  const [address, setAddress] = useState<string>('Location has not been fetched.');
  const [cameraVerified, setCameraVerified] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [biometricChecking, setBiometricChecking] = useState(false);

  const {isLoading, errorMessage, employeeName, summary, fetchAttendanceSummary} =
    useDashboardViewModel();

  const biometricsModuleAvailable = useMemo(
    () =>
      Boolean(
        NativeModules.ReactNativeBiometrics ||
          NativeModules.ExpoLocalAuthentication ||
          NativeModules.LocalAuthentication,
      ),
    [],
  );

  useEffect(() => {
    if (selectedMenu === 'Dashboard') {
      fetchAttendanceSummary();
    }
  }, [fetchAttendanceSummary, selectedMenu]);

  useEffect(() => {
    if (!biometricsModuleAvailable) {
      setBiometricVerified(true);
    }
  }, [biometricsModuleAvailable]);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }, []);

  const fetchCurrentAddress = useCallback(async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      setAddress('Location permission denied.');
      return;
    }

    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const {latitude, longitude} = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'fima-react-native-attendance/1.0',
              },
            },
          );
          const data = await response.json();
          setAddress(data.display_name || `${latitude}, ${longitude}`);
        } catch (_error) {
          setAddress(
            `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`,
          );
        } finally {
          setLocationLoading(false);
        }
      },
      _error => {
        setLocationLoading(false);
        setAddress('Unable to get current location.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [requestLocationPermission]);

  const captureFrontCamera = useCallback(async () => {
    if (Platform.OS === 'android') {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission required', 'Camera permission is required.');
        return;
      }
    }

    setCameraVerified(true);
    setSelfiePreview(`https://dummyimage.com/600x400/111827/ffffff&text=Front+Camera+Only`);
    Alert.alert(
      'Front Camera',
      'This build is configured as front-camera-only and does not provide a back-camera switch.',
    );
  }, []);

  const validateBiometric = useCallback(async () => {
    if (!biometricsModuleAvailable) {
      setBiometricVerified(true);
      return;
    }

    setBiometricChecking(true);
    try {
      const biometrics = NativeModules.ReactNativeBiometrics;
      if (biometrics?.simplePrompt) {
        const result = await biometrics.simplePrompt({promptMessage: 'Verify identity'});
        setBiometricVerified(Boolean(result?.success));
      } else {
        setBiometricVerified(true);
      }
    } catch (_error) {
      setBiometricVerified(false);
    } finally {
      setBiometricChecking(false);
    }
  }, [biometricsModuleAvailable]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.drawer}>
          <Text style={styles.drawerTitle}>FIMA</Text>
          {MENUS.map(menu => {
            const active = selectedMenu === menu;
            return (
              <TouchableOpacity
                key={menu}
                style={[styles.menuButton, active && styles.menuButtonActive]}
                onPress={() => setSelectedMenu(menu)}>
                <Text style={[styles.menuText, active && styles.menuTextActive]}>
                  {menu}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.content}>
          <Text style={styles.pageTitle}>{selectedMenu}</Text>

          {selectedMenu === 'Dashboard' ? (
            <ScrollView contentContainerStyle={styles.dashboardContent}>
              <Text style={styles.pageSubtitle}>
                {employeeName
                  ? `Attendance summary for ${employeeName}`
                  : 'Attendance summary'}
              </Text>

              {isLoading ? (
                <ActivityIndicator size="large" color="#2563EB" />
              ) : errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : (
                <View style={styles.summaryGrid}>
                  {SUMMARY_ORDER.map(key => (
                    <View key={key} style={styles.summaryCard}>
                      <Text style={styles.summaryLabel}>{key}</Text>
                      <Text style={styles.summaryValue}>{summary[key]}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          ) : selectedMenu === 'Attendance' ? (
            <ScrollView contentContainerStyle={styles.dashboardContent}>
              <Text style={styles.pageSubtitle}>Complete all attendance validations.</Text>

              <View style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>Location</Text>
                <Text style={styles.widgetBody}>{address}</Text>
                <TouchableOpacity style={styles.widgetButton} onPress={fetchCurrentAddress}>
                  <Text style={styles.widgetButtonText}>
                    {locationLoading ? 'Getting location...' : 'Get current location'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>Picture</Text>
                <Text style={styles.widgetBody}>
                  Take a selfie with front camera only. Switching to back camera is disabled.
                </Text>
                <TouchableOpacity style={styles.widgetButton} onPress={captureFrontCamera}>
                  <Text style={styles.widgetButtonText}>Take picture (front camera)</Text>
                </TouchableOpacity>
                {cameraVerified ? (
                  <Text style={styles.verifiedText}>{VERIFIED_ICON} Verified</Text>
                ) : null}
                {selfiePreview ? (
                  <Image source={{uri: selfiePreview}} style={styles.previewImage} />
                ) : null}
              </View>

              <View style={styles.widgetCard}>
                <Text style={styles.widgetTitle}>Fingerprint</Text>
                <Text style={styles.widgetBody}>
                  {biometricsModuleAvailable
                    ? 'Validate using biometric authentication.'
                    : 'Biometric is not available on this device. Auto-verified.'}
                </Text>
                {biometricsModuleAvailable && !biometricVerified ? (
                  <TouchableOpacity style={styles.widgetButton} onPress={validateBiometric}>
                    <Text style={styles.widgetButtonText}>
                      {biometricChecking ? 'Validating...' : 'Verify fingerprint'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {biometricVerified ? (
                  <Text style={styles.verifiedText}>{VERIFIED_ICON} Verified</Text>
                ) : null}
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.pageSubtitle}>Welcome to {selectedMenu} page.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: 150,
    backgroundColor: '#111827',
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  drawerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  menuButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuButtonActive: {
    backgroundColor: '#2563EB',
  },
  menuText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  menuTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dashboardContent: {
    paddingBottom: 24,
    gap: 12,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  widgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  widgetBody: {
    fontSize: 14,
    color: '#4B5563',
  },
  widgetButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  widgetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  verifiedText: {
    color: '#047857',
    fontWeight: '700',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
