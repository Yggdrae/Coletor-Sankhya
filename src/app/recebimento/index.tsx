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
  Text,
  TextInput,
  useTheme,
  SegmentedButtons,
} from "react-native-paper";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import BarcodeMask from "react-native-barcode-mask";

type EtapaConferencia = "DOCA" | "PRODUTO";

export default function ConferenciaEntradaScreen() {
  const { back } = useRouter();

  const [etapa, setEtapa] = useState<EtapaConferencia>("DOCA");

  const [docaLida, setDocaLida] = useState("");
  const [produtoLido, setProdutoLido] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [quantidadeAvariada, setQuantidadeAvariada] = useState("0");

  const docaRef = useRef<RNTextInput>(null);
  const produtoRef = useRef<RNTextInput>(null);
  const qtdRef = useRef<RNTextInput>(null);
  const avariaRef = useRef<RNTextInput>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setTimeout(() => docaRef.current?.focus(), 100);
  }, []);

  const handleConfirmaDoca = (value: string = docaLida) => {
    if (!value.trim()) {
      Alert.alert("Erro", "Código da doca não pode ser vazio.");
      return;
    }
    setDocaLida(value.trim());

    setEtapa("PRODUTO");
    setTimeout(() => produtoRef.current?.focus(), 100);
  };

  const handleProximoItem = () => {
    console.log({
      doca: docaLida,
      produto: produtoLido,
      qtd: quantidade,
      avaria: quantidadeAvariada,
    });

    setProdutoLido("");
    setQuantidade("");
    setQuantidadeAvariada("0");
    produtoRef.current?.focus();
    Alert.alert("Item salvo", "Leia o próximo produto.");
  };

  const handleEnviar = () => {
    if (!produtoLido || !quantidade) {
      Alert.alert("Erro", "Produto e Quantidade são obrigatórios.");
      return;
    }

    console.log("Enviando conferência da doca:", docaLida);
    handleProximoItem();

    Alert.alert("Sucesso", "Conferência da doca enviada.", [
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
        <Appbar.Content title="Recebimento" />
        <Appbar.BackAction onPress={() => back()} />
      </Appbar>
      <ThemedView style={styles.container}>
        <SegmentedButtons
          value={etapa}
          onValueChange={() => {}}
          buttons={[
            {
              value: "DOCA",
              label: "Doca",
              icon: etapa === "DOCA" ? "check" : undefined,
            },
            {
              value: "PRODUTO",
              label: "Dados produto",
              icon: etapa === "PRODUTO" ? "check" : undefined,
            },
          ]}
          style={styles.stepper}
        />

        {etapa === "DOCA" && (
          <ThemedView style={styles.form}>
            <Text variant="headlineSmall" style={styles.header}>
              Qual doca receberá os itens?
            </Text>
            <TextInput
              ref={docaRef}
              label="Informar código da doca"
              value={docaLida}
              onChangeText={setDocaLida}
              mode="outlined"
              style={styles.input}
              onSubmitEditing={() => handleConfirmaDoca()}
              right={
                <TextInput.Icon icon="barcode-scan" onPress={openScanner} />
              }
            />
          </ThemedView>
        )}

        {etapa === "PRODUTO" && (
          <ThemedView style={styles.form}>
            <Text variant="headlineSmall" style={styles.header}>
              Informe os dados do produto
            </Text>
            <Text variant="titleMedium">Doca: {docaLida}</Text>
            <TextInput
              ref={produtoRef}
              label="Código de Barras do Produto"
              value={produtoLido}
              onChangeText={setProdutoLido}
              mode="outlined"
              style={styles.input}
              onSubmitEditing={() => qtdRef.current?.focus()}
              right={
                <TextInput.Icon icon="barcode-scan" onPress={openScanner} />
              }
            />
            <TextInput
              ref={qtdRef}
              label="Quantidade*"
              value={quantidade}
              onChangeText={setQuantidade}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              onSubmitEditing={() => avariaRef.current?.focus()}
            />
            <TextInput
              ref={avariaRef}
              label="Quantidade avariada"
              value={quantidadeAvariada}
              onChangeText={setQuantidadeAvariada}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              onSubmitEditing={handleProximoItem}
            />

            <Button
              mode="outlined"
              onPress={handleProximoItem}
              style={styles.button}
            >
              Próximo item
            </Button>
            <Button
              mode="contained"
              onPress={handleEnviar}
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
  stepper: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
