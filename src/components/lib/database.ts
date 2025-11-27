/**
 * ZENTRALE DATENBANK - Single Point of Truth
 * 
 * Diese Datei enthält alle Daten und Relationen für die RiskExchange App.
 * Alle anderen Komponenten sollten diese Datenbank als einzige Quelle nutzen.
 */

import { User } from '../types/user';
import { Risk, RiskLevel } from '../types/risk';
import { Offer } from '../types/offer';

// ============================================================================
// USER DATENBANK
// ============================================================================

export const userDatabase: Record<string, User> = {
  'u1': {
    id: 'u1',
    displayName: 'Thomas K.',
    firstName: 'Thomas',
    lastName: 'Krause',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Technik-Enthusiast und Drohnenpilot. Verleihe gerne meine Ausrüstung an vertrauenswürdige Community-Mitglieder.',
    score: 98,
    completedRisks: 12,
    totalRisks: 12,
    memberSince: new Date('2024-01-15'),
    verification: {
      creditCheckScore: 85,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u2': {
    id: 'u2',
    displayName: 'Marina S.',
    firstName: 'Marina',
    lastName: 'Schmidt',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Nachbarschaftshilfe ist mir wichtig. Teile gerne Auto und andere Dinge mit der Community.',
    score: 95,
    completedRisks: 8,
    totalRisks: 8,
    memberSince: new Date('2024-02-20'),
    verification: {
      creditCheckScore: 65,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: false,
      hasBankAccount: true,
    },
  },
  'u3': {
    id: 'u3',
    displayName: 'Lisa M.',
    firstName: 'Lisa',
    lastName: 'Müller',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Professionelle Fotografin. Vermiete hochwertige Kameraausrüstung für besondere Anlässe.',
    score: 100,
    completedRisks: 15,
    totalRisks: 15,
    memberSince: new Date('2023-11-10'),
    verification: {
      creditCheckScore: 92,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u4': {
    id: 'u4',
    displayName: 'Stefan B.',
    firstName: 'Stefan',
    lastName: 'Bauer',
    avatar: 'https://i.pravatar.cc/150?img=13',
    bio: 'Radfahrer aus Leidenschaft. E-Bikes sind meine Spezialität.',
    score: 92,
    completedRisks: 6,
    totalRisks: 6,
    memberSince: new Date('2024-03-05'),
    verification: {
      creditCheckScore: 78,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: false,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u5': {
    id: 'u5',
    displayName: 'Sie',
    firstName: 'Max',
    lastName: 'Mustermann',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'Aktives Community-Mitglied, das gerne Risiken teilt und übernimmt.',
    score: 96,
    completedRisks: 10,
    totalRisks: 10,
    memberSince: new Date('2024-01-01'),
    verification: {
      creditCheckScore: 88,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u6': {
    id: 'u6',
    displayName: 'Klaus W.',
    firstName: 'Klaus',
    lastName: 'Weber',
    avatar: 'https://i.pravatar.cc/150?img=14',
    bio: 'Heimwerker-Profi mit großer Werkzeugsammlung. Helfe gerne bei Projekten.',
    score: 94,
    completedRisks: 7,
    totalRisks: 7,
    memberSince: new Date('2024-02-14'),
    verification: {
      creditCheckScore: 81,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u7': {
    id: 'u7',
    displayName: 'Anna P.',
    firstName: 'Anna',
    lastName: 'Peters',
    avatar: 'https://i.pravatar.cc/150?img=10',
    bio: 'Vermiete Parkplatz und andere Immobilien-bezogene Dinge.',
    score: 97,
    completedRisks: 9,
    totalRisks: 9,
    memberSince: new Date('2023-12-01'),
    verification: {
      creditCheckScore: 90,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u8': {
    id: 'u8',
    displayName: 'Robert F.',
    firstName: 'Robert',
    lastName: 'Fischer',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'Outdoor-Fan und Mountainbiker. Verleihe gerne meine Ausrüstung für Abenteuer.',
    score: 93,
    completedRisks: 5,
    totalRisks: 5,
    memberSince: new Date('2024-04-10'),
    verification: {
      creditCheckScore: 72,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: false,
      hasBankAccount: true,
    },
  },
  'u9': {
    id: 'u9',
    displayName: 'Jan H.',
    firstName: 'Jan',
    lastName: 'Hoffmann',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Gaming-Enthusiast. Vernetze gerne Gamer in der Community.',
    score: 100,
    completedRisks: 4,
    totalRisks: 4,
    memberSince: new Date('2024-03-20'),
    verification: {
      creditCheckScore: 68,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: false,
    },
  },
  'u10': {
    id: 'u10',
    displayName: 'Familie Müller',
    firstName: 'Familie',
    lastName: 'Müller',
    avatar: 'https://i.pravatar.cc/150?img=16',
    bio: 'Reiselustige Familie mit Wohnmobil. Nehmen gerne andere mit auf Tour.',
    score: 91,
    completedRisks: 3,
    totalRisks: 3,
    memberSince: new Date('2024-05-01'),
    verification: {
      creditCheckScore: 75,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u11': {
    id: 'u11',
    displayName: 'Garten-Community',
    firstName: 'Garten',
    lastName: 'Community',
    avatar: 'https://i.pravatar.cc/150?img=17',
    bio: 'Gemeinschaftliche Gartengruppe. Teilen Gartengeräte und Wissen.',
    score: 96,
    completedRisks: 11,
    totalRisks: 11,
    memberSince: new Date('2023-10-15'),
    verification: {
      creditCheckScore: 60,
      hasFullName: false,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u12': {
    id: 'u12',
    displayName: 'Mehmet Y.',
    firstName: 'Mehmet',
    lastName: 'Yilmaz',
    avatar: 'https://i.pravatar.cc/150?img=18',
    bio: 'Handwerker und Anhänger-Besitzer. Helfe gerne bei Umzügen.',
    score: 99,
    completedRisks: 13,
    totalRisks: 13,
    memberSince: new Date('2023-11-20'),
    verification: {
      creditCheckScore: 95,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u13': {
    id: 'u13',
    displayName: 'Wassersport-Crew',
    firstName: 'Wassersport',
    lastName: 'Crew',
    avatar: 'https://i.pravatar.cc/150?img=19',
    bio: 'Wassersport-Gruppe mit SUP-Boards und Kajaks. Teilen gerne unsere Ausrüstung.',
    score: 94,
    completedRisks: 8,
    totalRisks: 8,
    memberSince: new Date('2024-01-25'),
    verification: {
      creditCheckScore: 77,
      hasFullName: true,
      hasVerifiedEmail: false,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u14': {
    id: 'u14',
    displayName: 'Katrin L.',
    firstName: 'Katrin',
    lastName: 'Lange',
    avatar: 'https://i.pravatar.cc/150?img=20',
    bio: 'Katzenliebhaberin und vertrauenswürdiges Community-Mitglied.',
    score: 98,
    completedRisks: 7,
    totalRisks: 7,
    memberSince: new Date('2024-02-28'),
    verification: {
      creditCheckScore: 86,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
  'u15': {
    id: 'u15',
    displayName: 'Koch-Community',
    firstName: 'Koch',
    lastName: 'Community',
    avatar: 'https://i.pravatar.cc/150?img=21',
    bio: 'Gruppe von Hobby-Köchen. Teilen Küchengeräte und Rezepte.',
    score: 95,
    completedRisks: 10,
    totalRisks: 10,
    memberSince: new Date('2023-12-10'),
    verification: {
      creditCheckScore: 73,
      hasFullName: true,
      hasVerifiedEmail: true,
      hasVerifiedPhone: true,
      hasConfirmedAddress: true,
      hasBankAccount: true,
    },
  },
};

// ============================================================================
// RISIKO DATENBANK
// ============================================================================

// Basis-Risiken ohne berechnete Werte
const baseRisks: Omit<Risk, 'createdBy'>[] = [
  {
    id: 'R-100001',
    title: 'Espressomaschine Leihgabe an Freund - DeLonghi Kaffeevollautomat für 2 Wochen',
    category: 'electronics',
    description: 'Verleih eines DeLonghi Dinamica ECAM 350.55.B Kaffeevollautomaten, Baujahr 2022, Neupreis 599€. Das Gerät ist regelmäßig gewartet, letzte Entkalkung im Oktober 2024. Alle Funktionen einwandfrei, keine Vorschäden. Transport erfolgt im Originalkarton per PKW.',
    coverageAmount: 450,
    premium: 10,
    duration: 14,
    status: 'active',
    createdByUserId: 'u5',
    createdAt: new Date('2024-11-02'),
    expiresAt: new Date('2024-11-29'),
    takenBy: 'Thomas K.',
    takenByUserId: 'u1',
    userRole: 'giver',
    images: ['https://images.unsplash.com/photo-1606980702785-6b5c4f50c969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb255JTIwY2FtZXJhfGVufDF8fHx8MTc2MjA2MjE1M3ww&ixlib=rb-4.1.0&q=80&w=1080'],
    recommendedPriceRange: { min: 8, max: 12 },
  },
  {
    id: 'R-100002',
    title: 'Wohnungsabsicherung für Geburtstagsparty - 40. Geburtstag mit 25-30 Gästen in Altbauwohnung',
    category: 'property',
    description: 'Absicherung einer 3-Zimmer Altbauwohnung (85qm, 3. OG) für Geburtstagsfeier mit 25-30 Personen. Wohnung verfügt über Parkettboden im Wohnzimmer (45qm), Designer-Sofa (3.500€), offene Küche mit hochwertigen Geräten, Stuck an Decken und bodentiefe Fenster. Party von 19-03 Uhr. Nichtraucher-Wohnung, keine Haustiere.',
    coverageAmount: 5000,
    premium: 55,
    duration: 1,
    status: 'pending',
    createdByUserId: 'u1',
    createdAt: new Date('2024-10-26'),
    userRole: 'giver',
    images: ['https://images.unsplash.com/photo-1646322472651-75ab95fd08e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMGNhbWVyYSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyMDYyMTUzfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    recommendedPriceRange: { min: 45, max: 65 },
  },
  {
    id: 'R-100003',
    title: 'E-Bike Verleih für Wochenendtour - Canyon Pathlite:ON 7 E-Bike im Allgäu',
    category: 'vehicles',
    description: 'Verleih eines Canyon Pathlite:ON 7 E-Bikes, Modelljahr 2023, Neupreis 3.299€, Kilometerstand 1.850km. Ausstattung: Bosch Performance Line Motor, 625Wh Akku, hydraulische Scheibenbremsen. Letzte Inspektion September 2024. Inklusive ABUS Bordo Fahrradschloss. Transport auf Fahrradträger. Keine Unfälle oder Stürze.',
    coverageAmount: 2800,
    premium: 40,
    duration: 3,
    status: 'pending',
    createdByUserId: 'u1',
    createdAt: new Date('2024-10-27'),
    userRole: 'giver',
    images: ['https://images.unsplash.com/photo-1605475300318-c377291697ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2xrc3dhZ2VuJTIwY2FyfGVufDF8fHx8MTc2MjA2MjE1M3ww&ixlib=rb-4.1.0&q=80&w=1080'],
    recommendedPriceRange: { min: 35, max: 45 },
  },
  {
    id: 'R-100004',
    title: 'Rasenmäher-Roboter für Nachbarschaftshilfe - Husqvarna Automower während 3-wöchigem Urlaub',
    category: 'tools',
    description: 'Überlassung eines Husqvarna Automower 315X, Baujahr 2021, für Nachbarn während dessen Urlaub. Rasenfläche 600qm. Gerät verfügt über GPS-Diebstahlschutz, kann bis 1.500qm mähen, Steigung bis 40%. Wartung April 2024 durchgeführt, neue Klingen montiert. Installation beim Nachbarn bereits vorhanden.',
    coverageAmount: 1200,
    premium: 18,
    duration: 21,
    status: 'completed',
    createdByUserId: 'u3',
    createdAt: new Date('2024-10-24'),
    expiresAt: new Date('2024-10-26'),
    takenBy: 'Mike R.',
    takenByUserId: 'u2',
    userRole: 'giver',
    recommendedPriceRange: { min: 15, max: 20 },
  },
  {
    id: 'R-100005',
    title: 'Wohnungstausch für Renovierungsarbeiten - 2-Zimmer-Wohnung München Schwabing für 10 Tage',
    category: 'property',
    description: 'Überlassung einer 2-Zimmer-Wohnung (62qm, EG mit Terrasse) während Badezimmerrenovierung. Voll möbliert, Gesamtwert Einrichtung ca. 15.000€. Ausstattung: Smart-Home System (Philips Hue, Sonos), 55\' OLED TV, Induktionsherd, Terrasse 20qm mit Loungemöbeln, Tiefgaragenstellplatz. Lage München Schwabing. Nichtraucher, keine Haustiere.',
    coverageAmount: 8000,
    premium: 0,
    duration: 10,
    status: 'draft',
    createdByUserId: 'u4',
    createdAt: new Date('2024-10-25'),
    userRole: 'giver',
    images: ['https://images.unsplash.com/photo-1620802051782-725fa33db067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGJpa2V8ZW58MXx8fHwxNzYxOTg0OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
  },
  {
    id: 'R-100006',
    title: 'Musikanlage für Vereinsfest - PA-Anlage mit Yamaha Equipment für 150 Gäste',
    category: 'electronics',
    description: 'Verleih einer PA-Anlage für Vereinsfest. Equipment: 2x Yamaha DBR15 Aktivlautsprecher (je 1000W), Yamaha MG12XU Mischpult, 2x Shure SM58 Mikrofone, Kabelset, 2x Boxenständer. Gesamtwert 3.200€. Veranstaltung mit ca. 150 Gästen in Veranstaltungshalle. Equipment flightcase-verpackt, Transport im Kombi. Versicherung deckt Transport und Beschädigung während Event ab.',
    coverageAmount: 3200,
    premium: 48,
    duration: 1,
    status: 'pending',
    createdByUserId: 'u5',
    createdAt: new Date('2024-10-20'),
    userRole: 'giver',
    recommendedPriceRange: { min: 40, max: 55 },
  },
  {
    id: 'R-100007',
    title: 'Werkzeugkoffer für Umzugshilfe - Makita Werkzeugset mit Akkuschrauber und Zubehör',
    category: 'tools',
    description: 'Verleih eines Makita Werkzeugkoffers DHP482RFJ für Umzug und Möbelaufbau. Inhalt: Akkuschrauber 18V mit 2 Akkus, 100-teiliges Bit-Set, Bohrer-Set, Stichsäge, Multitool, Wasserwaage, Hammer, Zangen-Set. Gesamtwert 850€. Alle Geräte funktionsfähig und geprüft. Transport in stabilem Systemkoffer.',
    coverageAmount: 850,
    premium: 15,
    duration: 2,
    status: 'pending',
    createdByUserId: 'u6',
    createdAt: new Date('2024-10-26'),
    userRole: 'giver',
    images: ['https://images.unsplash.com/photo-1603227705974-d28935099891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b29sYm94JTIwdG9vbHN8ZW58MXx8fHwxNzYyMDYyMTU1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    recommendedPriceRange: { min: 12, max: 18 },
  },
  {
    id: 'R-100008',
    title: 'Beamer für Fußball-WM Public Viewing - Epson 4K Beamer im Garten für 20 Personen',
    category: 'electronics',
    description: 'Verleih eines Epson EH-TW7100 4K Beamers (Neupreis 1.499€, Anschaffung 2023) für Public Viewing. Technische Daten: 3.000 Lumen, Lampe mit 3.500h Restlaufzeit. Inklusive 3m HDMI-Kabel und mobile Leinwand 3x2m (Wert 200€). Gesamtdeckungssumme 1.400€. Gerät ohne Pixelfehler, Transport in Originalverpackung.',
    coverageAmount: 1400,
    premium: 24,
    duration: 1,
    status: 'pending',
    createdByUserId: 'u5',
    createdAt: new Date('2024-10-27'),
    userRole: 'giver',
    recommendedPriceRange: { min: 20, max: 28 },
  },
  {
    id: 'R-100009',
    title: 'Kameraausrüstung für Hochzeitsfotografie - Canon EOS R5 mit Profi-Objektiven und Zubehör',
    category: 'electronics',
    description: 'Verleih einer professionellen Kameraausrüstung für Hochzeit. Equipment: Canon EOS R5 (3.800€), RF 24-70mm f/2.8 (2.400€), RF 70-200mm f/2.8 (2.400€), 2x Speedlite Blitz, 6x SD-Karten, 3x Ersatzakkus, Stativ, Kameratasche. Gesamtwert 9.500€. Body-Shutterzahl: 18.000. Alle Objektive ohne Kratzer oder Fungus. Übergabe am Vorabend.',
    coverageAmount: 9500,
    premium: 110,
    duration: 1,
    status: 'active',
    createdByUserId: 'u12',
    createdAt: new Date('2024-10-25'),
    expiresAt: new Date('2024-12-08'),
    takenBy: 'Sarah L.',
    takenByUserId: 'u5',
    userRole: 'taker',
    recommendedPriceRange: { min: 95, max: 125 },
  },
  {
    id: 'R-100010',
    title: 'Dachbox für Skiurlaub - Thule Motion XT XL für 4-Personen-Familie',
    category: 'vehicles',
    description: 'Verleih einer Thule Motion XT XL Dachbox (500 Liter) für Skiausrüstung. Maße: 215x91x44cm, maximale Zuladung 75kg. Box mit Schnellbefestigung, beidseitig zu öffnen, abschließbar. Wasserdicht, keine Kratzer oder Dellen. Inklusive Befestigungsmaterial und Anleitung.',
    coverageAmount: 600,
    premium: 19,
    duration: 14,
    status: 'completed',
    createdByUserId: 'u10',
    createdAt: new Date('2023-12-15'),
    expiresAt: new Date('2024-01-06'),
    takenBy: 'Klaus W.',
    takenByUserId: 'u6',
    userRole: 'giver',
    recommendedPriceRange: { min: 15, max: 22 },
  },
  {
    id: 'R-100011',
    title: 'Gaming-Setup für LAN-Party - High-End Gaming PC mit RTX 4080 und 240Hz Monitor',
    category: 'electronics',
    description: 'Transport eines High-End Gaming-Setups für LAN-Party. Equipment: Gaming PC (RTX 4080, AMD Ryzen 9 7950X, 32GB RAM, 2TB NVMe), ASUS ROG 27\' 240Hz Monitor, Razer Tastatur/Maus, SteelSeries Headset. Gesamtwert 4.200€. Setup wird in Originalverpackungen transportiert. Windows 11 Pro lizenziert, alle Treiber aktuell, keine Übertaktung.',
    coverageAmount: 4200,
    premium: 0,
    duration: 3,
    status: 'draft',
    createdByUserId: 'u9',
    createdAt: new Date('2024-11-01'),
    userRole: 'giver',
  },
  {
    id: 'R-100012',
    title: 'Partyzelt für Straßenfest - Profi-Partyzelt 6x12m mit Komplett-Ausstattung',
    category: 'property',
    description: 'Bereitstellung eines Profi-Partyzelts (6x12m) für Straßenfest. Material: Aluminiumgestell, PVC-Planen 500g/m². Inklusive Seitenwände, Gewichte für Befestigung, LED-Lichterketten, 6 Stehtische, 20 Barhocker. Gesamtwert 2.800€. Zelt wasserdicht und windstabil bis 70km/h. Aufbau durch 4 Personen, Abbau am Folgetag.',
    coverageAmount: 2800,
    premium: 43,
    duration: 1,
    status: 'pending',
    createdByUserId: 'u7',
    createdAt: new Date('2024-10-28'),
    userRole: 'giver',
    recommendedPriceRange: { min: 38, max: 48 },
  },
];

// ============================================================================
// ANGEBOTS DATENBANK
// ============================================================================

const offerDatabase: Omit<
  Offer,
  'riskTitle' | 'riskCategory' | 'riskLevel' | 'coverageAmount' | 'offeredBy'
>[] = [
  // Offers for 'R-100002' - Wohnungsabsicherung für Geburtstagsparty (45-65€)
  {
    id: 'o1',
    riskId: 'R-100002',
    offeredByUserId: 'u2',
    premium: 50,
    message: 'Habe bereits mehrere Partyversicherungen übernommen. Altbauwohnungen kenne ich gut!',
    createdAt: new Date('2024-10-26T10:30:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
  {
    id: 'o2',
    riskId: 'R-100002',
    offeredByUserId: 'u3',
    premium: 55,
    message: 'Professionelle Absicherung für Ihre Party. Viel Spaß zum 40. Geburtstag!',
    createdAt: new Date('2024-10-26T14:15:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
  {
    id: 'o3',
    riskId: 'R-100002',
    offeredByUserId: 'u6',
    premium: 48,
    message: 'Bestes Angebot! Habe selbst schon viele Events abgesichert.',
    createdAt: new Date('2024-10-27T09:00:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: false,
      lossOrTheft: true,
    },
  },
  // Offers for 'R-100003' - E-Bike Verleih (35-45€)
  {
    id: 'o4',
    riskId: 'R-100003',
    offeredByUserId: 'u3',
    premium: 38,
    message: 'E-Bikes sind meine Spezialität. Canyon ist eine Top-Marke!',
    createdAt: new Date('2024-10-27T13:20:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
  {
    id: 'o5',
    riskId: 'R-100003',
    offeredByUserId: 'u8',
    premium: 42,
    message: 'Top Bewertung, faire Prämie. Viel Spaß im Allgäu!',
    createdAt: new Date('2024-10-27T18:45:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: false,
      lossOrTheft: true,
    },
  },
  {
    id: 'o6',
    riskId: 'R-100003',
    offeredByUserId: 'u7',
    premium: 40,
    message: 'Sehr gerne! Habe bereits mehrere E-Bikes erfolgreich abgesichert.',
    createdAt: new Date('2024-10-27T20:10:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
  // Offers for 'R-100006' - Musikanlage für Vereinsfest (40-55€)
  {
    id: 'o7',
    riskId: 'R-100006',
    offeredByUserId: 'u2',
    premium: 45,
    message: 'Yamaha Equipment ist super! Kann ich gerne absichern.',
    createdAt: new Date('2024-10-20T09:00:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
  {
    id: 'o8',
    riskId: 'R-100006',
    offeredByUserId: 'u4',
    premium: 50,
    message: 'Als Musikfan kenne ich mich mit PA-Anlagen aus. Faire Konditionen!',
    createdAt: new Date('2024-10-20T11:30:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: false,
      lossOrTheft: true,
    },
  },
  // Offers for 'R-100007' - Werkzeugkoffer (12-18€)
  {
    id: 'o9',
    riskId: 'R-100007',
    offeredByUserId: 'u12',
    premium: 14,
    message: 'Handwerker unter sich! Makita-Werkzeug ist Top. Kann ich problemlos übernehmen.',
    createdAt: new Date('2024-10-26T12:00:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: false,
      lossOrTheft: true,
    },
  },
  {
    id: 'o10',
    riskId: 'R-100007',
    offeredByUserId: 'u9',
    premium: 16,
    message: 'Kenne Makita Werkzeug sehr gut. Faire Prämie für 2 Tage.',
    createdAt: new Date('2024-10-26T15:30:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: false,
    },
  },
  {
    id: 'o11',
    riskId: 'R-100007',
    offeredByUserId: 'u4',
    premium: 15,
    message: 'Gerne! Viel Erfolg beim Umzug!',
    createdAt: new Date('2024-10-26T17:00:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
  // Offers for 'R-100008' - Beamer (20-28€)
  {
    id: 'o12',
    riskId: 'R-100008',
    offeredByUserId: 'u1',
    premium: 22,
    message: 'Habe selbst einen Beamer und kenne die Risiken. Faire Prämie für einen Tag!',
    createdAt: new Date('2024-10-27T11:20:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
  {
    id: 'o13',
    riskId: 'R-100008',
    offeredByUserId: 'u3',
    premium: 26,
    message: 'Sichere gerne Elektronik ab. Viel Spaß beim Public Viewing!',
    createdAt: new Date('2024-10-27T15:45:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: false,
      lossOrTheft: true,
    },
  },
  {
    id: 'o14',
    riskId: 'R-100008',
    offeredByUserId: 'u6',
    premium: 24,
    message: 'Bestes Angebot für Ihren Epson Beamer. Bei Fragen gerne melden!',
    createdAt: new Date('2024-10-27T18:30:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
  // Offers for 'R-100012' - Partyzelt (38-48€)
  {
    id: 'o15',
    riskId: 'R-100012',
    offeredByUserId: 'u1',
    premium: 40,
    message: 'Partyzelte habe ich schon mehrfach abgesichert. Viel Erfolg mit dem Fest!',
    createdAt: new Date('2024-10-28T10:00:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: false,
      lossOrTheft: true,
    },
  },
  {
    id: 'o16',
    riskId: 'R-100012',
    offeredByUserId: 'u5',
    premium: 45,
    message: 'Profi-Partyzelt klingt super! Faire Konditionen.',
    createdAt: new Date('2024-10-28T13:15:00'),
    status: 'pending',
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  },
];

// ============================================================================
// RELATIONALE TABELLEN
// ============================================================================

/**
 * Favoriten-Relation: User -> Risk IDs
 * N:N Beziehung zwischen Users und Risks
 */
export const favoritesRelation: Record<string, string[]> = {
  'u1': ['R-100003', 'R-100007', 'R-100008'],
  'u2': ['R-100002', 'R-100003', 'R-100006'],
  'u3': ['R-100002', 'R-100007', 'R-100009'],
  'u5': ['R-100002', 'R-100003', 'R-100007', 'R-100008'],  // Current user favorites
  'u6': ['R-100002', 'R-100008', 'R-100012'],
  'u7': ['R-100003', 'R-100006', 'R-100012'],
  'u8': ['R-100002', 'R-100003', 'R-100007'],
  'u9': ['R-100006', 'R-100007', 'R-100011'],
};

/**
 * Views-Tracking: Risk ID -> User IDs
 * Tracking welche User welche Risiken gesehen haben
 */
export const viewsRelation: Record<string, string[]> = {
  'R-100002': ['u2', 'u3', 'u5', 'u6', 'u7', 'u8', 'u9'],
  'R-100003': ['u1', 'u2', 'u3', 'u5', 'u7', 'u8'],
  'R-100006': ['u2', 'u4', 'u5', 'u7'],
  'R-100007': ['u1', 'u4', 'u5', 'u9', 'u12'],
  'R-100008': ['u1', 'u3', 'u5', 'u6', 'u9'],
  'R-100012': ['u1', 'u5', 'u6', 'u7'],
};

// ============================================================================
// BERECHNETE WERTE & EXPORT
// ============================================================================

/**
 * Risiken mit berechneten relationalen Werten
 */
export const riskDatabase: Risk[] = baseRisks.map(risk => {
  const creator = userDatabase[risk.createdByUserId];
  const taker = risk.takenByUserId ? userDatabase[risk.takenByUserId] : undefined;
  
  // Berechne Views
  const viewers = viewsRelation[risk.id] || [];
  const views = viewers.length;
  
  // Berechne Favorites
  const favoritedBy = Object.entries(favoritesRelation)
    .filter(([_, riskIds]) => riskIds.includes(risk.id))
    .map(([userId]) => userId);
  const favorites = favoritedBy.length;
  
  return {
    ...risk,
    createdBy: creator?.displayName || 'Unbekannt',
    takenBy: taker?.displayName,
    views,
    favorites,
  };
});

/**
 * Angebote mit berechneten User-Namen
 */
export const offers: Offer[] = offerDatabase.map(offer => {
  const offerer = userDatabase[offer.offeredByUserId];
  const risk = riskDatabase.find(r => r.id === offer.riskId);

  const calculatedRiskLevel = risk?.riskScore
    ? Math.min(5, Math.max(1, Math.round(risk.riskScore / 20)))
    : 3;

  return {
    ...offer,
    offeredBy: offerer?.displayName || 'Unbekannt',
    riskTitle: risk?.title || 'Unbekanntes Risiko',
    riskCategory: risk?.category || 'other',
    riskLevel: calculatedRiskLevel as RiskLevel,
    coverageAmount: risk?.coverageAmount ?? 0,
  };
});

// ============================================================================
// QUERY FUNKTIONEN - Single Point of Truth
// ============================================================================

/**
 * User Queries
 */
export function getUserById(userId: string): User | undefined {
  return userDatabase[userId];
}

export function getAllUsers(): User[] {
  return Object.values(userDatabase);
}

export function getUserDisplayName(userId: string): string {
  return userDatabase[userId]?.displayName || 'Unbekannt';
}

/**
 * Risk Queries
 */
export function getRiskById(riskId: string): Risk | undefined {
  return riskDatabase.find(r => r.id === riskId);
}

export function getAllRisks(): Risk[] {
  return riskDatabase;
}

export function getRisksByCreator(userId: string): Risk[] {
  return riskDatabase.filter(r => r.createdByUserId === userId);
}

export function getRisksByTaker(userId: string): Risk[] {
  return riskDatabase.filter(r => r.takenByUserId === userId);
}

export function getRisksByStatus(status: Risk['status']): Risk[] {
  return riskDatabase.filter(r => r.status === status);
}

/**
 * Offer Queries
 */
export function getOfferById(offerId: string): Offer | undefined {
  return offers.find(o => o.id === offerId);
}

export function getOffersByRisk(riskId: string): Offer[] {
  return offers.filter(o => o.riskId === riskId);
}

export function getOffersByUser(userId: string): Offer[] {
  return offers.filter(o => o.offeredByUserId === userId);
}

export function getPendingOffersByRisk(riskId: string): Offer[] {
  return offers.filter(o => o.riskId === riskId && o.status === 'pending');
}

/**
 * Favoriten Queries
 */
export function getFavoritesByUser(userId: string): string[] {
  return favoritesRelation[userId] || [];
}

export function getUserFavoriteRisks(userId: string): Risk[] {
  const favoriteIds = getFavoritesByUser(userId);
  return riskDatabase.filter(r => favoriteIds.includes(r.id));
}

export function isRiskFavorited(userId: string, riskId: string): boolean {
  return (favoritesRelation[userId] || []).includes(riskId);
}

export function addFavorite(userId: string, riskId: string): void {
  if (!favoritesRelation[userId]) {
    favoritesRelation[userId] = [];
  }
  if (!favoritesRelation[userId].includes(riskId)) {
    favoritesRelation[userId].push(riskId);
  }
}

export function removeFavorite(userId: string, riskId: string): void {
  if (favoritesRelation[userId]) {
    favoritesRelation[userId] = favoritesRelation[userId].filter(id => id !== riskId);
  }
}

/**
 * Views Queries
 */
export function getViewsByRisk(riskId: string): string[] {
  return viewsRelation[riskId] || [];
}

export function hasUserViewedRisk(userId: string, riskId: string): boolean {
  return (viewsRelation[riskId] || []).includes(userId);
}

export function addView(userId: string, riskId: string): void {
  if (!viewsRelation[riskId]) {
    viewsRelation[riskId] = [];
  }
  if (!viewsRelation[riskId].includes(userId)) {
    viewsRelation[riskId].push(userId);
  }
}

/**
 * Statistik Queries
 */
export function getUserStats(userId: string): {
  createdRisks: number;
  takenRisks: number;
  offeredOn: number;
  favorites: number;
} {
  return {
    createdRisks: getRisksByCreator(userId).length,
    takenRisks: getRisksByTaker(userId).length,
    offeredOn: getOffersByUser(userId).length,
    favorites: getFavoritesByUser(userId).length,
  };
}

// ============================================================================
// LEGACY EXPORTS (für Kompatibilität mit bestehenden Komponenten)
// ============================================================================

export const users = userDatabase;
export const communityRisks = riskDatabase;
