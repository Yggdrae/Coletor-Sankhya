import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { ThemedView } from "@/src/components/ThemedView";
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Modal,
  TextInput as RNTextInput,
  FlatList,
} from "react-native";
import {
  Appbar,
  Button,
  Text,
  TextInput,
  useTheme,
  List,
} from "react-native-paper";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import BarcodeMask from "react-native-barcode-mask";

type EtapaConfVolume = "DOCA" | "VOLUME";

export default function Volume() {
  const { back } = useRouter();
  const theme = useTheme();

  const [etapa, setEtapa] = useState<EtapaConfVolume>("DOCA");

  const [docaLida, setDocaLida] = useState("");
  const [volumeLido, setVolumeLido] = useState("");
  const [volumesConferidos, setVolumesConferidos] = useState<string[]>([]); // Lista de volumes

  const docaRef = useRef<RNTextInput>(null);
  const volumeRef = useRef<RNTextInput>(null);

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
    setEtapa("VOLUME");
    setTimeout(() => volumeRef.current?.focus(), 100);
  };

  const handleContinuar = (value: string = volumeLido) => {
    const volume = value.trim();
    if (!volume) {
      Alert.alert("Erro", "Volume não pode ser vazio.");
      return;
    }
    if (volumesConferidos.includes(volume)) {
      Alert.alert("Atenção", "Este volume já foi conferido.");
      setVolumeLido("");
      return;
    }

    setVolumesConferidos((prev) => [volume, ...prev]);
    setVolumeLido("");
    volumeRef.current?.focus();
  };

  const handleEnviar = () => {
    if (volumesConferidos.length === 0 && !volumeLido) {
      Alert.alert("Erro", "Nenhum volume foi conferido.");
      return;
    }

    if (volumeLido) {
      handleContinuar();
    }

    console.log("Enviando volumes:", volumesConferidos);

    Alert.alert(
      "Sucesso!",
      `Conferência de Volumes realizada com sucesso!\nDoca: ${docaLida}`,
      [{ text: "OK", onPress: () => back() }]
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
    } else if (etapa === "VOLUME") {
      setVolumeLido(scannedData);
      handleContinuar(scannedData);
    }
  };

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => back()} />
        <Appbar.Content title="Conferir Volume" />
      </Appbar>
      <ThemedView style={styles.container}>
        {etapa === "DOCA" && (
          <ThemedView style={styles.form}>
            <Text variant="headlineSmall" style={styles.header}>
              Qual a doca?
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
          </ThemedView>
        )}

        {etapa === "VOLUME" && (
          <ThemedView style={styles.form}>
            <Text variant="headlineSmall" style={styles.header}>
              Conferindo Doca: {docaLida}
            </Text>
            <TextInput
              ref={volumeRef}
              label="Confirme o volume"
              value={volumeLido}
              onChangeText={setVolumeLido}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              onSubmitEditing={() => handleContinuar()} // Enter = Continuar
              right={
                <TextInput.Icon icon="barcode-scan" onPress={openScanner} />
              }
            />
            <Button
              mode="outlined"
              onPress={() => handleContinuar()}
              style={styles.button}
            >
              Continuar
            </Button>
            <Button
              mode="contained"
              onPress={handleEnviar}
              style={styles.button}
            >
              Enviar
            </Button>

            <Text variant="titleMedium" style={{ marginTop: 16 }}>
              Volumes conferidos: {volumesConferidos.length}
            </Text>
            <FlatList
              data={volumesConferidos}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <List.Item
                  title={`Volume: ${item}`}
                  left={(props) => <List.Icon {...props} icon="check" />}
                />
              )}
            />
          </ThemedView>
        )}
      </ThemedView>

      <Modal visible={isScanning} onRequestClose={() => setIsScanning(false)}>
        <ThemedSafeAreaView>
          <ThemedView style={styles.scannerContainer}>
            <Appbar>
              <Appbar.BackAction onPress={() => setIsScanning(false)} />
              <Appbar.Content title="Escanear Volume" />
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
