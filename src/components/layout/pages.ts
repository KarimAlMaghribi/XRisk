import {ROUTES} from "../../routing/routes";

export const pages: Page[] = [
    { name: 'Home', route: '/' },
    { name: 'Chat', route: ROUTES.CHAT },
    { name: 'Katalog', route: ROUTES.CATAGLOG },
    { name: 'Über uns', route: ROUTES.ABOUT },
    { name: 'xRisk für Investoren', route: ROUTES.INVESTORS }
];

export interface Page {
    name: string;
    route: string;
    icon?: any;
}

// export const settings: Page[] = ['Profil', 'Konto', 'Einstellungen', 'Ausloggen'];
export const settings: Page[] = [
    { name: 'Profil', route: ROUTES.PROFILE },
    { name: 'Konto', route: ROUTES.ACCOUNT },
    { name: 'Einstellungen', route: ROUTES.SETTINGS },
    { name: 'Ausloggen', route: "/" }
];
