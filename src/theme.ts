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
                    fontSize: "10px",
                },
            },
        },
    },
});
