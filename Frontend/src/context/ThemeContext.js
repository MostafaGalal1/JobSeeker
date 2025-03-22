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
          custom: {
            main: '#1671ba'
          }
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