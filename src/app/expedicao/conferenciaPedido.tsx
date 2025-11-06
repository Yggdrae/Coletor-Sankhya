import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { ThemedView } from "@/src/components/ThemedView";
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Modal,
  TextInput as RNTextInput,
} from "react-native";
import {
  Appbar,
  Button,
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

interface TarefaConferencia {
  oc: string;
  pedido: string;
  docaSaida: string;
  separador: string;
  produtoEAN: string;
  quantidadeEsperada: number;
}

const fetchTarefaPorDoca = (doca: string): Promise<TarefaConferencia> => {
  console.log("Buscando tarefa pela doca:", doca);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (doca === "01.07.02") {
        resolve({
          oc: "50",
          pedido: "72",
          docaSaida: "CHECKOUT 02",
          separador: "WMS1",
          produtoEAN: "7601002005000",
          quantidadeEsperada: 10,
        });
      } else {
        reject(new Error("Doca não encontrada ou sem tarefa."));
      }
    }, 1000);
  });
};

type EtapaConfPedido = "DOCA" | "PRODUTO" | "VOLUME";

export default function ConferenciaPedidoScreen() {
  const { back } = useRouter();
  const theme = useTheme();

  const [etapa, setEtapa] = useState<EtapaConfPedido>("DOCA");
  const [isLoading, setIsLoading] = useState(false);
  const [tarefa, setTarefa] = useState<TarefaConferencia | null>(null);

  const [docaLida, setDocaLida] = useState("");
  const [produtoLido, setProdutoLido] = useState("");
  const [quantidadeLida, setQuantidadeLida] = useState("");
  const [volumesGerar, setVolumesGerar] = useState("");

  const docaRef = useRef<RNTextInput>(null);
  const produtoRef = useRef<RNTextInput>(null);
  const qtdRef = useRef<RNTextInput>(null);
  const volumeRef = useRef<RNTextInput>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setTimeout(() => docaRef.current?.focus(), 100);
  }, []);

  const handleConfirmaDoca = (value: string = docaLida) => {
    setIsLoading(true);
    fetchTarefaPorDoca(value.trim())
      .then((data) => {
        setTarefa(data);
        setDocaLida(data.docaSaida);
        setQuantidadeLida(data.quantidadeEsperada.toString()); // Preenche a qtd
        setEtapa("PRODUTO");
        setTimeout(() => produtoRef.current?.focus(), 100);
      })
      .catch((err) => Alert.alert("Erro", err.message))
      .finally(() => setIsLoading(false));
  };

  const handleConfirmaProduto = (value: string = produtoLido) => {
    if (!tarefa) return;
    if (value.trim() !== tarefa.produtoEAN) {
      Alert.alert("Erro", "Produto incorreto!");
      return;
    }
    if (Number(quantidadeLida) !== tarefa.quantidadeEsperada) {
      Alert.alert(
        "Atenção",
        "Quantidade diverge do esperado, mas continuando."
      );
    }
    setEtapa("VOLUME");
    setVolumesGerar(quantidadeLida);
    setTimeout(() => volumeRef.current?.focus(), 100);
  };

  const handleGerarVolumes = () => {
    if (Number(volumesGerar) <= 0) {
      Alert.alert("Erro", "Insira uma quantidade de volumes válida.");
      return;
    }

    Alert.alert(
      "Atenção!",
      `Deseja enviar os ${quantidadeLida} produtos (${volumesGerar} volumes) para a doca ${docaLida} agora?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, enviar",
          onPress: () => {
            Alert.alert("Sucesso", "Produtos conferidos e volumes gerados!", [
              { text: "OK", onPress: () => back() },
            ]);
          },
        },
      ]
    );
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
    setIsScanning(false);

    if (etapa === "DOCA") {
      setDocaLida(scannedData);
      handleConfirmaDoca(scannedData);
    } else if (etapa === "PRODUTO") {
      if (produtoRef.current?.isFocused()) {
        setProdutoLido(scannedData);
        qtdRef.current?.focus();
      }
    }
  };

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => back()} />
        <Appbar.Content title="Conferir Pedido" />
      </Appbar>
      <ThemedView style={styles.container}>
        {etapa === "DOCA" && (
          <ThemedView style={styles.form}>
            <Text variant="headlineSmall" style={styles.header}>
              Informe a Doca de Saída
            </Text>
            <TextInput
              ref={docaRef}
              label="Escanear Doca de Saída"
              value={docaLida}
              onChangeText={setDocaLida}
              mode="outlined"
              style={styles.input}
              onSubmitEditing={() => handleConfirmaDoca()}
              right={
                <TextInput.Icon icon="barcode-scan" onPress={openScanner} />
              }
            />
            {isLoading && (
              <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            )}
          </ThemedView>
        )}

        {etapa === "PRODUTO" && tarefa && (
          <ThemedView style={styles.form}>
            <Card style={styles.card} mode="outlined">
              <Card.Content>
                <Text>
                  OC: {tarefa.oc} | Pedido: {tarefa.pedido}
                </Text>
                <Text>Separador: {tarefa.separador}</Text>
                <Text style={styles.enderecoDestaque}>
                  End: {tarefa.docaSaida}
                </Text>
              </Card.Content>
            </Card>

            <TextInput
              ref={qtdRef}
              label="Quantidade"
              value={quantidadeLida}
              onChangeText={setQuantidadeLida}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              onSubmitEditing={() => produtoRef.current?.focus()}
            />
            <TextInput
              ref={produtoRef}
              label="Produto"
              value={produtoLido}
              onChangeText={setProdutoLido}
              mode="outlined"
              style={styles.input}
              onSubmitEditing={() => handleConfirmaProduto()}
              right={
                <TextInput.Icon icon="barcode-scan" onPress={openScanner} />
              }
            />
            <Button
              mode="contained"
              onPress={() => handleConfirmaProduto()}
              style={styles.button}
            >
              Continuar
            </Button>
          </ThemedView>
        )}

        {etapa === "VOLUME" && tarefa && (
          <ThemedView style={styles.form}>
            <Text variant="headlineSmall" style={styles.header}>
              Quantos volumes deseja gerar?
            </Text>
            <TextInput
              ref={volumeRef}
              label="Quantidade"
              value={volumesGerar}
              onChangeText={setVolumesGerar}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              onSubmitEditing={handleGerarVolumes}
            />
            <Button
              mode="contained"
              onPress={handleGerarVolumes}
              style={styles.button}
            >
              Enviar
            </Button>
          </ThemedView>
        )}
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
  },
  form: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  header: {
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
  },
  enderecoDestaque: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 8,
    padding: 4,
  },
  scannerContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});
