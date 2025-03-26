import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

// Create the context
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Create a custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Create the provider component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create the theme object when darkMode changes
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          background: {
            default: darkMode ? '#303030' : '#f5f5f5',
          },
          primary: {
            main: '#1976d2',
            dark: '#489de0',
            contrastText: '#fff',
          },
        },
      }),
    [darkMode]
  );

  // Context value
  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};