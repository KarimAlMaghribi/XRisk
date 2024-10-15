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
            styleOverrides: {
                root: {
                    borderRadius: 28,
                },
            },
        },
    },
});
