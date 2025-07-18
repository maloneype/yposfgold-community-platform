export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
    text: {
      primary: string;
      secondary: string;
    };
    success: string;
    warning: string;
    error: string;
    info: string;
    custom?: Record<string, string>;
  };
  fonts: {
    primary: string;
    heading: string;
    body: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  animations?: {
    [key: string]: string;
  };
}

export interface ThemeRegistry {
  [key: string]: ThemeConfig;
}

// Import individual theme configurations
import { modernTheme } from './modern';
import { festiveTheme } from './festive';

// Theme registry
export const themes: ThemeRegistry = {
  modern: modernTheme,
  festive: festiveTheme,
};

// Theme names for UI selection
export const themeNames = Object.keys(themes);

// Get theme configuration
export const getTheme = (themeName: string): ThemeConfig | null => {
  return themes[themeName] || null;
};

// Get all available themes
export const getAvailableThemes = (): { name: string; displayName: string }[] => {
  return Object.values(themes).map(theme => ({
    name: theme.name,
    displayName: theme.displayName
  }));
};

// Apply theme to document
export const applyTheme = (themeName: string) => {
  const theme = getTheme(themeName);
  if (!theme) return;

  const root = document.documentElement;
  
  // Apply color variables
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-background', theme.colors.background);
  root.style.setProperty('--theme-surface', theme.colors.surface);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-text-primary', theme.colors.text.primary);
  root.style.setProperty('--theme-text-secondary', theme.colors.text.secondary);
  root.style.setProperty('--theme-success', theme.colors.success);
  root.style.setProperty('--theme-warning', theme.colors.warning);
  root.style.setProperty('--theme-error', theme.colors.error);
  root.style.setProperty('--theme-info', theme.colors.info);
  
  // Apply custom colors if they exist
  if (theme.colors.custom) {
    Object.entries(theme.colors.custom).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }
  
  // Apply font variables
  root.style.setProperty('--font-primary', theme.fonts.primary);
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);
  
  // Apply gradient variables
  root.style.setProperty('--gradient-primary', theme.gradients.primary);
  root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
  root.style.setProperty('--gradient-background', theme.gradients.background);
  
  // Apply shadow variables
  root.style.setProperty('--shadow-sm', theme.shadows.sm);
  root.style.setProperty('--shadow-md', theme.shadows.md);
  root.style.setProperty('--shadow-lg', theme.shadows.lg);
  
  // Apply theme class
  root.classList.remove(...themeNames.map(name => `theme-${name}`));
  root.classList.add(`theme-${themeName}`);
};

// Register a new theme
export const registerTheme = (theme: ThemeConfig) => {
  themes[theme.name] = theme;
};

export type ThemeName = keyof typeof themes; 