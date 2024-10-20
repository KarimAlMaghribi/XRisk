import { createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: orange[600],
        },
        secondary: {
            main: orange[200],
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
