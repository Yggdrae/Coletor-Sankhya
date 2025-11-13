// theme.ts (CORRIGIDO)

import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";
import materialTheme from "./material-theme.json";

const lightColors = materialTheme.schemes.light;
const darkColors = materialTheme.schemes.dark;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  version: 3,
  colors: {
    ...MD3LightTheme.colors,

    // Cores primárias e secundárias
    primary: lightColors.primary,
    onPrimary: lightColors.onPrimary,
    primaryContainer: lightColors.primaryContainer,
    onPrimaryContainer: lightColors.onPrimaryContainer,
    secondary: lightColors.secondary,
    onSecondary: lightColors.onSecondary,
    secondaryContainer: lightColors.secondaryContainer,
    onSecondaryContainer: lightColors.onSecondaryContainer,

    // Cores de Sucesso (Tertiary)
    tertiary: lightColors.tertiary,
    onTertiary: lightColors.onTertiary,
    tertiaryContainer: lightColors.tertiaryContainer,
    onTertiaryContainer: lightColors.onTertiaryContainer,

    // Cores de Erro
    error: lightColors.error,
    onError: lightColors.onError,
    errorContainer: lightColors.errorContainer,
    onErrorContainer: lightColors.onErrorContainer,

    // Fundo e Superfícies
    background: lightColors.background,
    onBackground: lightColors.onBackground,
    surface: lightColors.surface,
    onSurface: lightColors.onSurface,
    surfaceVariant: lightColors.surfaceVariant,
    onSurfaceVariant: lightColors.onSurfaceVariant,

    // Bordas
    outline: lightColors.outline,
    outlineVariant: lightColors.outlineVariant,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  version: 3,
  colors: {
    ...MD3DarkTheme.colors,

    // Cores primárias e secundárias
    primary: darkColors.primary,
    onPrimary: darkColors.onPrimary,
    primaryContainer: darkColors.primaryContainer,
    onPrimaryContainer: darkColors.onPrimaryContainer,
    secondary: darkColors.secondary,
    onSecondary: darkColors.onSecondary,
    secondaryContainer: darkColors.secondaryContainer,
    onSecondaryContainer: darkColors.onSecondaryContainer,

    // Cores de Sucesso (Tertiary)
    tertiary: darkColors.tertiary,
    onTertiary: darkColors.onTertiary,
    tertiaryContainer: darkColors.tertiaryContainer,
    onTertiaryContainer: darkColors.onTertiaryContainer,

    // Cores de Erro
    error: darkColors.error,
    onError: darkColors.onError,
    errorContainer: darkColors.errorContainer,
    onErrorContainer: darkColors.onErrorContainer,

    // Fundo e Superfícies
    background: darkColors.background,
    onBackground: darkColors.onBackground,
    surface: darkColors.surface,
    onSurface: darkColors.onSurface,
    surfaceVariant: darkColors.surfaceVariant,
    onSurfaceVariant: darkColors.onSurfaceVariant,

    // Bordas
    outline: darkColors.outline,
    outlineVariant: darkColors.outlineVariant,
  },
};
