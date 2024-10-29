import {ROUTES} from "../../routing/routes";

export interface Page {
    name: string;
    route: string;
    icon?: any;
    action?: () => void;
}

export const pages: Page[] = [
    { name: 'Home', route: '/' },
    { name: 'Chat', route: ROUTES.CHAT },
    { name: 'Katalog', route: ROUTES.CATALOG },
    { name: 'Über uns', route: ROUTES.ABOUT },
    { name: 'xRisk für Investoren', route: ROUTES.INVESTORS },
    { name: 'BÖRSE', route: ROUTES.RISK_OVERVIEW }
];

export const settings: Page[] = [
    { name: 'Meine Risiken', route: ROUTES.MY_RISKS },
    { name: 'Meine Verhandlungen', route: ROUTES.MY_BIDS },
    { name: 'Profil', route: ROUTES.PROFILE },
    { name: 'Konto', route: ROUTES.ACCOUNT },
    { name: 'Einstellungen', route: ROUTES.SETTINGS },
];
