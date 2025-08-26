// src/App.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Landing } from "./pages/landing/landing";
import { SignIn } from "./pages/authentication/sign-in";
import { SignUp } from "./pages/authentication/sign-up";
import { ForgotPassword } from "./pages/authentication/forgot-password";
import { RiskOverview } from "./pages/risk-overview/risk-overview";
import { Layout } from "./components/layout/layout";
import { Legal } from "./pages/formalities/legal";
import Privacy from "./pages/formalities/privacy";
import { Imprint } from "./pages/formalities/imprint";
import { About } from "./pages/about/about";
import { Catalog } from "./pages/catalog/catalog";
import { Account } from "./pages/account/account";
import { Investors } from "./pages/investors/investors";
import { Chat } from "./pages/chat/chat";
import { Settings } from "@mui/icons-material";
import { ROUTES } from "./routing/routes";
import { PrivateRoute } from "./routing/private-route";
import { MyRisks } from "./pages/my-risks/my-risks";
import { MyBids } from "./pages/my-bids/my-bids";
import { Contact } from "./pages/formalities/contact";
import { TermsPage } from "./pages/formalities/terms";
import FooterProductDescriptions from "./pages/formalities/product";
import FooterSolutionDescriptions from "./pages/formalities/solutions";
import FooterResourceDescriptions from "./pages/formalities/resources";
import FooterSupportDescriptions from "./pages/formalities/support";
import FooterCompanyDescriptions from "./pages/formalities/company";

import i18n from "./utils/i18n";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { auth } from "./firebase_config";
import { fetchUserProfile } from "./store/slices/user-profile/thunks";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                dispatch(fetchUserProfile());
            }
        });
        return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
        i18n.on("languageChanged", (lng) => {
            setLanguage(lng);
        });
    }, [i18n.language]);

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path={`/${ROUTES.SIGN_IN}`} element={<SignIn />} />
                <Route path={`/${ROUTES.SIGN_UP}`} element={<SignUp />} />
                <Route path={`/${ROUTES.FORGOT_PASSWORD}`} element={<ForgotPassword />} />
                <Route path={`/${ROUTES.ABOUT}`} element={<About />} />
                <Route path={`/${ROUTES.CHAT}`} element={<PrivateRoute><Chat /></PrivateRoute>} />
                <Route path={`/${ROUTES.CATALOG}`} element={<Catalog />} />
                <Route path={`/${ROUTES.ACCOUNT}`} element={<PrivateRoute><Account /></PrivateRoute>} />
                <Route path={`/${ROUTES.SETTINGS}`} element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path={`/${ROUTES.INVESTORS}`} element={<Investors />} />
                <Route path={`/${ROUTES.RISK_OVERVIEW}`} element={<PrivateRoute><RiskOverview /></PrivateRoute>} />
                <Route path={`/${ROUTES.LEGAL}`} element={<Legal />} />
                <Route path={`/${ROUTES.PRIVACY}`} element={<Privacy />} />
                <Route path={`/${ROUTES.IMPRINT}`} element={<Imprint />} />
                <Route path={`/${ROUTES.CONTACT}`} element={<Contact />} />
                <Route path={`/${ROUTES.TERMS}`} element={<TermsPage />} />
                <Route path={`/${ROUTES.FOOTER_SUPPORT}`} element={<FooterSupportDescriptions />} />
                <Route path={`/${ROUTES.FOOTER_PRODUCTS}`} element={<FooterProductDescriptions />} />
                <Route path={`/${ROUTES.FOOTER_SOLUTIONS}`} element={<FooterSolutionDescriptions />} />
                <Route path={`/${ROUTES.FOOTER_RESOURCES}`} element={<FooterResourceDescriptions />} />
                <Route path={`/${ROUTES.FOOTER_COMPANY}`} element={<FooterCompanyDescriptions />} />
                <Route path={`/${ROUTES.MY_RISKS}`} element={<PrivateRoute><MyRisks /></PrivateRoute>} />
                <Route path={`/${ROUTES.MY_BIDS}`} element={<PrivateRoute><MyBids /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Layout>
    );
}

export default App;
