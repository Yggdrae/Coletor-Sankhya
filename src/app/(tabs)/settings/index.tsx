import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { ThemedView } from "@/src/components/ThemedView";
import { useThemeSwitcher } from "@/src/context/themeProvider";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { StyleSheet, TextInput as RNTextInput } from "react-native";
import {
  Avatar,
  Button,
  List,
  Switch,
} from "react-native-paper";

export default function Settings() {
  const { replace } = useRouter();
  const { theme, toggleTheme } = useThemeSwitcher();

  const isDarkTheme = theme === "dark";

  const logout = () => {
    replace("/");
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.profileSection}>
          <Avatar.Icon icon="account" size={100} />
        </ThemedView>

        <List.Section>
          <List.Subheader>Preferências</List.Subheader>
          <List.Item
            title="Tema"
            description={isDarkTheme ? "Escuro" : "Claro"}
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => (
              <Switch value={isDarkTheme} onValueChange={toggleTheme} />
            )}
          />
        </List.Section>
      </ThemedView>
      <ThemedView style={styles.logoutSection}>
        <Button mode="contained" icon="logout" onPress={logout}>
          Logout
        </Button>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  textInputAnchor: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 4,
  },
  logoutSection: {
    padding: 24,
  },
});
