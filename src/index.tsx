import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {store} from "./store/store";
import {Provider} from "react-redux";
import {theme} from "./theme";
import {ThemeProvider} from "@mui/material";
import "./index.scss";
import {BrowserRouter} from "react-router-dom";
import {SnackbarProvider} from "./components/snackbar/custom-snackbar";

// Register the service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker Registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker Registration Failed:", error);
      });
  }



const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SnackbarProvider>
                    <App/>
                </SnackbarProvider>
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
);


