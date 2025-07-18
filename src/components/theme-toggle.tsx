'use client';

import * as React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Palette } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'festive' ? 'modern' : 'festive'} theme`}
      className="hover:bg-theme-surface/80 transition-colors"
    >
      {theme === 'festive' ? (
        <Sun className="h-5 w-5 text-theme-accent transition-colors" />
      ) : (
        <Moon className="h-5 w-5 text-theme-primary transition-colors" />
      )}
    </Button>
  );
} 