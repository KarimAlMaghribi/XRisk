import React, { useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useNavigate,
    Outlet,
} from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

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
import { Settings } from "./pages/settings/settings";
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
import ChatPage from "./components/chat/chat-page";
import { useSession } from "./auth/useSession";

function App() {
    const [language, setLanguage] = useState(i18n.language);
    const { user, loading, refresh } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        i18n.on("languageChanged", (lng) => setLanguage(lng));
    }, [i18n.language]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Routes>
            {/* Landing Page ohne Layout */}
            <Route
                path="/"
                element={
                    user ? (
                        <Navigate to={`/${ROUTES.MY_RISKS}`} replace />
                    ) : (
                        <LandingPage
                            onLogin={() => navigate(`/${ROUTES.SIGN_IN}`)}
                            onNavigate={(path) => navigate(path)}
                            isLoggedIn={!!user}
                        />
                    )
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
