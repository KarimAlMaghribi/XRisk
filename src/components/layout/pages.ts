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

    { name: 'home', route: '/' },
    { name: 'risk_exchange', route: ROUTES.RISK_OVERVIEW },
    { name: 'my_risks', route: ROUTES.MY_RISKS, authenticated: true },
    { name: 'chat', route: ROUTES.CHAT },

    
];

export const settings: Page[] = [
    { name: 'profile', route: ROUTES.PROFILE, icon: AccountCircleIcon },
    // { name: 'Konto', route: ROUTES.ACCOUNT, icon: AccountCircleIcon },
    // { name: 'Einstellungen', route: ROUTES.SETTINGS, icon: SettingsIcon },
];
