# xrisk
Eine Frontend WebApplikation die als MVP fungiert um die Möglichkeiten des privaten Risiko Handelns über eine Risikobörse zu erproben.

## Session-Auth & Proxy

Der Frontend-Client nutzt die Backend-Session-Auth (Flask-Login Cookie) über einen same-origin Reverse-Proxy in Firebase Functions. In Produktion ist `VITE_API_BASE_URL` leer (`""`), sodass Requests wie `/login`, `/api/*` oder `/workflow/*` über Firebase Hosting an die Function `proxy` weitergeleitet werden.

**BACKEND_BASE_URL setzen**
- Lokal in Firebase Functions: `export BACKEND_BASE_URL="https://<backend-domain>"` vor `firebase emulators:start`.
- In Firebase: `firebase functions:config:set backend.base_url="https://<backend-domain>"`.

## Deployment

1. `npm install && npm run build`
2. `cd functions && npm install && npm run build`
3. `firebase deploy --only functions,hosting`

## Responsive Design

- Erstellt mit React (Create React App) und Material UI.
- Mobile-First Layout mit Breakpoints aus dem MUI-Theme.
- Typografie nutzt `clamp` in rem-Einheiten für fließende Größen.
- Header und Footer berücksichtigen `env(safe-area-inset-*)` für Geräte mit Notch.
- Animierte Elemente respektieren `prefers-reduced-motion`.
- Burger-Menü blendet auf Mobilgeräten als Drawer ein.
- Landing-Komponenten verwenden flexible Abstände und skalierende Bilder.
- "My Risks"-Ansicht stapelt Steuerung und Tabs auf kleinen Screens.
- "Risk Overview"-Seite stapelt Erstellungsbutton und Filter über der Liste und nutzt responsive Abstände.
- Authentifizierungsformulare zentrieren Karten, respektieren Safe-Area-Insets und nutzen responsive Abstände.
