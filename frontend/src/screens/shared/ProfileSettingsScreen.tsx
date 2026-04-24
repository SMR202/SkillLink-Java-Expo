import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { useAuthStore } from "../../store/authStore";

interface Props {
    onAdminNavigate?: (tab: string) => void;
}

export default function ProfileSettingsScreen({ onAdminNavigate }: Props) {
    const navigation = useNavigation<any>();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const navigateTo = (screen: string) => {
        try {
            navigation.navigate(screen);
        } catch {
            navigation.getParent?.()?.navigate(screen);
        }
    };

    const handleMenuPress = (label: string) => {
        if (label === "Edit Profile") {
            if (user?.role === "PROVIDER") {
                navigation.navigate("ProviderMain", { screen: "Edit Profile" });
                return;
            }
            if (user?.role === "CLIENT") {
                navigateTo("ClientContact");
                return;
            }
            if (onAdminNavigate) {
                onAdminNavigate("users");
                return;
            }
            Alert.alert(
                "Info",
                "Use user management to update account details.",
            );
            return;
        }

        if (label === "Manage Addresses") {
            if (user?.role === "CLIENT") {
                navigateTo("ClientContact");
            } else {
                Alert.alert(
                    "Not available",
                    "Address management is available for client accounts.",
                );
            }
            return;
        }

        if (label === "Notifications") {
            navigateTo("NotificationsHub");
            return;
        }

        if (label === "Change Password") {
            navigateTo("ChangePassword");
            return;
        }

        navigateTo("HelpSupport");
    };

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <View style={s.header}>
                <Text style={s.title}>Profile</Text>
            </View>

            <View style={s.profileCard}>
                <View style={s.avatar}>
                    <Text style={s.avatarText}>
                        {user?.fullName?.[0]?.toUpperCase() ||
                            user?.email?.[0]?.toUpperCase()}
                    </Text>
                </View>
                <Text style={s.name}>{user?.fullName || "User"}</Text>
                <Text style={s.email}>{user?.email}</Text>
                <View style={s.roleBadge}>
                    <Text style={s.roleText}>{user?.role}</Text>
                </View>
            </View>

            <View style={s.menu}>
                {[
                    ["👤", "Edit Profile"],
                    ["📍", "Manage Addresses"],
                    ["🔔", "Notifications"],
                    ["🔒", "Change Password"],
                    ["❓", "Help & Support"],
                ].map(([icon, label]) => (
                    <TouchableOpacity
                        key={label}
                        style={s.menuItem}
                        activeOpacity={0.6}
                        onPress={() => handleMenuPress(label as string)}
                    >
                        <Text style={s.menuIcon}>{icon}</Text>
                        <Text style={s.menuLabel}>{label}</Text>
                        <Text style={s.menuArrow}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={s.logoutBtn} onPress={logout}>
                <Text style={s.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgSecondary },
    header: {
        backgroundColor: colors.bgPrimary,
        paddingTop: 54,
        paddingHorizontal: spacing.xxl,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: { ...typography.h2, color: colors.textPrimary },
    profileCard: {
        backgroundColor: colors.bgCard,
        marginHorizontal: spacing.xxl,
        marginTop: spacing.xl,
        borderRadius: borderRadius.xl,
        padding: spacing.xxl,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.bgInput,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.md,
    },
    avatarText: { fontSize: 24, fontWeight: "700", color: colors.textPrimary },
    name: { ...typography.h3, color: colors.textPrimary },
    email: { ...typography.small, color: colors.textMuted, marginTop: 2 },
    roleBadge: {
        marginTop: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        backgroundColor: colors.bgInput,
    },
    roleText: { ...typography.captionMedium, color: colors.textSecondary },
    menu: {
        marginHorizontal: spacing.xxl,
        marginTop: spacing.xl,
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    menuIcon: { fontSize: 16, marginRight: spacing.md },
    menuLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
    menuArrow: { fontSize: 18, color: colors.textMuted },
    logoutBtn: {
        marginHorizontal: spacing.xxl,
        marginTop: spacing.xxl,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.error + "30",
        backgroundColor: "#FEF2F2",
    },
    logoutText: { ...typography.button, color: colors.error },
});
