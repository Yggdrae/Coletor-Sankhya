import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { RelativePathString, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Text, Icon, Appbar } from "react-native-paper";

interface ConferenciaOperation {
  label: string;
  icon: string;
  path: string;
}

export default function ConferenciaMenu() {
  const { push, back } = useRouter();

  const operations: ConferenciaOperation[] = [
    {
      label: "Entrada",
      icon: "cube-send",
      path: "/recebimento/entrada",
    },
    {
      label: "Parcial de entrada",
      icon: "clipboard-list-outline",
      path: "/recebimento/entrada",
    },
    {
      label: "Peça",
      icon: "package-variant",
      path: "/recebimento/entrada",
    },
    {
      label: "Pedido",
      icon: "clipboard-text",
      path: "/recebimento/entrada",
    },
    {
      label: "Volumes",
      icon: "package",
      path: "/recebimento/entrada",
    },
    {
      label: "Saída",
      icon: "truck-delivery-outline",
      path: "/recebimento/entrada",
    },
  ];

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => back()} />
        <Appbar.Content title="Recebimento" />
      </Appbar>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {operations.map((operation) => (
          <Card
            key={operation.label}
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
