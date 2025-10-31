import { StyleSheet, View, Image } from 'react-native'
import { Appbar, Button, Snackbar, Text, TextInput } from 'react-native-paper'
import { ThemedView } from '@/src/components/ThemedView';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getData, saveData } from '@/src/hooks/useAsyncStorage';

export default function DomainConfig() {
    const { replace } = useRouter();
    const [firstConfig, setFirstConfig] = useState(false);
    const [visible, setVisible] = useState(false);
    const [domain, setDomain] = useState<string>("");
    const [port, setPort] = useState<string>("");

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);


    const saveConfig = async () => {
        if (!checkFields()) return;
        else {
            await saveData("domain", { domain, port });
            replace('/');
        }
    }

    const checkFields = () => {
        let newErrors = 0;

        if (!domain) newErrors++;
        if (!port) newErrors++;

        if (newErrors > 0) {
            onToggleSnackBar();
            return false;
        }

        return true;
    }

    useEffect(() => {
        const checkDomainConfig = async () => {
            const domainConfig = await getData('domain');
            if (!domainConfig) setFirstConfig(true);
            else {
                setDomain(domainConfig.domain);
                setPort(domainConfig.port);
            }
        }

        checkDomainConfig();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <Appbar>
                {!firstConfig && <Appbar.BackAction onPress={() => replace('/')} />}
            </Appbar>

            <ThemedView style={styles.contentContainer}>
                <ThemedView style={styles.title}>
                    {firstConfig && <Text variant='titleMedium'>Parece ser sua primeira vez no aplicativo!</Text>}
                    <Text variant='titleMedium'>Configure o dominio do seu client.</Text>
                </ThemedView>

                <TextInput style={styles.input} placeholder='Dominio' value={domain} onChangeText={setDomain} />
                <TextInput style={styles.input} placeholder='Porta' value={port} onChangeText={setPort} keyboardType='numeric' />

                <View style={styles.buttonView}>
                    <Button style={styles.button} mode='contained' onPress={saveConfig}>Salvar</Button>
                </View>

                <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    wrapperStyle={{
                        alignSelf: 'center'
                    }}
                >
                    Há campos sem preenchimento!
                </Snackbar>
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
        justifyContent: 'center',
        padding: 20,
        gap: 20,
    },
    title: {
        alignItems: 'center',
        textAlign: "center",
    },
    input: {
        width: "90%",
        height: 50,
        alignSelf: 'center'
    },
    buttonView: {
        alignSelf: 'center',
        flexDirection: "row",
        gap: 5
    },
    button: {
        height: 42
    }
});