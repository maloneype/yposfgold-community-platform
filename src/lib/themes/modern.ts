import { ThemeConfig } from './index';

export const modernTheme: ThemeConfig = {
  name: 'modern',
  displayName: 'Modern',
  colors: {
    primary: '#007BFF',
    secondary: '#FF7F50',
    background: '#F0F5F5',
    surface: '#FFFFFF',
    accent: '#007BFF',
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF0000',
    info: '#0288D1',
  },
  fonts: {
    primary: "'Inter', ui-sans-serif, system-ui, sans-serif",
    heading: "'Inter', ui-sans-serif, system-ui, sans-serif",
    body: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  gradients: {
    primary: 'linear-gradient(135deg, #007BFF 0%, #0056B3 100%)',
    secondary: 'linear-gradient(135deg, #FF7F50 0%, #E56B3E 100%)',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F5F5 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
}; 