import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { RelativePathString, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Text, Icon, Appbar } from "react-native-paper";

interface ArmazenagemOperation {
  label: string;
  tipo: string;
  icon: string;
}

export default function ArmazenagemMenu() {
  const { push, back } = useRouter();

  const operations: ArmazenagemOperation[] = [
    {
      label: "Armazenagem",
      icon: "package-up",
      tipo: "padrao",
    },
    {
      label: "Armazenagem Seletiva",
      icon: "package-up",
      tipo: "seletiva",
    },
    {
      label: "Armazenagem Expressa",
      icon: "package-up",
      tipo: "expressa",
    },
  ];

  const handleNavigate = (tipo: string) => {
    push({
      pathname: "/armazenagem/tarefa",
      params: { tipoTarefa: tipo },
    });
  };

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => back()} />
        <Appbar.Content title="Armazenagem" />
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
