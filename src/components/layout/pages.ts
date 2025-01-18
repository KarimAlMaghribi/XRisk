import {ROUTES} from "../../routing/routes";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';


export interface Page {
    name: string;
    route: string;
    icon?: any;
    action?: () => void;
    authenticated?: boolean;
}

// TODO:: Add icons to elements

export const pages: Page[] = [
    { name: 'Home', route: '/' },
    { name: 'Risikobörse', route: ROUTES.RISK_OVERVIEW },
    { name: 'Meine Risiken', route: ROUTES.MY_RISKS, authenticated: true },
    { name: 'Chat', route: ROUTES.CHAT },
];

export const settings: Page[] = [
    { name: 'Profil', route: ROUTES.PROFILE, icon: AccountCircleIcon },
    // { name: 'Konto', route: ROUTES.ACCOUNT, icon: AccountCircleIcon },
    // { name: 'Einstellungen', route: ROUTES.SETTINGS, icon: SettingsIcon },
];
