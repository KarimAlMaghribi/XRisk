import React from 'react';

import {Navigate, Route, Routes} from "react-router-dom";
import {Landing} from "./pages/landing/landing";
import {SignIn} from "./pages/authentication/sign-in";
import {SignUp} from "./pages/authentication/sign-up";
import {ForgotPassword} from "./pages/authentication/forgot-password";
import {RiskOverview} from "./pages/risk/risk-overview";
import {Layout} from "./components/layout/layout";
import {Legal} from "./pages/formalities/legal";
import {Privacy} from "./pages/formalities/privacy";
import {Imprint} from "./pages/formalities/imprint";
import {About} from "./pages/about/about";
import {Catalog} from "./pages/catalog/catalog";
import {Account} from "./pages/account/account";
import {Investors} from "./pages/investors/investors";
import {Chat} from "./pages/chat/chat";
import {Profile} from "./pages/profile/profile";
import {Settings} from "@mui/icons-material";
import {ROUTES} from "./routing/routes";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path={`/${ROUTES.SIGN_IN}`} element={<SignIn/>}/>
                <Route path={`/${ROUTES.SIGN_UP}`} element={<SignUp/>}/>
                <Route path={`/${ROUTES.FORGOT_PASSWORD}`} element={<ForgotPassword/>}/>
                <Route path={`/${ROUTES.ABOUT}`} element={<About />}/>
                <Route path={`/${ROUTES.CHAT}`} element={<Chat />}/>
                <Route path={`/${ROUTES.CATAGLOG}`} element={<Catalog />}/>
                <Route path={`/${ROUTES.PROFILE}`} element={<Profile />}/>
                <Route path={`/${ROUTES.ACCOUNT}`} element={<Account />}/>
                <Route path={`/${ROUTES.SETTINGS}`} element={<Settings />}/>
                <Route path={`/${ROUTES.INVESTORS}`} element={<Investors />}/>
                <Route path={`/${ROUTES.RISK_OVERVIEW}`} element={<RiskOverview />}/>
                <Route path={`/${ROUTES.LEGAL}`} element={<Legal />}/>
                <Route path={`/${ROUTES.PRIVACY}`} element={<Privacy />}/>
                <Route path={`/${ROUTES.IMPRINT}`} element={<Imprint />}/>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Layout>
    );
}

export default App;
