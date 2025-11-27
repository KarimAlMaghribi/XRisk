# Risiko-ID Mapping

## 📋 Übersicht

Alle Risiko-IDs wurden auf ein einheitliches, fortlaufendes Format umgestellt.

## 🔄 ID-Format

**Neues Format:** `R-100001` (R- gefolgt von 6-stelliger fortlaufender Nummer)

## 📊 Aktuelle Risiken in der Datenbank (12 Risiken)

| ID | Titel | Kategorie | Status | Deckung | Prämie |
|----|-------|-----------|--------|---------|--------|
| **R-100001** | Espressomaschine Leihgabe an Freund | Elektronik | active | 450€ | 10€ |
| **R-100002** | Wohnungsabsicherung für Geburtstagsparty | Immobilien | pending | 5.000€ | 55€ |
| **R-100003** | E-Bike Verleih für Wochenendtour | Fahrzeuge | pending | 2.800€ | 40€ |
| **R-100004** | Rasenmäher-Roboter für Nachbarschaftshilfe | Werkzeuge | completed | 1.200€ | 18€ |
| **R-100005** | Wohnungstausch für Renovierungsarbeiten | Immobilien | draft | 8.000€ | 0€ |
| **R-100006** | Musikanlage für Vereinsfest | Elektronik | pending | 3.200€ | 48€ |
| **R-100007** | Werkzeugkoffer für Umzugshilfe | Werkzeuge | pending | 850€ | 15€ |
| **R-100008** | Beamer für Fußball-WM Public Viewing | Elektronik | pending | 1.400€ | 24€ |
| **R-100009** | Kameraausrüstung für Hochzeitsfotografie | Elektronik | active | 9.500€ | 110€ |
| **R-100010** | Dachbox für Skiurlaub | Fahrzeuge | completed | 600€ | 19€ |
| **R-100011** | Gaming-Setup für LAN-Party | Elektronik | draft | 4.200€ | 0€ |
| **R-100012** | Partyzelt für Straßenfest | Immobilien | pending | 2.800€ | 43€ |

## 🔢 Nächste ID

Die nächste zu vergebende ID ist: **R-100013**

## ✅ Aktualisierte Dateien

- ✅ `/lib/database.ts` - Hauptdatenbank
- ✅ `/lib/messages-mock-data.ts` - Nachrichten
- ✅ `/lib/DATABASE_README.md` - Dokumentation

## 📝 Verwendung

```typescript
// ✅ RICHTIG - Neue IDs verwenden
import { getRiskById } from '../lib/database';

const risk = getRiskById('R-100002');

// ❌ FALSCH - Alte IDs funktionieren nicht mehr
const risk = getRiskById('c1'); // undefined!
```

## 🎯 Vorteile des neuen Formats

1. **Einheitlich**: Alle IDs folgen dem gleichen Muster
2. **Skalierbar**: Platz für bis zu 999.999 Risiken
3. **Professionell**: Klare Trennung durch Prefix `R-`
4. **Sortierbar**: Fortlaufende Nummern erleichtern Sortierung
5. **Eindeutig**: Keine Konflikte mit anderen Entity-IDs

## 🔍 Pattern für andere Entities

Das gleiche Muster kann für andere Entities verwendet werden:

- **Users**: `U-100001`, `U-100002`, ...
- **Offers**: `O-100001`, `O-100002`, ...
- **Messages**: `M-100001`, `M-100002`, ...
- **Conversations**: `C-100001`, `C-100002`, ...

## 🚀 Nächste Schritte

Falls weitere Risiken hinzugefügt werden:
1. Nächste ID: `R-100010`
2. Fortlaufend weiter nummerieren
3. In diesem Dokument dokumentieren
