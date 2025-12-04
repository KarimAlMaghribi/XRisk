import React, { useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useNavigate,
    Outlet,
} from "react-router-dom";

import { LandingPage } from "./components/LandingPage";
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
import ChatPage from "./components/chat/chat-page";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const [language, setLanguage] = useState(i18n.language);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) dispatch(fetchUserProfile());
        });
        return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
        i18n.on("languageChanged", (lng) => setLanguage(lng));
    }, [i18n.language]);

    return (
        <Routes>
            {/* Landing Page ohne Layout */}
            <Route
                path="/"
                element={
                    <LandingPage
                        onLogin={() => navigate(`/${ROUTES.SIGN_IN}`)}
                        onNavigate={(path) => navigate(path)}
                        isLoggedIn={!!user}
                    />
                }
            />

            {/* Alle anderen Seiten im Layout */}
            <Route element={<Layout><Outlet /></Layout>}>
                <Route path={`/${ROUTES.SIGN_IN}`} element={<SignIn />} />
                <Route path={`/${ROUTES.SIGN_UP}`} element={<SignUp />} />
                <Route path={`/${ROUTES.FORGOT_PASSWORD}`} element={<ForgotPassword />} />
                <Route path={`/${ROUTES.ABOUT}`} element={<PrivateRoute><About /></PrivateRoute>} />
                <Route path={`/${ROUTES.CHAT}`} element={<PrivateRoute><ChatPage /></PrivateRoute>} />
                <Route path={`/${ROUTES.CHAT}/:id`} element={<PrivateRoute><ChatPage /></PrivateRoute>} />
                <Route path={`/${ROUTES.CATALOG}`} element={<PrivateRoute><Catalog /></PrivateRoute>} />
                <Route path={`/${ROUTES.ACCOUNT}`} element={<PrivateRoute><Account /></PrivateRoute>} />
                <Route path={`/${ROUTES.SETTINGS}`} element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path={`/${ROUTES.INVESTORS}`} element={<PrivateRoute><Investors /></PrivateRoute>} />
                <Route path={`/${ROUTES.RISK_OVERVIEW}`} element={<PrivateRoute><RiskOverview /></PrivateRoute>} />
                <Route path={`/${ROUTES.LEGAL}`} element={<PrivateRoute><Legal /></PrivateRoute>} />
                <Route path={`/${ROUTES.PRIVACY}`} element={<PrivateRoute><Privacy /></PrivateRoute>} />
                <Route path={`/${ROUTES.IMPRINT}`} element={<PrivateRoute><Imprint /></PrivateRoute>} />
                <Route path={`/${ROUTES.CONTACT}`} element={<PrivateRoute><Contact /></PrivateRoute>} />
                <Route path={`/${ROUTES.TERMS}`} element={<PrivateRoute><TermsPage /></PrivateRoute>} />
                <Route path={`/${ROUTES.FOOTER_SUPPORT}`} element={<PrivateRoute><FooterSupportDescriptions /></PrivateRoute>} />
                <Route path={`/${ROUTES.FOOTER_PRODUCTS}`} element={<PrivateRoute><FooterProductDescriptions /></PrivateRoute>} />
                <Route path={`/${ROUTES.FOOTER_SOLUTIONS}`} element={<PrivateRoute><FooterSolutionDescriptions /></PrivateRoute>} />
                <Route path={`/${ROUTES.FOOTER_RESOURCES}`} element={<PrivateRoute><FooterResourceDescriptions /></PrivateRoute>} />
                <Route path={`/${ROUTES.FOOTER_COMPANY}`} element={<PrivateRoute><FooterCompanyDescriptions /></PrivateRoute>} />
                <Route path={`/${ROUTES.MY_RISKS}`} element={<PrivateRoute><MyRisks /></PrivateRoute>} />
                <Route path={`/${ROUTES.MY_BIDS}`} element={<PrivateRoute><MyBids /></PrivateRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
