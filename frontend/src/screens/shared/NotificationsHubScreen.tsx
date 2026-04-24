import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { bookingApi } from "../../api/bookings";
import { adminApi } from "../../api/admin";
import { Booking } from "../../types";
import { useAuthStore } from "../../store/authStore";

interface UiNotification {
    id: string;
    title: string;
    message: string;
    time: string;
}

export default function NotificationsHubScreen({ navigation }: any) {
    const user = useAuthStore((s) => s.user);
    const [notifications, setNotifications] = useState<UiNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const mapBookingToNotification = (booking: Booking): UiNotification => {
        const isClient = user?.role === "CLIENT";
        const counterpart = isClient
            ? booking.providerName
            : booking.clientName;
        let title = "Booking Update";

        if (booking.status === "PENDING")
            title = isClient ? "Request Sent" : "New Booking Request";
        if (booking.status === "ACCEPTED")
            title = isClient ? "Booking Accepted" : "Booking Confirmed";
        if (booking.status === "DECLINED")
            title = isClient ? "Booking Declined" : "Booking Declined";
        if (booking.status === "PAID") title = "Payment Completed";
        if (booking.status === "COMPLETED") title = "Service Completed";

        return {
            id: `booking-${booking.id}`,
            title,
            message: `${counterpart} • ${booking.preferredDate} ${booking.preferredTime}`,
            time: new Date(booking.createdAt).toLocaleString(),
        };
    };

    const loadNotifications = async () => {
        setLoading(true);
        try {
            if (user?.role === "ADMIN") {
                const analytics = await adminApi.getAnalytics();
                const data = analytics.data?.data;
                setNotifications([
                    {
                        id: "admin-analytics",
                        title: "Platform Snapshot",
                        message: `Users: ${data?.totalUsers || 0} • Bookings: ${data?.totalBookings || 0}`,
                        time: new Date().toLocaleString(),
                    },
                ]);
            } else if (user?.role === "PROVIDER") {
                const res = await bookingApi.getProviderBookings(
                    undefined,
                    0,
                    20,
                );
                setNotifications(
                    (res.content || []).map(mapBookingToNotification),
                );
            } else {
                const res = await bookingApi.getMyBookings(0, 20);
                setNotifications(
                    (res.content || []).map(mapBookingToNotification),
                );
            }
        } catch (e: any) {
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Could not load notifications.",
            );
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={s.scroll}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={s.back}>← Back</Text>
                </TouchableOpacity>

                <Text style={s.title}>Notifications</Text>

                {loading ? (
                    <Text style={s.helper}>Loading notifications...</Text>
                ) : notifications.length === 0 ? (
                    <Text style={s.helper}>
                        No notifications available right now.
                    </Text>
                ) : (
                    notifications.map((item) => (
                        <View key={item.id} style={s.card}>
                            <Text style={s.cardTitle}>{item.title}</Text>
                            <Text style={s.cardMessage}>{item.message}</Text>
                            <Text style={s.cardTime}>{item.time}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgPrimary },
    scroll: {
        paddingHorizontal: spacing.xxl,
        paddingTop: 50,
        paddingBottom: 40,
    },
    back: {
        ...typography.button,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.xl,
    },
    helper: { ...typography.body, color: colors.textSecondary },
    card: {
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bgSecondary,
        marginBottom: spacing.sm,
    },
    cardTitle: { ...typography.bodyMedium, color: colors.textPrimary },
    cardMessage: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: 2,
    },
    cardTime: {
        ...typography.caption,
        color: colors.textMuted,
        marginTop: spacing.sm,
    },
});
