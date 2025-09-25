import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { lightTheme, darkTheme } from "@/app/theme/theme";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useThemeSwitcher } from "@/app/context/themeProvider";
import { ThemedSafeAreaView } from "@/app/components/ThemedSafeArea"; // Importe o novo componente

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
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemedSafeAreaView>
    </PaperProvider>
  );
}