import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { ThemedView } from "@/src/components/ThemedView";
import { RelativePathString, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Appbar, Card, Icon, Text } from "react-native-paper";

interface ExpedicaoOperation {
  label: string;
  icon: string;
  path: string;
}

export default function Expedicao() {
  const { push, back } = useRouter();

  const operations: ExpedicaoOperation[] = [
    {
      label: "Conferir Pedido",
      icon: "clipboard-check-outline",
      path: "/expedicao/conferenciaPedido",
    },
    {
      label: "Conferir Volume",
      icon: "package-variant-closed-check",
      path: "/expedicao/conferenciaVolume",
    },
  ];

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => back()} />
        <Appbar.Content title="Expedição" />
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
