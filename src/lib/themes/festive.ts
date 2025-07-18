import { ThemeConfig } from './index';

export const festiveTheme: ThemeConfig = {
  name: 'festive',
  displayName: 'Festive',
  colors: {
    primary: '#007BFF',
    secondary: '#FF7F50',
    background: '#E6E6FF',
    surface: '#FFFFFF',
    accent: '#00FF7F',
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF0000',
    info: '#0288D1',
    custom: {
      'festive-green': '#00FF7F',
      'festive-lavender': '#E6E6FF',
      'festive-amber': '#FFC107',
    },
  },
  fonts: {
    primary: "'Poppins', ui-sans-serif, system-ui, sans-serif",
    heading: "'Poppins', ui-sans-serif, system-ui, sans-serif",
    body: "'Lora', ui-serif, Georgia, serif",
  },
  gradients: {
    primary: 'linear-gradient(135deg, #007BFF 0%, #00FF7F 100%)',
    secondary: 'linear-gradient(135deg, #FF7F50 0%, #FFC107 100%)',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #E6E6FF 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  animations: {
    'gentle-pulse': 'gentlePulse 2s ease-in-out infinite',
    'gentle-bounce': 'gentleBounce 1s ease-in-out infinite',
  },
}; 