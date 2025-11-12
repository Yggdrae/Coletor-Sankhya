import { StyleSheet, View, Image } from "react-native";
import { Appbar, Button, Snackbar, TextInput } from "react-native-paper";
import { ThemedView } from "../components/ThemedView";
import { RelativePathString, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getData } from "@/src/service/storage";
import { ThemedSafeAreaView } from "../components/ThemedSafeArea";
import { useLogin } from "../hooks/useLogin";

export default function Page() {
  const { replace, push } = useRouter();
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [pass, setPass] = useState("");
  const { mutateAsync: performLogin } = useLogin();

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const login = async () => {
    try {
      if (!checkFields()) return;
      await performLogin({ nome: username, senha: pass });
      push("/(tabs)/home");
    } catch (error: any) {
      console.log(error.message);
      return;
    }
  };

  const checkFields = () => {
    let newErrors = 0;

    if (!username) newErrors++;
    if (!pass) newErrors++;

    if (newErrors > 0) {
      onToggleSnackBar();
      return false;
    }

    return true;
  };

  useEffect(() => {
    const checkDomainConfig = async () => {
      const domainConfig = await getData("domain");
      if (!domainConfig) push("/domainConfig" as RelativePathString);
    };

    checkDomainConfig();
  }, []);

  return (
    <ThemedSafeAreaView>
      <Appbar>
        <Appbar.Action
          icon="cog"
          onPress={() => replace("/domainConfig" as RelativePathString)}
        />
      </Appbar>
      <ThemedView style={styles.container}>
        <Image
          source={require("@/src/assets/images/login.png")}
          style={styles.image}
        />

        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={pass}
            onChangeText={setPass}
            secureTextEntry
          />
        </ThemedView>

        <ThemedView style={styles.buttonView}>
          <Button style={styles.button} mode="outlined">
            Cadastrar
          </Button>
          <Button style={styles.button} mode="contained" onPress={login}>
            Entrar
          </Button>
        </ThemedView>
      </ThemedView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        wrapperStyle={{
          alignSelf: "center",
        }}
      >
        Há campos sem preenchimento!
      </Snackbar>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 30,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: -150,
  },
  input: {
    width: "90%",
    height: 50,
    alignSelf: "center",
  },
  inputContainer: {
    gap: 20,
  },
  buttonView: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 20,
  },
  button: {
    height: 42,
    width: "40%",
  },
});
