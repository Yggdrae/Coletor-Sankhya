import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { lightTheme, darkTheme } from "@/src/theme/theme";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useThemeSwitcher } from "@/src/context/themeProvider";
import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiConfigProvider } from "../context/apiConfigProvider";
import { UserProvider } from "../context/userContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ApiConfigProvider>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <RootLayoutContent />
          </QueryClientProvider>
        </UserProvider>
      </ApiConfigProvider>
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const { theme } = useThemeSwitcher();

  return (
    <PaperProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <ThemedSafeAreaView>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="domainConfig/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="armazenagem/index" options={{ headerShown: false }} />
          <Stack.Screen name="conferencia/index" options={{ headerShown: false }} />
          <Stack.Screen name="recebimento/index" options={{ headerShown: false }} />
          <Stack.Screen name="separacao/index" options={{ headerShown: false }} />
          <Stack.Screen name="volume/index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemedSafeAreaView>
    </PaperProvider>
  );
}
