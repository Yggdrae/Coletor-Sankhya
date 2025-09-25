import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { ReactNode } from "react";

export function ThemedSafeAreaView({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      {children}
    </SafeAreaView>
  );
}