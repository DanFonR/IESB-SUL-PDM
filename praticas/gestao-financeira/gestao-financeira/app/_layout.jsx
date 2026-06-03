import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import colors from "../constants/colors";
import GlobalState, { MoneyContext } from "../contexts/GlobalState";
import { useContext, useEffect } from "react";

function AuthGuard({ children }) {
    const { loading, user } = useContext(MoneyContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading)
            router.replace((user)? "/(tabs)" : "/login");
    }, [router, user, loading]);

    return children;
}

export default function RootLayout() {
    return (
        <GlobalState>
            <StatusBar backgroundColor={colors.primary} style="light" />
            <AuthGuard>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                    <Stack.Screen name="register" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </AuthGuard>
        </GlobalState>
    );
}
