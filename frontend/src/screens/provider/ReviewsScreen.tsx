import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { reviewApi } from "../../api/reviews";
import { Review } from "../../types";
import { useAuthStore } from "../../store/authStore";

export default function ReviewsScreen() {
    const navigation = useNavigation<any>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Assuming we can get current provider reviews from authStore, but reviewApi
    // either needs providerId or there is an endpoint like GET /api/reviews/me
    // Let's assume reviewApi has getForMe or we get our ID. Actually, reviewApi.getForProvider requires ID.
    // Let's fetch from the backend. The API might not have getForMe, so let's read auth store instance to get ID.

    const { user } = useAuthStore();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const r = await reviewApi.getForProvider(user.id);
            setReviews(r.data?.content || []);
        } catch (e: any) {
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Failed to load reviews",
            );
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Review }) => (
        <View style={s.card}>
            <View style={s.cardTop}>
                <View style={s.av}>
                    <Text style={s.avT}>{item.clientName?.[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={s.name}>{item.clientName}</Text>
                    <Text style={s.date}>
                        ⭐ {item.rating} •{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>
            <Text style={s.comment}>{item.comment}</Text>
        </View>
    );

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={s.back}>← Back</Text>
                </TouchableOpacity>
                <Text style={s.title}>My Reviews</Text>
            </View>

            <FlatList
                data={reviews}
                renderItem={renderItem}
                keyExtractor={(i) => i.id.toString()}
                contentContainerStyle={s.list}
                ListEmptyComponent={
                    <Text style={s.empty}>
                        {loading ? "Loading..." : "No reviews yet."}
                    </Text>
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
    back: {
        ...typography.button,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    title: { ...typography.h2, color: colors.textPrimary },
    list: { padding: spacing.xxl },
    card: {
        backgroundColor: colors.bgCard,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.md,
    },
    av: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.bgInput,
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
    },
    avT: { ...typography.bodyMedium, fontWeight: "600" },
    name: { ...typography.bodyMedium, color: colors.textPrimary },
    date: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
    comment: { ...typography.small, color: colors.textSecondary },
    empty: { textAlign: "center", ...typography.body, color: colors.textMuted },
});
