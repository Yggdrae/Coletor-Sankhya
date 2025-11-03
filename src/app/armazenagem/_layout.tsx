import { Stack } from "expo-router";
import React from "react";

export default function ArmazenagemLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="tarefa" options={{ headerShown: false }} />
    </Stack>
  );
}
