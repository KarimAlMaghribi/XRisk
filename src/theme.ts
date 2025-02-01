import { createTheme } from '@mui/material/styles';

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
        fontFamily: '"Open Sans", sans-serif',
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
                    fontFamily: '"Open Sans", sans-serif',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: '"Open Sans", sans-serif',
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                markLabel: {
                    fontSize: "10px",
                },
            },
        },
    },
});
