import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { ThemedView } from "@/src/components/ThemedView";
import { useThemeSwitcher } from "@/src/context/themeProvider";
import { useState, useRef } from "react";
import { StyleSheet, TextInput as RNTextInput } from "react-native";
import {
  Avatar,
  Divider,
  List,
  Menu,
  Switch,
  TextInput,
} from "react-native-paper";

const EQUIPMENTS = [
  "Empilhadeira A-01",
  "Empilhadeira A-02",
  "Paleteira Elétrica P-05",
  "Coletor de Dados C-12",
];

export default function Settings() {
  const { theme, toggleTheme } = useThemeSwitcher();

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );

  const textInputRef = useRef<RNTextInput | null>(null);

  const isDarkTheme = theme === "dark";

  const handleSelectEquipment = (equipment: string | null) => {
    setSelectedEquipment(equipment);

    textInputRef.current?.blur(); /* 
    closeMenu(); */
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

        <List.Section>
          <List.Subheader>Equipamento em Uso</List.Subheader>

          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchorPosition="bottom"
            anchor={
              <TextInput
                ref={textInputRef}
                label="Equipamento"
                mode="outlined"
                value={selectedEquipment ?? ""}
                pointerEvents="none"
                right={
                  <TextInput.Icon
                    icon={menuVisible ? "menu-up" : "menu-down"}
                  />
                }
                onFocus={openMenu}
                onBlur={closeMenu}
                style={styles.textInputAnchor}
              />
            }
          >
            {EQUIPMENTS.map((equipment) => (
              <Menu.Item
                key={equipment}
                onPress={() => handleSelectEquipment(equipment)}
                title={equipment}
                leadingIcon="forklift"
              />
            ))}

            <Divider style={styles.divider} />
            <Menu.Item
              onPress={() => handleSelectEquipment(null)}
              title="Nenhum"
              leadingIcon="cancel"
            />
          </Menu>
        </List.Section>
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
});
