import '@fontsource/josefin-sans/300.css';
import '@fontsource/josefin-sans/400.css';
import '@fontsource/josefin-sans/500.css';
import '@fontsource/josefin-sans/700.css';

import { createTheme } from '@mui/material/styles';

export const themeSchema: any = {
    palette: {
        mode: 'dark',
        primary: {
            light: '#7ae3c3',
            main: '#00a884',
            dark: '#005c4b',
            contrastText: '#e9edef',
        },
        secondary: {
            main: '#8696a0',
            contrastText: '#e9edef',
        },
        background: {
            default: '#0b141a',
            paper: '#202c33',
        },
        text: {
            primary: '#e9edef',
            secondary: '#8696a0',
        },
        divider: 'rgba(134,150,160,0.15)',
        action: {
            hover: '#202c33',
        },
    },
    typography: {
        fontFamily: 'Josefin Sans, sans-serif',
        textTransform: 'none',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '50px',
                    padding: "10px 20px",
                },
                containedPrimary: {
                    backgroundColor: '#00a884',
                    "&:hover": {
                        backgroundColor: '#005c4b',
                    },
                },
                containedSecondary: {
                    border: "1px solid #8696a0",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                        border: "2px solid #8696a0",
                        padding: "8.75px 19px"
                    }
                },
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#202c33',
                    color: '#aebac1',
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#182229',
                },
                elevation1: {
                    '&:hover': {
                        backgroundColor: '#182229',
                    }
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2a3942',
                }
            }
        }
    }
}

export const theme = createTheme(themeSchema);