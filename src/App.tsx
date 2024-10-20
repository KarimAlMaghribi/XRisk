import React from 'react';

import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Landing} from "./pages/landing/landing";
import {SignIn} from "./pages/authentication/sign-in";
import {SignUp} from "./pages/authentication/sign-up";
import {ForgotPassword} from "./pages/authentication/forgot-password";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/sign-in" element={<SignIn/>}/>
                <Route path="/sign-up" element={<SignUp/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;
