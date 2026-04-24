import React from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Alert,
    Linking,
    ScrollView,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { useAuthStore } from "../../store/authStore";

export default function HelpSupportScreen({ navigation }: any) {
    const user = useAuthStore((s) => s.user);

    const openEmail = async () => {
        const subject = encodeURIComponent("SkillLink Support Request");
        const body = encodeURIComponent(
            `Hello SkillLink Team,%0D%0A%0D%0AMy account role: ${user?.role || "UNKNOWN"}%0D%0AEmail: ${user?.email || ""}%0D%0A%0D%0AI need help with:`,
        );
        const url = `mailto:support@skilllink.app?subject=${subject}&body=${body}`;

        try {
            const canOpen = await Linking.canOpenURL(url);
            if (!canOpen) {
                Alert.alert(
                    "Support",
                    "No email app is configured on this device.",
                );
                return;
            }
            await Linking.openURL(url);
        } catch {
            Alert.alert("Support", "Could not open email app.");
        }
    };

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={s.scroll}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={s.back}>← Back</Text>
                </TouchableOpacity>

                <Text style={s.title}>Help & Support</Text>
                <Text style={s.subtitle}>
                    Get help quickly and report issues with all booking details
                    included.
                </Text>

                <View style={s.card}>
                    <Text style={s.cardTitle}>Need account help?</Text>
                    <Text style={s.cardText}>
                        Use the button below to contact support with your role
                        and account email prefilled.
                    </Text>
                    <TouchableOpacity style={s.primaryBtn} onPress={openEmail}>
                        <Text style={s.primaryBtnText}>
                            Contact Support by Email
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={s.card}>
                    <Text style={s.cardTitle}>Common quick answers</Text>
                    <Text style={s.faqItem}>
                        • Booking pending too long: message the provider from
                        your booking chat.
                    </Text>
                    <Text style={s.faqItem}>
                        • Payment failed: retry checkout and confirm
                        card/network details.
                    </Text>
                    <Text style={s.faqItem}>
                        • Wrong profile info: update details from profile
                        settings.
                    </Text>
                    <Text style={s.faqItem}>
                        • Security concern: immediately change your password.
                    </Text>
                </View>
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
    title: { ...typography.h2, color: colors.textPrimary },
    subtitle: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: 4,
        marginBottom: spacing.xl,
    },
    card: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.bgSecondary,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    cardTitle: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    cardText: {
        ...typography.small,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    primaryBtn: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: 12,
        alignItems: "center",
    },
    primaryBtnText: { ...typography.button, color: "#FFF" },
    faqItem: {
        ...typography.small,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        lineHeight: 20,
    },
});
