'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme, getAvailableThemes, themeNames, type ThemeName } from './themes';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  availableThemes: { name: string; displayName: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>('modern');
  const availableThemes = getAvailableThemes();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themeNames.includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: string) => {
    if (themeNames.includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    // For now, just toggle between festive and modern
    // In the future, this could cycle through all available themes
    setTheme(theme === 'festive' ? 'modern' : 'festive');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 