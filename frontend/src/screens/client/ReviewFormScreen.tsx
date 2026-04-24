import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    StatusBar,
    ScrollView,
    Alert,
} from "react-native";
import {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
} from "../../theme";
import { reviewApi } from "../../api/reviews";
import GradientButton from "../../components/GradientButton";

export default function ReviewFormScreen({ route, navigation }: any) {
    const { bookingId, providerName } = route.params || {};
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const isValid = rating >= 1 && comment.length >= 20;

    const handleSubmit = async () => {
        if (!isValid) return;
        setLoading(true);
        try {
            await reviewApi.submit({ bookingId, rating, reviewText: comment });
            setSubmitted(true);
        } catch (e: any) {
            Alert.alert(
                "Error",
                e.response?.data?.message || "Failed to submit review",
            );
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <View style={s.container}>
                <StatusBar barStyle="dark-content" />
                <View style={s.successWrap}>
                    <Text style={{ fontSize: 56 }}>✅</Text>
                    <Text style={s.successTitle}>Review Submitted!</Text>
                    <Text style={s.successSub}>
                        Thank you for your feedback
                    </Text>
                    <GradientButton
                        title="Back to Bookings"
                        onPress={() => navigation.goBack()}
                        style={{ marginTop: spacing.xl, width: "100%" }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <View style={s.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={s.back}>← Back</Text>
                </Pressable>
                <Text style={s.title}>Leave a Review</Text>
            </View>
            <ScrollView contentContainerStyle={s.content}>
                <View style={s.providerCard}>
                    <View style={s.avatar}>
                        <Text style={s.avatarText}>
                            {providerName?.[0]?.toUpperCase() || "?"}
                        </Text>
                    </View>
                    <Text style={s.providerName}>
                        {providerName || "Service Provider"}
                    </Text>
                </View>

                <Text style={s.label}>Rating</Text>
                <View style={s.stars}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Pressable
                            key={i}
                            onPress={() => setRating(i)}
                            style={s.starBtn}
                        >
                            <Text style={[s.star, i <= rating && s.starActive]}>
                                {i <= rating ? "★" : "☆"}
                            </Text>
                        </Pressable>
                    ))}
                </View>
                {rating > 0 && (
                    <Text style={s.ratingLabel}>
                        {
                            [
                                "",
                                "Poor",
                                "Fair",
                                "Good",
                                "Very Good",
                                "Excellent",
                            ][rating]
                        }
                    </Text>
                )}

                <Text style={[s.label, { marginTop: spacing.xl }]}>
                    Your Review
                </Text>
                <TextInput
                    style={s.input}
                    placeholder="Share your experience (min 20 characters)..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={5}
                    maxLength={1000}
                    value={comment}
                    onChangeText={setComment}
                    textAlignVertical="top"
                />
                <Text
                    style={[
                        s.counter,
                        comment.length < 20 && { color: colors.error },
                    ]}
                >
                    {comment.length}/1000 (min 20)
                </Text>

                <GradientButton
                    title="Submit Review"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!isValid}
                    variant="accent"
                    style={{ marginTop: spacing.xl }}
                />
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
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    back: {
        ...typography.small,
        color: colors.accent,
        marginBottom: spacing.sm,
    },
    title: { ...typography.h2, color: colors.textPrimary },
    content: { padding: spacing.xxl, paddingBottom: 100 },
    providerCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        backgroundColor: colors.bgCard,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.xl,
        ...shadows.sm,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.accent,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { ...typography.bodyMedium, color: "#FFF", fontWeight: "700" },
    providerName: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
        fontWeight: "600",
    },
    label: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
        fontWeight: "600",
        marginBottom: spacing.sm,
    },
    stars: {
        flexDirection: "row",
        gap: spacing.md,
        justifyContent: "center",
        paddingVertical: spacing.md,
    },
    starBtn: { padding: spacing.xs },
    star: { fontSize: 40, color: colors.border },
    starActive: { color: colors.star },
    ratingLabel: {
        ...typography.small,
        color: colors.star,
        textAlign: "center",
        fontWeight: "600",
    },
    input: {
        backgroundColor: colors.bgInput,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        minHeight: 120,
        ...typography.body,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    counter: {
        ...typography.caption,
        color: colors.textMuted,
        textAlign: "right",
        marginTop: spacing.xs,
    },
    successWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xxl,
    },
    successTitle: {
        ...typography.h2,
        color: colors.textPrimary,
        marginTop: spacing.lg,
    },
    successSub: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
});
