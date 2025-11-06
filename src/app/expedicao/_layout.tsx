import { Stack } from "expo-router";

export default function ExpedicaoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="conferenciaPedido" options={{ headerShown: false }} />
      <Stack.Screen name="conferenciaVolume" options={{ headerShown: false }} />
    </Stack>
  );
}
