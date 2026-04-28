import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import ProviderDashboardScreen from '../screens/provider/DashboardScreen';
import ProviderJobBoardScreen from '../screens/provider/ProviderJobBoardScreen';
import BookingMgmtScreen from '../screens/provider/BookingMgmtScreen';
import EarningsScreen from '../screens/provider/EarningsScreen';
import ChatListScreen from '../screens/shared/ChatListScreen';
import ProfileEditScreen from '../screens/provider/ProfileEditScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = { Dashboard: 'D', Jobs: 'J', Bookings: 'B', Messages: 'C', Earnings: 'E', Profile: 'P' };
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{icons[name] || '*'}</Text>
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
      <Tab.Screen name="Jobs" component={ProviderJobBoardScreen} />
      <Tab.Screen name="Bookings" component={BookingMgmtScreen} />
      <Tab.Screen name="Messages" component={ChatListScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Profile" component={ProfileEditScreen} />
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
  tabLabel: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  tabIcon: { alignItems: 'center' },
  tabEmoji: { fontSize: 15, fontWeight: '700', opacity: 0.4, color: colors.textMuted },
  tabEmojiActive: { opacity: 1, color: colors.primary },
});
