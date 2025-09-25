import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { useThemeSwitcher } from './context/themeProvider';
import { ThemedView } from './components/ThemedView';
import { useRouter } from 'expo-router';

export default function Page() {
  const { theme, toggleTheme } = useThemeSwitcher();
  const router = useRouter();

  const login = () => {
    router.replace('/scanner');
  }

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/login.png")}
        style={styles.image}
      />
      <TextInput style={styles.input} placeholder='Usuário' />
      <TextInput style={styles.input} secureTextEntry placeholder='Senha' />
      <View style={styles.buttonView}>
        <Button style={styles.button} mode='contained' onPress={login}>Entrar</Button>
        <Button style={styles.button} mode='outlined'>Cadastrar</Button>
      </View>
      <Button mode='contained' onPress={toggleTheme} >Theme</Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 20,
  },
  image: {
    width: 300,
    height: 300
  },
  input: {
    width: "90%",
    height: 50
  },
  buttonView: {
    flexDirection: "row",
    gap: 5
  },
  button: {
    height: 42
  }
});
