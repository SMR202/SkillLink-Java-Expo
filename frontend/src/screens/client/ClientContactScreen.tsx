import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import GradientButton from "../../components/GradientButton";
import { clientApi } from "../../api/clients";
import { Address } from "../../types";
import { useAuthStore } from "../../store/authStore";

export default function ClientContactScreen({ navigation }: any) {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [savingContact, setSavingContact] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [addresses, setAddresses] = useState<Address[]>([]);

    const [label, setLabel] = useState("Home");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [isPrimary, setIsPrimary] = useState(false);

    const isClient = user?.role === "CLIENT";

    useEffect(() => {
        if (isClient) {
            loadProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const profile = await clientApi.getMyProfile();
            setPhoneNumber(profile.phoneNumber || "");
            setAddresses(profile.addresses || []);
        } catch (e: any) {
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Could not load contact details.",
            );
        } finally {
            setLoading(false);
        }
    };

    const saveContact = async () => {
        if (!/^\d{11}$/.test(phoneNumber)) {
            Alert.alert(
                "Validation",
                "Phone number must be exactly 11 digits.",
            );
            return;
        }

        setSavingContact(true);
        try {
            const profile = await clientApi.updateContact(phoneNumber);
            setPhoneNumber(profile.phoneNumber || "");
            Alert.alert("Success", "Contact updated successfully.");
        } catch (e: any) {
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Could not update contact.",
            );
        } finally {
            setSavingContact(false);
        }
    };

    const addAddress = async () => {
        if (!streetAddress.trim()) {
            Alert.alert("Validation", "Street address is required.");
            return;
        }

        setSavingAddress(true);
        try {
            const profile = await clientApi.addAddress({
                label: label.trim() || "Address",
                streetAddress: streetAddress.trim(),
                city: city.trim() || undefined,
                area: area.trim() || undefined,
                isPrimary,
            });
            setAddresses(profile.addresses || []);
            setStreetAddress("");
            setCity("");
            setArea("");
            setIsPrimary(false);
            Alert.alert("Success", "Address added successfully.");
        } catch (e: any) {
            Alert.alert(
                "Error",
                e?.response?.data?.message || "Could not add address.",
            );
        } finally {
            setSavingAddress(false);
        }
    };

    if (!isClient) {
        return (
            <View style={s.container}>
                <StatusBar barStyle="dark-content" />
                <View style={s.centeredWrap}>
                    <Text style={s.title}>Manage Addresses</Text>
                    <Text style={s.helperText}>
                        Address management is only available for client
                        accounts.
                    </Text>
                    <GradientButton
                        title="Go Back"
                        onPress={() => navigation.goBack()}
                        style={{ marginTop: spacing.lg }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={s.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={s.scroll}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={s.back}>← Back</Text>
                </TouchableOpacity>

                <Text style={s.title}>Contact & Addresses</Text>

                <Text style={s.section}>Phone Number</Text>
                <TextInput
                    style={s.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="03001234567"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="phone-pad"
                    editable={!loading && !savingContact}
                />
                <GradientButton
                    title="Save Contact"
                    onPress={saveContact}
                    loading={savingContact}
                    style={{ marginTop: spacing.md }}
                />

                <Text style={[s.section, { marginTop: spacing.xxl }]}>
                    Saved Addresses
                </Text>
                {(addresses || []).length === 0 ? (
                    <Text style={s.helperText}>
                        {loading
                            ? "Loading addresses..."
                            : "No saved addresses yet."}
                    </Text>
                ) : (
                    addresses.map((addr) => (
                        <View key={addr.id} style={s.addressCard}>
                            <Text style={s.addressLabel}>
                                {addr.label || "Address"}
                                {addr.isPrimary ? " (Primary)" : ""}
                            </Text>
                            <Text style={s.addressLine}>
                                {addr.streetAddress}
                            </Text>
                            <Text style={s.addressLine}>
                                {[addr.area, addr.city]
                                    .filter(Boolean)
                                    .join(", ") || "No city/area provided"}
                            </Text>
                        </View>
                    ))
                )}

                <Text style={[s.section, { marginTop: spacing.xxl }]}>
                    Add New Address
                </Text>
                <TextInput
                    style={s.input}
                    value={label}
                    onChangeText={setLabel}
                    placeholder="Label (Home/Office)"
                    placeholderTextColor={colors.textMuted}
                />
                <TextInput
                    style={[s.input, { marginTop: spacing.sm }]}
                    value={streetAddress}
                    onChangeText={setStreetAddress}
                    placeholder="Street address"
                    placeholderTextColor={colors.textMuted}
                />
                <TextInput
                    style={[s.input, { marginTop: spacing.sm }]}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                    placeholderTextColor={colors.textMuted}
                />
                <TextInput
                    style={[s.input, { marginTop: spacing.sm }]}
                    value={area}
                    onChangeText={setArea}
                    placeholder="Area"
                    placeholderTextColor={colors.textMuted}
                />

                <TouchableOpacity
                    style={s.checkboxRow}
                    onPress={() => setIsPrimary(!isPrimary)}
                >
                    <View style={[s.checkbox, isPrimary && s.checkboxActive]} />
                    <Text style={s.checkboxLabel}>Set as primary address</Text>
                </TouchableOpacity>

                <GradientButton
                    title="Add Address"
                    onPress={addAddress}
                    loading={savingAddress}
                    variant="accent"
                    style={{ marginTop: spacing.md, marginBottom: spacing.xxl }}
                />
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
    section: {
        ...typography.h4,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.bgInput,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: 14,
        color: colors.textPrimary,
        ...typography.body,
        borderWidth: 1,
        borderColor: colors.border,
    },
    helperText: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    addressCard: {
        padding: spacing.lg,
        backgroundColor: colors.bgSecondary,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
    },
    addressLabel: { ...typography.smallMedium, color: colors.textPrimary },
    addressLine: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: 2,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.md,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing.sm,
        backgroundColor: "#FFF",
    },
    checkboxActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    checkboxLabel: { ...typography.small, color: colors.textSecondary },
    centeredWrap: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.xxl,
    },
});
