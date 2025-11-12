import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { useUser } from "@/src/context/userContext";
import { RelativePathString, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Text, Icon, Appbar } from "react-native-paper";

interface Operation {
  label: string;
  path: string;
  icon: string;
}

export default function Home() {
  const { push } = useRouter();
  const { userName } = useUser();

  const operations: Operation[] = [
    {
      label: "Armazenagem",
      icon: "warehouse",
      path: "/armazenagem",
    },
    {
      label: "Conferência",
      icon: "clipboard-text-search",
      path: "/conferencia",
    },
    {
      label: "Conferência de Volume",
      icon: "package-variant-closed-check",
      path: "/volume",
    },
    {
      label: "Recebimento",
      icon: "inbox-arrow-down",
      path: "/recebimento",
    },
    {
      label: "Separação",
      icon: "cart-arrow-down",
      path: "/separacao",
    },
  ];

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.Content title={`Olá, ${userName === "" ? "Usuário" : userName}`} />
      </Appbar>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {operations.length > 0 &&
          operations.map((operation) => (
            <Card
              key={operation.path}
              onPress={() => push(operation.path as RelativePathString)}
              style={styles.card}
              mode="elevated"
            >
              <Card.Content style={styles.cardContent}>
                <Icon source={operation.icon} size={32} />
                <Text variant="titleMedium" style={styles.labelText}>
                  {operation.label}
                </Text>
              </Card.Content>
            </Card>
          ))}
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 16,
    gap: 16,
  },
  card: {
    width: "45%",
    height: 120,
    justifyContent: "center",
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  labelText: {
    textAlign: "center",
  },
});
