# xrisk
Eine Frontend WebApplikation die als MVP fungiert um die Möglichkeiten des privaten Risiko Handelns über eine Risikobörse zu erproben.

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
