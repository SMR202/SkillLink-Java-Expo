import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import UserManagementScreen from "../screens/admin/UserManagementScreen";
import ProfileSettingsScreen from "../screens/shared/ProfileSettingsScreen";
import { colors, typography } from "../theme";

const tabs = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "profile", label: "Profile", icon: "👤" },
];

export default function AdminTabs() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const renderScreen = () => {
        switch (activeTab) {
            case "users":
                return <UserManagementScreen />;
            case "profile":
                return <ProfileSettingsScreen onAdminNavigate={setActiveTab} />;
            default:
                return <AdminDashboardScreen />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>{renderScreen()}</View>
            <View style={styles.tabBar}>
                {tabs.map((tab) => (
                    <Pressable
                        key={tab.key}
                        style={styles.tabItem}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text
                            style={[
                                styles.tabIcon,
                                activeTab === tab.key && styles.tabIconActive,
                            ]}
                        >
                            {tab.icon}
                        </Text>
                        <Text
                            style={[
                                styles.tabLabel,
                                activeTab === tab.key && styles.tabLabelActive,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    tabBar: {
        flexDirection: "row",
        backgroundColor: colors.bgPrimary,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: 65,
        paddingBottom: 8,
        paddingTop: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    tabIcon: { fontSize: 20, opacity: 0.4 },
    tabIconActive: { opacity: 1 },
    tabLabel: {
        fontSize: 11,
        fontWeight: "500",
        color: colors.textMuted,
        marginTop: 2,
    },
    tabLabelActive: { color: colors.primary },
});
