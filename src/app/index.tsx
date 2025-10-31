import { StyleSheet, View, Image } from 'react-native'
import { Appbar, Button, Snackbar, TextInput } from 'react-native-paper'
import { ThemedView } from '../components/ThemedView';
import { RelativePathString, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getData } from '@/src/hooks/useAsyncStorage';

export default function Page() {
  const { replace, push } = useRouter();
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [pass, setPass] = useState("");

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const login = () => {
    if (!checkFields()) return;
    else replace('/(tabs)/home');
  }


  const checkFields = () => {
    let newErrors = 0;

    if (!username) newErrors++;
    if (!pass) newErrors++;

    if (newErrors > 0) {
      onToggleSnackBar();
      return false;
    }

    return true;
  }

  useEffect(() => {
    const checkDomainConfig = async () => {
      const domainConfig = await getData('domain');
      if (!domainConfig) push('/domainConfig' as RelativePathString)
    }

    checkDomainConfig();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Appbar>
        <Appbar.Action icon="cog" onPress={() => replace('/domainConfig' as RelativePathString)} />
      </Appbar>

      <ThemedView style={styles.contentContainer}>
        <Image
          source={require("@/src/assets/images/login.png")}
          style={styles.image}
        />

        <TextInput style={styles.input} placeholder='Usuário' value={username} onChangeText={setUsername} />
        <TextInput style={styles.input} placeholder='Senha' value={pass} onChangeText={setPass} secureTextEntry />

        <View style={styles.buttonView}>
          <Button style={styles.button} mode='outlined'>Cadastrar</Button>
          <Button style={styles.button} mode='contained' onPress={login}>Entrar</Button>
        </View>

      </ThemedView>

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
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
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
