import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { authApi } from "../../api/auth";
import GradientButton from "../../components/GradientButton";

export default function ChangePasswordScreen({ navigation }: any) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Validation", "Please fill all password fields.");
            return false;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert(
                "Validation",
                "New password and confirm password do not match.",
            );
            return false;
        }

        if (newPassword.length < 8) {
            Alert.alert(
                "Validation",
                "New password must be at least 8 characters.",
            );
            return false;
        }

        if (!/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
            Alert.alert(
                "Validation",
                "Password must include at least one number and one special character.",
            );
            return false;
        }

        if (newPassword === currentPassword) {
            Alert.alert(
                "Validation",
                "New password must be different from current password.",
            );
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await authApi.changePassword(currentPassword, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            Alert.alert("Success", "Password updated successfully.");
            navigation.goBack();
        } catch (e: any) {
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Could not change password.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={s.back}>← Back</Text>
            </TouchableOpacity>

            <Text style={s.title}>Change Password</Text>
            <Text style={s.subtitle}>
                Use a strong password with letters and numbers.
            </Text>

            <Text style={s.label}>Current Password</Text>
            <View style={s.inputWrap}>
                <TextInput
                    style={s.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrent}
                    placeholder="Current password"
                    placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity onPress={() => setShowCurrent((v) => !v)}>
                    <Text style={s.toggle}>
                        {showCurrent ? "Hide" : "Show"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={s.label}>New Password</Text>
            <View style={s.inputWrap}>
                <TextInput
                    style={s.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNew}
                    placeholder="New password"
                    placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity onPress={() => setShowNew((v) => !v)}>
                    <Text style={s.toggle}>{showNew ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
            </View>

            <Text style={s.label}>Confirm New Password</Text>
            <View style={s.inputWrap}>
                <TextInput
                    style={s.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirm}
                    placeholder="Confirm new password"
                    placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
                    <Text style={s.toggle}>
                        {showConfirm ? "Hide" : "Show"}
                    </Text>
                </TouchableOpacity>
            </View>

            <GradientButton
                title="Update Password"
                onPress={handleChangePassword}
                loading={loading}
                style={{ marginTop: spacing.xl }}
            />
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgPrimary,
        paddingHorizontal: spacing.xxl,
        paddingTop: 54,
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
    label: {
        ...typography.smallMedium,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        backgroundColor: colors.bgInput,
        paddingHorizontal: spacing.md,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        ...typography.body,
        paddingVertical: 14,
    },
    toggle: { ...typography.captionMedium, color: colors.accent },
});
