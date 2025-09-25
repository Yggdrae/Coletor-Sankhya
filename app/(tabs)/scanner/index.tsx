import { ThemedView } from "@/app/components/ThemedView";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { StyleSheet } from "react-native";
import { useState } from "react";
import BarcodeMask from "react-native-barcode-mask"
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function ScannerScreen() {
    const router = useRouter();
    const [facing, setFacing] = useState<CameraType>("back")
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <ThemedView />;
    }

    if (!permission.granted) {
        return (
            <ThemedView style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission}>Permitir Camera</Button>
            </ThemedView>
        );
    }

    const goBack = () => {
        router.replace('/')
    }

    const onScan = (data: BarcodeScanningResult) => {
        const date = new Date().toISOString();
        console.log(data.raw + " " + date)
    }

    return (
        <ThemedView style={styles.container}>
            <Appbar style={styles.appBar}>
                <Appbar.BackAction onPress={goBack} />
            </Appbar>
            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={(scanData) => onScan(scanData)}
            >
                <BarcodeMask
                    width={250}
                    height={200}
                    backgroundColor="black"
                    edgeHeight={50}
                    edgeWidth={50}
                    lineAnimationDuration={1500}
                />
            </CameraView>
            <ThemedView style={styles.inputArea}>
                <TextInput label="Area 1"/>
                <TextInput label="Area 2"/>
                <TextInput label="Area 3"/>
                <Button style={styles.button} mode="contained">Enviar</Button>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    appBar: {
        paddingHorizontal: 10
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'white',
        width: 60,
        height: 60,
        alignSelf: "center",
        alignItems: "center",
        borderRadius: 30,
        justifyContent: "center"
    },
    button: {
        width: 100,
        alignSelf: "center"
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    inputArea: {
        gap: 20,
        width: "80%",
        alignSelf: "center",
        margin: 10
    }
});