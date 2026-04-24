import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
} from "../../theme";
import { bookingApi } from "../../api/bookings";
import { useAuthStore } from "../../store/authStore";

export default function DashboardScreen() {
    const navigation = useNavigation<any>();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const [stats, setStats] = useState({
        pending: 0,
        accepted: 0,
        completed: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);
    const loadStats = async () => {
        try {
            const [p, a, c] = await Promise.all([
                bookingApi.getProviderBookings("PENDING", 0, 1),
                bookingApi.getProviderBookings("ACCEPTED", 0, 1),
                bookingApi.getProviderBookings("COMPLETED", 0, 1),
            ]);
            setStats({
                pending: p.totalElements || 0,
                accepted: a.totalElements || 0,
                completed: c.totalElements || 0,
            });
        } catch {
            Alert.alert("Error", "Could not load dashboard stats.");
        }
    };

    const handleQuickAction = (action: string) => {
        if (action === "View Bookings") {
            navigation.navigate("My Bookings");
            return;
        }

        if (action === "Edit Profile") {
            navigation.navigate("Edit Profile");
            return;
        }

        if (action === "Earnings") {
            navigation.navigate("Earnings");
            return;
        }
        
        if (action === "Reviews") {
            navigation.navigate("Reviews");
            return;
        }

        if (action === "Analytics") {
            Alert.alert(
                "Analytics Snapshot",
                `Pending: ${stats.pending}\nActive: ${stats.accepted}\nCompleted: ${stats.completed}`,
            );
            return;
        }

        navigation.navigate("ProfileSettings");
    };

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <View style={s.header}>
                <View>
                    <Text style={s.greeting}>Welcome back 👋</Text>
                    <Text style={s.name}>{user?.fullName || "Provider"}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={s.logoutBtn}>
                    <Text style={s.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.content}>
                <Text style={s.sectionTitle}>Overview</Text>
                <View style={s.statsRow}>
                    {[
                        {
                            label: "Pending",
                            val: stats.pending,
                            icon: "⏳",
                            color: colors.pending,
                        },
                        {
                            label: "Active",
                            val: stats.accepted,
                            icon: "✓",
                            color: colors.accepted,
                        },
                        {
                            label: "Done",
                            val: stats.completed,
                            icon: "🎉",
                            color: colors.textSecondary,
                        },
                    ].map((item) => (
                        <View key={item.label} style={s.statCard}>
                            <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                            <Text style={[s.statVal, { color: item.color }]}>
                                {item.val}
                            </Text>
                            <Text style={s.statLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                <Text style={s.sectionTitle}>Quick Actions</Text>
                <View style={s.actionsGrid}>
                    {[
                        ["📋", "View Bookings"],
                        ["✏️", "Edit Profile"],
                        ["�", "Earnings"],
                        ["⭐", "Reviews"],
                        ["�📊", "Analytics"],
                        ["⚙️", "Settings"],
                    ].map(([icon, label]) => (
                        <TouchableOpacity
                            key={label}
                            style={s.actionCard}
                            activeOpacity={0.7}
                            onPress={() => handleQuickAction(label as string)}
                        >
                            <Text style={{ fontSize: 24 }}>{icon}</Text>
                            <Text style={s.actionLabel}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgSecondary },
    header: {
        backgroundColor: colors.bgPrimary,
        paddingTop: 54,
        paddingHorizontal: spacing.xxl,
        paddingBottom: spacing.xxl,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    greeting: { ...typography.body, color: colors.textSecondary },
    name: { ...typography.h2, color: colors.textPrimary, marginTop: 2 },
    logoutBtn: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
    },
    logoutText: { ...typography.smallMedium, color: colors.textSecondary },
    content: { padding: spacing.xxl, paddingBottom: 100 },
    sectionTitle: {
        ...typography.h4,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
        marginTop: spacing.md,
    },
    statsRow: { flexDirection: "row", gap: spacing.md },
    statCard: {
        flex: 1,
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    statVal: { ...typography.h2, marginTop: spacing.sm },
    statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
    actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
    actionCard: {
        width: "47%",
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    actionLabel: {
        ...typography.smallMedium,
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
});
