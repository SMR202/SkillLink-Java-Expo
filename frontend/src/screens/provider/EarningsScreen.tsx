import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Alert,
    FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
} from "../../theme";
import { paymentApi } from "../../api/payments";
import { Payment, EarningsSummary } from "../../types";

export default function EarningsScreen() {
    const navigation = useNavigation<any>();
    const [summary, setSummary] = useState<EarningsSummary | null>(null);
    const [history, setHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [earnRes, histRes] = await Promise.all([
                paymentApi.getEarnings(),
                paymentApi.getProviderHistory(0, 20),
            ]);
            setSummary(earnRes.data?.data || null);
            setHistory(histRes.data?.data?.content || []);
        } catch (e: any) {
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Could not load earnings data.",
            );
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Payment }) => (
        <View style={s.historyCard}>
            <View style={s.histRow}>
                <Text style={s.histClient}>{item.clientName}</Text>
                <Text style={s.histAmount}>
                    + Rs. {item.providerEarnings?.toFixed(2)}
                </Text>
            </View>
            <View style={s.histRow}>
                <Text style={s.histRef}>Ref: {item.transactionRef}</Text>
                <Text style={s.histDate}>
                    {new Date(item.paidAt!).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={s.back}>← Back</Text>
                </TouchableOpacity>
                <Text style={s.title}>Earnings & Payouts</Text>
            </View>

            <View style={s.summaryBox}>
                <Text style={s.summaryLabel}>Total Earnings</Text>
                <Text style={s.summaryVal}>
                    Rs. {summary?.totalEarnings?.toFixed(2) || "0.00"}
                </Text>

                <View style={s.summaryCards}>
                    <View style={s.subCard}>
                        <Text style={s.subLabel}>This Month</Text>
                        <Text style={s.subVal}>
                            Rs.{" "}
                            {summary?.thisMonthEarnings?.toFixed(2) || "0.00"}
                        </Text>
                    </View>
                    <View style={s.subCard}>
                        <Text style={s.subLabel}>Pending</Text>
                        <Text style={s.subVal}>
                            Rs. {summary?.pendingPayouts?.toFixed(2) || "0.00"}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={s.listContainer}>
                <Text style={s.historyTitle}>Payment History</Text>
                <FlatList
                    data={history}
                    keyExtractor={(i) => i.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={s.list}
                    ListEmptyComponent={
                        <Text style={s.emptyText}>
                            {loading ? "Loading..." : "No payment history yet."}
                        </Text>
                    }
                />
            </View>
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
    back: {
        ...typography.button,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    title: { ...typography.h2, color: colors.textPrimary },
    summaryBox: {
        backgroundColor: colors.primary,
        margin: spacing.xxl,
        padding: spacing.xxl,
        borderRadius: borderRadius.xl,
        ...shadows.md,
    },
    summaryLabel: {
        ...typography.small,
        color: "rgba(255,255,255,0.8)",
        marginBottom: spacing.xs,
    },
    summaryVal: { ...typography.h1, color: "#fff", marginBottom: spacing.xl },
    summaryCards: { flexDirection: "row", justifyContent: "space-between" },
    subCard: { flex: 1 },
    subLabel: { ...typography.captionMedium, color: "rgba(255,255,255,0.8)" },
    subVal: { ...typography.bodyMedium, color: "#fff", marginTop: 2 },
    listContainer: {
        flex: 1,
        backgroundColor: colors.bgPrimary,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
    },
    historyTitle: {
        ...typography.h4,
        color: colors.textPrimary,
        padding: spacing.xxl,
        paddingBottom: spacing.md,
    },
    list: { paddingHorizontal: spacing.xxl, paddingBottom: 40 },
    historyCard: {
        padding: spacing.lg,
        backgroundColor: colors.bgSecondary,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    histRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    histClient: { ...typography.bodyMedium, color: colors.textPrimary },
    histAmount: {
        ...typography.bodyMedium,
        color: colors.success,
        fontWeight: "700",
    },
    histRef: { ...typography.caption, color: colors.textMuted },
    histDate: { ...typography.caption, color: colors.textSecondary },
    emptyText: {
        ...typography.body,
        color: colors.textMuted,
        textAlign: "center",
        marginTop: spacing.xl,
    },
});
