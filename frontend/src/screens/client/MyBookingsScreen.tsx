import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
} from "../../theme";
import { bookingApi } from "../../api/bookings";
import { Booking } from "../../types";

const statusConfig: Record<
    string,
    { color: string; bg: string; label: string }
> = {
    PENDING: { color: colors.pending, bg: "#FEF3C7", label: "Pending" },
    ACCEPTED: {
        color: colors.accepted,
        bg: colors.accentLight,
        label: "Accepted",
    },
    DECLINED: { color: colors.declined, bg: "#FEE2E2", label: "Declined" },
    PAID: { color: "#6366F1", bg: "#EEF2FF", label: "Paid" },
    COMPLETED: {
        color: colors.textSecondary,
        bg: colors.bgInput,
        label: "Completed",
    },
};

export default function MyBookingsScreen() {
    const navigation = useNavigation<any>();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const r = await bookingApi.getMyBookings();
            setBookings(r.content || []);
        } catch (e: any) {
            setError(e?.response?.data?.message || "Failed to load bookings.");
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkCompleted = async (bookingId: number) => {
        try {
            await bookingApi.complete(bookingId);
            Alert.alert("Success", "Booking marked as completed.");
            load();
        } catch (e: any) {
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Could not complete booking.",
            );
        }
    };

    const renderItem = ({ item }: { item: Booking }) => {
        const cfg = statusConfig[item.status] || statusConfig.PENDING;
        return (
            <View style={s.card}>
                <View style={s.cardTop}>
                    <View style={s.av}>
                        <Text style={s.avT}>
                            {item.providerName?.[0]?.toUpperCase()}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.name}>{item.providerName}</Text>
                        <Text style={s.date}>
                            {item.preferredDate} · {item.preferredTime}
                        </Text>
                    </View>
                    <View style={[s.badge, { backgroundColor: cfg.bg }]}>
                        <Text style={[s.badgeText, { color: cfg.color }]}>
                            {cfg.label}
                        </Text>
                    </View>
                </View>
                <Text style={s.desc} numberOfLines={2}>
                    {item.jobDescription}
                </Text>
                {item.declineReason && (
                    <Text style={s.reason}>Reason: {item.declineReason}</Text>
                )}

                {/* Action buttons */}
                <View style={s.actions}>
                    {(item.status === "PENDING" ||
                        item.status === "ACCEPTED") && (
                        <Pressable
                            style={s.actionBtn}
                            onPress={() =>
                                navigation.navigate("Chat", {
                                    bookingId: item.id,
                                    otherUserName: item.providerName,
                                })
                            }
                        >
                            <Text style={s.actionText}>💬 Chat</Text>
                        </Pressable>
                    )}
                    {item.status === "ACCEPTED" && (
                        <Pressable
                            style={[
                                s.actionBtn,
                                { backgroundColor: colors.accentLight },
                            ]}
                            onPress={() =>
                                navigation.navigate("Checkout", {
                                    bookingId: item.id,
                                    providerName: item.providerName,
                                    jobDescription: item.jobDescription,
                                    preferredDate: item.preferredDate,
                                })
                            }
                        >
                            <Text
                                style={[s.actionText, { color: colors.accent }]}
                            >
                                💳 Pay Now
                            </Text>
                        </Pressable>
                    )}
                    {item.status === "PAID" && (
                        <Pressable
                            style={[
                                s.actionBtn,
                                { backgroundColor: "#E0E7FF" },
                            ]}
                            onPress={() => handleMarkCompleted(item.id)}
                        >
                            <Text style={[s.actionText, { color: "#4338CA" }]}>
                                ✅ Mark Completed
                            </Text>
                        </Pressable>
                    )}
                    {item.status === "COMPLETED" && (
                        <Pressable
                            style={[
                                s.actionBtn,
                                { backgroundColor: "#FEF3C7" },
                            ]}
                            onPress={() =>
                                navigation.navigate("ReviewForm", {
                                    bookingId: item.id,
                                    providerName: item.providerName,
                                })
                            }
                        >
                            <Text
                                style={[s.actionText, { color: colors.star }]}
                            >
                                ⭐ Leave Review
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <View style={s.header}>
                <Text style={s.title}>My Bookings</Text>
            </View>
            <FlatList
                data={bookings}
                renderItem={renderItem}
                keyExtractor={(i) => i.id.toString()}
                contentContainerStyle={s.list}
                ListEmptyComponent={
                    <View style={s.empty}>
                        <Text style={{ fontSize: 40 }}>
                            {loading ? "⏳" : "📋"}
                        </Text>
                        <Text style={s.emptyText}>
                            {loading ? "Loading..." : "No bookings yet"}
                        </Text>
                        <Text style={s.emptyDesc}>
                            {error || "Book a service provider to get started"}
                        </Text>
                    </View>
                }
            />
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
    list: {
        paddingHorizontal: spacing.xxl,
        paddingTop: spacing.lg,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    av: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.bgInput,
        justifyContent: "center",
        alignItems: "center",
    },
    avT: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
        fontWeight: "600",
    },
    name: { ...typography.bodyMedium, color: colors.textPrimary },
    date: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
    badge: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    badgeText: { ...typography.captionMedium },
    desc: { ...typography.small, color: colors.textSecondary },
    reason: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.sm,
    },
    actions: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.md,
        flexWrap: "wrap",
    },
    actionBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: borderRadius.md,
        backgroundColor: colors.bgInput,
    },
    actionText: {
        ...typography.caption,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    empty: { alignItems: "center", marginTop: spacing.huge },
    emptyText: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
        marginTop: spacing.lg,
    },
    emptyDesc: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
});
