// app/domainConfig/index.tsx
import { StyleSheet, View } from "react-native";
import { Appbar, Button, Snackbar, Text, TextInput } from "react-native-paper";
import { ThemedView } from "@/src/components/ThemedView";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useApiConfig } from "@/src/context/apiConfigProvider";
import Toast from "react-native-toast-message";

export default function DomainConfig() {
  const { replace } = useRouter();

  const {
    domain: initialDomain,
    port: initialPort,
    isFirstConfig,
    saveDomain,
  } = useApiConfig();

  const [domain, setDomain] = useState<string>(initialDomain ?? "");
  const [port, setPort] = useState<string>(initialPort ?? "");

  const handleSaveConfig = async () => {
    if (!checkFields()) return;

    await saveDomain(domain, port);
    Toast.show({
      type: "success",
      text1: "Domínio salvo com sucesso!",
      position: "top",
      visibilityTime: 3000,
    });

    replace("/");
  };

  const checkFields = () => {
    if (!domain || !port) {
      Toast.show({
        type: "error",
        text1: "Há campos sem preenchimento!",
        position: "top",
        visibilityTime: 3000,
      });
      return false;
    }
    return true;
  };

  return (
    <ThemedView style={styles.container}>
      <Appbar>
        {!isFirstConfig && <Appbar.BackAction onPress={() => replace("/")} />}
      </Appbar>

      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.title}>
          {isFirstConfig && (
            <Text variant="titleMedium">
              Parece ser sua primeira vez no aplicativo!
            </Text>
          )}
          <Text variant="titleMedium">Configure o dominio do seu client.</Text>
        </ThemedView>

        <TextInput
          style={styles.input}
          placeholder="localhost"
          value={domain}
          onChangeText={setDomain}
        />
        <TextInput
          style={styles.input}
          placeholder="3333"
          value={port}
          onChangeText={setPort}
          keyboardType="numeric"
        />

        <View style={styles.buttonView}>
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleSaveConfig}
          >
            Salvar
          </Button>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    alignItems: "center",
    textAlign: "center",
  },
  input: {
    width: "90%",
    height: 50,
    alignSelf: "center",
  },
  buttonView: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 5,
  },
  button: {
    height: 42,
  },
});
