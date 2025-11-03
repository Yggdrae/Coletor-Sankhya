import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { RelativePathString, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Text, Icon, Appbar } from "react-native-paper";

interface SeparacaoOperation {
  label: string;
  icon: string;
  tipo: string;
}

export default function SeparacaoMenu() {
  const { push, back } = useRouter();

  const operations: SeparacaoOperation[] = [
    {
      label: "Separação",
      icon: "package-variant-closed",
      tipo: "padrao",
    },
    {
      label: "Separação Balcão",
      icon: "storefront-outline",
      tipo: "balcao",
    },
    {
      label: "Separação por Área",
      icon: "view-grid-outline",
      tipo: "area",
    },
    {
      label: "Separação por Esteira",
      icon: "swap-horizontal",
      tipo: "esteira",
    },
  ];

  const handleNavigate = (tipo: string) => {
    push({
      pathname: "/separacao/tarefa" as RelativePathString,
      params: { tipoTarefa: tipo },
    });
  };

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => back()} />
        <Appbar.Content title="Separação" />
      </Appbar>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {operations.map((operation) => (
          <Card
            key={operation.label}
            onPress={() => handleNavigate(operation.tipo)}
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
