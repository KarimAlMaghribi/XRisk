import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: "#F4641E",
        },
        secondary: {
            main: "#f5874d",
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 5,
                    textTransform: 'none',
                    fontWeight: 'normal',

                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
                },
            },
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'sans-serif'
        ].join(','),
    },
});
