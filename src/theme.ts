import { createTheme } from '@mui/material/styles';

const fontFamily: string = '"Roboto", sans-serif';

export const theme = createTheme({
    palette: {
        primary: {
            main: "#F4641E",
            light: "#f5c6ad",
        },
        secondary: {
            main: "#f5874d",
        },
    },
    typography: {
        fontFamily: fontFamily,
        h1: {
            fontSize: 'clamp(2rem, 5vw + 1rem, 3rem)',
            lineHeight: 1.2,
        },
        h2: {
            fontSize: 'clamp(1.5rem, 4vw + 0.5rem, 2.25rem)',
            lineHeight: 1.3,
        },
        body1: {
            fontSize: 'clamp(1rem, 2vw + 0.5rem, 1.125rem)',
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 25,
                    textTransform: 'none',
                    fontWeight: 'normal',
                    fontFamily: fontFamily
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: fontFamily
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                markLabel: {
                    fontSize: '0.625rem',
                },
            },
        },
    },
});
