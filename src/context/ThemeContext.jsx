import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within ThemeModeProvider');
    }
    return context;
};

export const ThemeModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#64b5f6' : '#1976d2',
                light: darkMode ? '#90caf9' : '#42a5f5',
                dark: darkMode ? '#1976d2' : '#1565c0',
            },
            secondary: {
                main: darkMode ? '#f48fb1' : '#f50057',
            },
            background: {
                default: darkMode ? '#0a0a0a' : '#f5f5f5',
                paper: darkMode ? '#1a1a1a' : '#ffffff',
            },
            text: {
                primary: darkMode ? '#ffffff' : '#000000',
                secondary: darkMode ? '#aaaaaa' : '#666666',
            },
            divider: darkMode ? '#333333' : '#e0e0e0',
            success: { main: darkMode ? '#4caf50' : '#2e7d32' },
            warning: { main: darkMode ? '#ff9800' : '#ed6c02' },
            error: { main: darkMode ? '#f44336' : '#d32f2f' },
            info: { main: darkMode ? '#29b6f6' : '#0288d1' },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h4: { fontWeight: 600 },
            h6: { fontWeight: 500 },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: { textTransform: 'none', borderRadius: 8 },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: darkMode
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 12,
                        backgroundImage: 'none',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: darkMode
                            ? 'linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)'
                            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    },
                },
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};