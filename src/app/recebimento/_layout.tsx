import { Stack } from "expo-router";
import React from "react";

export default function RecebimentoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="entrada" options={{ headerShown: false }} />
    </Stack>
  );
}
