import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {
  AssignmentBySchedule,
  AssignmentScheduleDetail,
  AttendanceTypeStr,
} from '../../domain/entities/Assignment';
import {AuthToken} from '../../domain/entities/AuthToken';
import {EmployeeAcl} from '../../domain/entities/EmployeeAcl';
import {FiraConfig} from '../../domain/entities/FiraConfig';
import {EmployeePoi} from '../../domain/entities/Poi';
import {AuthRepository} from '../../domain/repositories/AuthRepository';

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

export const HomeScreen = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('Dashboard');

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
          <Text style={styles.pageSubtitle}>Welcome to {selectedMenu} page.</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});
