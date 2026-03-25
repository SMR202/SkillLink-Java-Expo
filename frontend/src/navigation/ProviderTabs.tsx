import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import ProviderDashboardScreen from '../screens/provider/DashboardScreen';
import BookingMgmtScreen from '../screens/provider/BookingMgmtScreen';
import ProfileEditScreen from '../screens/provider/ProfileEditScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();

type TabIconProps = { name: string; focused: boolean };
function TabIcon({ name, focused }: TabIconProps) {
  const icons: Record<string, string> = { Dashboard: '📊', 'My Bookings': '📋', 'Edit Profile': '✏️' };
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>
        {icons[name] || '●'}
      </Text>
    </View>
  );
}

export default function ProviderTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={ProviderDashboardScreen} />
      <Tab.Screen name="My Bookings" component={BookingMgmtScreen} />
      <Tab.Screen name="Edit Profile" component={ProfileEditScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgPrimary,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabIcon: {
    alignItems: 'center',
  },
  tabEmoji: {
    fontSize: 20,
    opacity: 0.4,
  },
  tabEmojiActive: {
    opacity: 1,
  },
});
