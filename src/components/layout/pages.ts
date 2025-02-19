import {ROUTES} from "../../routing/routes";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation, Trans } from "react-i18next";

export interface Page {
    name: string;
    route: string;
    icon?: any;
    action?: () => void;
    authenticated?: boolean;
}


export const pages: Page[] = [

    // { name: "Home", route: '/' },
    // { name: 'Risikobörse', route: ROUTES.RISK_OVERVIEW },
    // { name: 'Meine Risiken', route: ROUTES.MY_RISKS, authenticated: true },
    // { name: 'Chat', route: ROUTES.CHAT },

    { name: "Home", route: '/' },
    { name: 'Risik Exchange', route: ROUTES.RISK_OVERVIEW },
    { name: 'My Risks', route: ROUTES.MY_RISKS, authenticated: true },
    { name: 'Chat', route: ROUTES.CHAT },

    
];

export const settings: Page[] = [
    { name: 'Profil', route: ROUTES.PROFILE, icon: AccountCircleIcon },
    // { name: 'Konto', route: ROUTES.ACCOUNT, icon: AccountCircleIcon },
    // { name: 'Einstellungen', route: ROUTES.SETTINGS, icon: SettingsIcon },
];
