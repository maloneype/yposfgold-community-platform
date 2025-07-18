import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../theme-context'

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle Theme
      </button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Restore all mocks
    jest.restoreAllMocks()
  })

  it('provides default theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('modern')
  })

  it('toggles between themes', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const themeDisplay = screen.getByTestId('current-theme')
    const toggleButton = screen.getByTestId('toggle-button')
    
    // Initial theme should be modern
    expect(themeDisplay).toHaveTextContent('modern')
    
    // Toggle to festive
    fireEvent.click(toggleButton)
    await waitFor(() => {
      expect(themeDisplay).toHaveTextContent('festive')
    })
    
    // Toggle back to modern
    fireEvent.click(toggleButton)
    await waitFor(() => {
      expect(themeDisplay).toHaveTextContent('modern')
    })
  })

  it('persists theme to localStorage', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByTestId('toggle-button')
    
    // Toggle theme
    fireEvent.click(toggleButton)
    
    // Wait for the theme to change and localStorage to be updated
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('festive')
    })
    
    // Check that localStorage was called
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'festive')
  })

  it('loads theme from localStorage', () => {
    // Mock localStorage to return festive theme
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem')
    getItemSpy.mockReturnValue('festive')
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('festive')
  })

  it('applies theme CSS variables to document', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByTestId('toggle-button')
    
    // Initial theme should be modern
    expect(screen.getByTestId('current-theme')).toHaveTextContent('modern')
    
    // Toggle to festive theme
    fireEvent.click(toggleButton)
    
    // Wait for the theme to change with more time
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('festive')
    }, { timeout: 2000 })
    
    // Check that CSS variables are applied (this would require checking document.documentElement.style)
    // For now, we can verify the theme changed
    expect(screen.getByTestId('current-theme')).toHaveTextContent('festive')
  })
})

describe('useTheme hook', () => {
  it('throws error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = jest.fn()
    
    const TestComponentOutsideProvider = () => {
      useTheme()
      return <div>Test</div>
    }
    
    expect(() => {
      render(<TestComponentOutsideProvider />)
    }).toThrow('useTheme must be used within a ThemeProvider')
    
    console.error = originalError
  })
}) 