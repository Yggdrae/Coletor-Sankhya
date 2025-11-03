import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { ThemedView } from "@/src/components/ThemedView";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Modal,
  TextInput as RNTextInput,
} from "react-native";
import {
  Appbar,
  Card,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import BarcodeMask from "react-native-barcode-mask";

interface TarefaArmazenagem {
  produtoNome: string;
  produtoEAN: string;
  quantidade: number;
  origemAddr: string;
  destinoAddr: string;
}

const fetchProximaTarefa = (): Promise<TarefaArmazenagem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        produtoNome: "PRODUTO WMS 3",
        produtoEAN: "1",
        quantidade: 10,
        origemAddr: "01.05.01.01",
        destinoAddr: "01.02.04.02",
      });
    }, 1000);
  });
};

export default function TarefaArmazenagemScreen() {
  const { back } = useRouter();

  const [tarefa, setTarefa] = useState<TarefaArmazenagem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [etapa, setEtapa] = useState<"PEGAR" | "LEVAR">("PEGAR");

  const [enderecoLido, setEnderecoLido] = useState("");
  const [produtoLido, setProdutoLido] = useState("");

  const origemRef = useRef<RNTextInput>(null);
  const produtoRef = useRef<RNTextInput>(null);
  const destinoRef = useRef<RNTextInput>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchProximaTarefa().then((data) => {
      setTarefa(data);
      setIsLoading(false);
      setTimeout(() => origemRef.current?.focus(), 100);
    });
  }, []);

  const handleConfirmaOrigem = (value: string = enderecoLido) => {
    if (!tarefa) return;
    if (value.trim() !== tarefa.origemAddr) {
      Alert.alert("Erro", "Endereço de origem incorreto!");
      return;
    }
    produtoRef.current?.focus();
  };

  const handleConfirmaProduto = (value: string = produtoLido) => {
    if (!tarefa) return;
    if (value.trim() !== tarefa.produtoEAN) {
      Alert.alert("Erro", "Produto incorreto!");
      return;
    }
    Alert.alert("Sucesso", "Produto coletado. Agora, leve ao destino.");
    setEtapa("LEVAR");
    setEnderecoLido("");
    setProdutoLido("");
    setTimeout(() => destinoRef.current?.focus(), 100);
  };

  const handleConfirmaDestino = (value: string = enderecoLido) => {
    if (!tarefa) return;
    if (value.trim() !== tarefa.destinoAddr) {
      Alert.alert("Erro", "Endereço de destino incorreto!");
      return;
    }
    Alert.alert("Sucesso!", "Armazenado com sucesso.", [
      { text: "OK", onPress: () => back() },
    ]);
  };

  const openScanner = async () => {
    if (!permission) return;

    if (!permission.granted) {
      const { status } = await requestPermission();
      if (status === "granted") {
        setIsScanning(true);
      } else {
        Alert.alert(
          "Permissão negada",
          "Precisamos da permissão da câmera para escanear."
        );
      }
    } else {
      setIsScanning(true);
    }
  };

  const handleScan = (data: BarcodeScanningResult) => {
    if (!data.raw) return;

    const scannedData = data.raw;
    setIsScanning(false); // Fecha o modal

    if (etapa === "PEGAR") {
      if (origemRef.current?.isFocused()) {
        setEnderecoLido(scannedData);
        handleConfirmaOrigem(scannedData);
      } else if (produtoRef.current?.isFocused()) {
        setProdutoLido(scannedData);
        handleConfirmaProduto(scannedData);
      }
    } else if (etapa === "LEVAR") {
      if (destinoRef.current?.isFocused()) {
        setEnderecoLido(scannedData);
        handleConfirmaDestino(scannedData);
      }
    }
  };

  if (isLoading || !tarefa) {
    return (
      <ThemedSafeAreaView>
        <Appbar>
          <Appbar.BackAction onPress={() => back()} />
          <Appbar.Content title="Buscando Tarefa..." />
        </Appbar>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator animating={true} size="large" />
          <Text>Buscando próxima tarefa...</Text>
        </ThemedView>
      </ThemedSafeAreaView>
    );
  }

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => back()} />
        <Appbar.Content title="Executar Tarefa" />
      </Appbar>
      <ThemedView style={styles.container}>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="headlineSmall" style={styles.header}>
              {etapa === "PEGAR" ? "Fase 1: Pegue" : "Fase 2: Leve para"}
            </Text>
            {etapa === "PEGAR" && (
              <>
                <Text variant="bodyLarge">Produto: {tarefa.produtoNome}</Text>
                <Text variant="bodyLarge">Qtd: {tarefa.quantidade} UN</Text>
                <Text variant="bodyLarge" style={styles.enderecoDestaque}>
                  Origem: {tarefa.origemAddr}
                </Text>
              </>
            )}
            {etapa === "LEVAR" && (
              <Text variant="bodyLarge" style={styles.enderecoDestaque}>
                Destino: {tarefa.destinoAddr}
              </Text>
            )}
          </Card.Content>
        </Card>

        <ThemedView style={styles.inputsContainer}>
          {etapa === "PEGAR" ? (
            <>
              <TextInput
                ref={origemRef}
                label="Confirmar Endereço de Origem"
                value={enderecoLido}
                onChangeText={setEnderecoLido}
                mode="outlined"
                style={styles.input}
                onSubmitEditing={() => handleConfirmaOrigem()}
                blurOnSubmit={false}
                right={
                  <TextInput.Icon icon="barcode-scan" onPress={openScanner} />
                }
              />
              <TextInput
                ref={produtoRef}
                label="Confirmar Produto (EAN)"
                value={produtoLido}
                onChangeText={setProdutoLido}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                onSubmitEditing={() => handleConfirmaProduto()}
                right={
                  <TextInput.Icon icon="barcode-scan" onPress={openScanner} />
                }
              />
            </>
          ) : (
            <TextInput
              ref={destinoRef}
              label="Confirmar Endereço de Destino"
              value={enderecoLido}
              onChangeText={setEnderecoLido}
              mode="outlined"
              style={styles.input}
              onSubmitEditing={() => handleConfirmaDestino()}
              right={
                <TextInput.Icon icon="barcode-scan" onPress={openScanner} />
              }
            />
          )}
        </ThemedView>
      </ThemedView>

      <Modal
        visible={isScanning}
        onRequestClose={() => setIsScanning(false)}
        animationType="slide"
      >
        <ThemedView style={styles.scannerContainer}>
          <Appbar>
            <Appbar.BackAction onPress={() => setIsScanning(false)} />
            <Appbar.Content title="Escanear Código" />
          </Appbar>
          <CameraView
            style={styles.camera}
            facing={"back"}
            onBarcodeScanned={handleScan}
          >
            <BarcodeMask edgeColor="#6200ee" showAnimatedLine={true} />
          </CameraView>
        </ThemedView>
      </Modal>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  card: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  enderecoDestaque: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 18,
  },
  inputsContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: "transparent",
  },
  scannerContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});
