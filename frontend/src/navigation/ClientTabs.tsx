import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/client/HomeScreen';
import JobBoardScreen from '../screens/client/JobBoardScreen';
import MyPostedJobsScreen from '../screens/client/MyPostedJobsScreen';
import MyBookingsScreen from '../screens/client/MyBookingsScreen';
import ProfileSettingsScreen from '../screens/shared/ProfileSettingsScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = { Home: 'H', Jobs: 'J', 'My Jobs': 'M', Bookings: 'B', Profile: 'P' };
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{icons[name] || '*'}</Text>
    </View>
  );
}

export default function ClientTabs() {
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={JobBoardScreen} />
      <Tab.Screen name="My Jobs" component={MyPostedJobsScreen} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileSettingsScreen} />
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
