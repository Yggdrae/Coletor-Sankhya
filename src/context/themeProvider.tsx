import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme as _useColorScheme } from "react-native";
import { getData, saveData } from "../hooks/useAsyncStorage";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = '@preferred_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = _useColorScheme() as Theme;

  const [theme, setTheme] = useState<Theme>(systemTheme ?? "light");

  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getData(THEME_STORAGE_KEY) as Theme | null;

        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          setTheme(systemTheme ?? "light");
        }
      } catch (error) {
        console.error("Failed to load theme from storage:", error);
        setTheme(systemTheme ?? "light");
      } finally {
        setIsLoadingTheme(false);
      }
    };

    loadTheme();
  }, [systemTheme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";

      try {
        saveData(THEME_STORAGE_KEY, newTheme);
      } catch (error) {
        console.error("Failed to save theme:", error);
      }

      return newTheme;
    });
  };

  if (isLoadingTheme) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSwitcher() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeSwitcher deve ser usado dentro de ThemeProvider");
  return ctx;
}