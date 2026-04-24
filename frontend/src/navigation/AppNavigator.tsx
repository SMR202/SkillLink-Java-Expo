import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import AuthStack from "./AuthStack";
import ClientTabs from "./ClientTabs";
import ProviderTabs from "./ProviderTabs";
import AdminTabs from "./AdminTabs";
import ProviderProfileScreen from "../screens/client/ProviderProfileScreen";
import BookingFormScreen from "../screens/client/BookingFormScreen";
import ReviewFormScreen from "../screens/client/ReviewFormScreen";
import CheckoutScreen from "../screens/client/CheckoutScreen";
import ChatScreen from "../screens/shared/ChatScreen";
import ProfileSettingsScreen from "../screens/shared/ProfileSettingsScreen";
import ClientContactScreen from "../screens/client/ClientContactScreen";
import NotificationsHubScreen from "../screens/shared/NotificationsHubScreen";
import ChangePasswordScreen from "../screens/shared/ChangePasswordScreen";
import HelpSupportScreen from "../screens/shared/HelpSupportScreen";
import EarningsScreen from "../screens/provider/EarningsScreen";
import ReviewsScreen from "../screens/provider/ReviewsScreen";
import PostJobScreen from "../screens/client/PostJobScreen";
import SubmitProposalScreen from "../screens/provider/SubmitProposalScreen";
import { useAuthStore } from "../store/authStore";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.bgDark },
                }}
            >
                {!isAuthenticated ? (
                    <Stack.Screen name="Auth" component={AuthStack} />
                ) : user?.role === "ADMIN" ? (
                    <>
                        <Stack.Screen name="AdminMain" component={AdminTabs} />
                        <Stack.Screen
                            name="NotificationsHub"
                            component={NotificationsHubScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="ChangePassword"
                            component={ChangePasswordScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="HelpSupport"
                            component={HelpSupportScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                    </>
                ) : user?.role === "PROVIDER" ? (
                    <>
                        <Stack.Screen
                            name="ProviderMain"
                            component={ProviderTabs}
                        />
                        <Stack.Screen
                            name="ProfileSettings"
                            component={ProfileSettingsScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="NotificationsHub"
                            component={NotificationsHubScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="ChangePassword"
                            component={ChangePasswordScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="HelpSupport"
                            component={HelpSupportScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="Chat"
                            component={ChatScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="Earnings"
                            component={EarningsScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="Reviews"
                            component={ReviewsScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="SubmitProposal"
                            component={SubmitProposalScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="ClientMain"
                            component={ClientTabs}
                        />
                        <Stack.Screen
                            name="ProviderProfile"
                            component={ProviderProfileScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="BookingForm"
                            component={BookingFormScreen}
                            options={{
                                animation: "slide_from_bottom",
                                presentation: "modal",
                            }}
                        />
                        <Stack.Screen
                            name="ReviewForm"
                            component={ReviewFormScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="Checkout"
                            component={CheckoutScreen}
                            options={{
                                animation: "slide_from_bottom",
                                presentation: "modal",
                            }}
                        />
                        <Stack.Screen
                            name="Chat"
                            component={ChatScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="ClientContact"
                            component={ClientContactScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="NotificationsHub"
                            component={NotificationsHubScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="ChangePassword"
                            component={ChangePasswordScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="HelpSupport"
                            component={HelpSupportScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="PostJob"
                            component={PostJobScreen}
                            options={{ animation: "slide_from_bottom", presentation: "modal" }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.bgDark,
    },
});
