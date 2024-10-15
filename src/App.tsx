import React from 'react';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Button, ThemeProvider} from "@mui/material";
import {theme} from "./theme";


function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Button variant="contained">Test</Button>
                <h1>Online</h1>
            </div>
        </ThemeProvider>
    );
}

export default App;
