import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { lightTheme, darkTheme } from "@/src/theme/theme";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useThemeSwitcher } from "@/src/context/themeProvider";
import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea"; 

export default function RootLayout() {

  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const { theme } = useThemeSwitcher();

  return (
    <PaperProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <ThemedSafeAreaView>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="domainConfig/index" options={{ headerShown: false }} />
          <Stack.Screen name="scanner/index" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemedSafeAreaView>
    </PaperProvider>
  );
}