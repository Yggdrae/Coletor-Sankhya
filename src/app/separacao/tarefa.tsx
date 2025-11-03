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
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import BarcodeMask from "react-native-barcode-mask";

interface TarefaSeparacao {
  produtoNome: string;
  produtoEAN: string;
  quantidade: number;
  origemAddr: string;
  destinoAddr: string;
  oc: string;
  pedido: string;
}

const fetchProximaTarefa = (tipo: string): Promise<TarefaSeparacao> => {
  console.log("Buscando tarefa de separação tipo:", tipo);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        produtoNome: "PRODUTO WMS 1",
        produtoEAN: "7601002005000",
        quantidade: 10,
        origemAddr: "01.01.01.01",
        destinoAddr: "01.07.02",
        oc: "50",
        pedido: "72",
      });
    }, 1000);
  });
};

export default function TarefaSeparacaoScreen() {
  const { back } = useRouter();
  const theme = useTheme();
  const { tipoTarefa } = useLocalSearchParams<{ tipoTarefa: string }>();

  const [tarefa, setTarefa] = useState<TarefaSeparacao | null>(null);
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
    if (!tipoTarefa) return;
    setIsLoading(true);
    fetchProximaTarefa(tipoTarefa).then((data) => {
      setTarefa(data);
      setIsLoading(false);
      setTimeout(() => origemRef.current?.focus(), 100);
    });
  }, [tipoTarefa]);

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
    Alert.alert("Sucesso!", "Separação concluída.", [
      { text: "OK", onPress: () => back() },
    ]);
  };

  const openScanner = async () => {
    if (!permission) return;
    if (!permission.granted) {
      const { status } = await requestPermission();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos da permissão da câmera.");
        return;
      }
    }
    setIsScanning(true);
  };

  const handleScan = (data: BarcodeScanningResult) => {
    if (!data.raw) return;
    const scannedData = data.raw;
    setIsScanning(false);

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

  const pickTitleName = () => {
    switch (tipoTarefa) {
      case "padrao":
        return "";
      case "balcao":
        return " - Balcão";
      case "area":
        return " - Área";
      case "esteira":
        return " - Esteira";
    }
  };

  if (isLoading || !tarefa) {
    return (
      <ThemedSafeAreaView>
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
        <Appbar.Content title={`Separação${pickTitleName()}`} />
        <Appbar.BackAction onPress={() => back()} />
      </Appbar>
      <ThemedView style={styles.container}>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="headlineSmall" style={styles.header}>
              {etapa === "PEGAR" ? "Fase 1: Pegue" : "Fase 2: Leve para"}
            </Text>

            {etapa === "PEGAR" && (
              <>
                <Text variant="bodyLarge">Prod: {tarefa.produtoNome}</Text>
                <Text variant="bodyLarge">Qtd: {tarefa.quantidade} UN</Text>
                <Text variant="bodyLarge">
                  OC: {tarefa.oc} | Pedido: {tarefa.pedido}
                </Text>
                <Text variant="bodyLarge" style={styles.enderecoDestaque}>
                  End: {tarefa.origemAddr}
                </Text>
              </>
            )}

            {etapa === "LEVAR" && (
              <Text variant="bodyLarge" style={styles.enderecoDestaque}>
                Destino: {tarefa.destinoAddr} (Checkout)
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

      <Modal visible={isScanning} onRequestClose={() => setIsScanning(false)}>
        <ThemedSafeAreaView>
          <ThemedView style={styles.scannerContainer}>
            <Appbar>
              <Appbar.BackAction onPress={() => setIsScanning(false)} />
              <Appbar.Content title="Escanear Código" />
            </Appbar>
            <CameraView style={styles.camera} onBarcodeScanned={handleScan}>
              <BarcodeMask edgeColor="#6200ee" showAnimatedLine={true} />
            </CameraView>
          </ThemedView>
        </ThemedSafeAreaView>
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
