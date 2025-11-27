# Internationalisierung (i18n) Guide

## Übersicht

Das xRisk Dashboard verwendet **i18next** und **react-i18next** für die Mehrsprachigkeit.

## Architektur

```
/locales/
  /de/
    common.json          # Deutsche Übersetzungen
  /en/
    common.json          # Englische Übersetzungen
/lib/
  i18n.ts               # i18n Konfiguration
/components/
  LanguageSwitcher.tsx  # Sprachwechsel-Komponente
```

## Installation

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## Setup in App.tsx

```tsx
import './lib/i18n';  // ✅ Ganz oben importieren

function App() {
  // ... rest of app
}
```

## Verwendung in Komponenten

### Einfache Texte

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('hero.headline.line1')}</h1>
      <p>{t('hero.subheadline')}</p>
    </div>
  );
}
```

### Mit Variablen (Interpolation)

**JSON:**
```json
{
  "welcome": "Willkommen, {{name}}!"
}
```

**Component:**
```tsx
{t('welcome', { name: 'Anna' })}
// Ergebnis: "Willkommen, Anna!"
```

### Arrays/Listen

**JSON:**
```json
{
  "steps": {
    "step1": {
      "title": "Schritt 1",
      "description": "Beschreibung"
    }
  }
}
```

**Component:**
```tsx
{t('steps.step1.title')}
{t('steps.step1.description')}
```

### Mit HTML/React-Komponenten

**Für komplexe Inhalte (wie FAQ-Antworten):**

```tsx
// Option 1: Trans Component
import { Trans } from 'react-i18next';

<Trans i18nKey="faq.questions.whatIsXrisk.answer.content1">
  xRisk bringt <strong>Menschen</strong> zusammen.
</Trans>

// Option 2: Programmatisch zusammenbauen
<div>
  <p><strong>{t('faq.questions.cost.answerBold')}</strong></p>
  <p>{t('faq.questions.cost.answer.content1')}</p>
</div>
```

## Best Practices

### ✅ DO's

1. **Namespace verwenden**: Gruppiere zusammengehörige Texte
   ```json
   {
     "hero": { ... },
     "navigation": { ... },
     "faq": { ... }
   }
   ```

2. **Beschreibende Keys**: Nutze sprechende Schlüssel
   ```json
   // ✅ Gut
   "hero.headline.line1": "Finde jemanden"
   
   // ❌ Schlecht
   "text1": "Finde jemanden"
   ```

3. **Hierarchische Struktur**: Spiegle die UI-Struktur
   ```json
   {
     "section": {
       "subsection": {
         "element": "Text"
       }
     }
   }
   ```

4. **Separate komplexe Inhalte**: Bei Listen und Objekten
   ```json
   {
     "list": [
       "Item 1",
       "Item 2",
       "Item 3"
     ]
   }
   ```

### ❌ DONT's

1. **Keine hardcodierten Texte** im Code
   ```tsx
   // ❌ Schlecht
   <button>Jetzt starten</button>
   
   // ✅ Gut
   <button>{t('navigation.cta')}</button>
   ```

2. **Keine HTML in JSON** (außer bei Trans)
   ```json
   // ❌ Schlecht
   "text": "Das ist <strong>wichtig</strong>"
   
   // ✅ Gut - Aufteilen
   "text": "Das ist wichtig",
   "textBold": "wichtig"
   ```

3. **Keine Duplikate**: Wiederverwendbare Texte zentral
   ```json
   {
     "common": {
       "buttons": {
         "save": "Speichern",
         "cancel": "Abbrechen"
       }
     }
   }
   ```

## Sprachwechsel

### Im Code
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <button onClick={() => changeLanguage('en')}>
      Switch to English
    </button>
  );
}
```

### Mit LanguageSwitcher-Komponente
```tsx
import { LanguageSwitcher } from './components/LanguageSwitcher';

<LanguageSwitcher />
```

## Neue Sprache hinzufügen

1. **Übersetzungsdatei erstellen**
   ```
   /locales/fr/common.json
   ```

2. **In i18n.ts registrieren**
   ```tsx
   import commonFR from '../locales/fr/common.json';
   
   const resources = {
     de: { common: commonDE },
     en: { common: commonEN },
     fr: { common: commonFR },  // ✅ Neu
   };
   ```

3. **In LanguageSwitcher hinzufügen**
   ```tsx
   const languages = [
     { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
     { code: 'en', name: 'English', flag: '🇬🇧' },
     { code: 'fr', name: 'Français', flag: '🇫🇷' },  // ✅ Neu
   ];
   ```

## Testing

```tsx
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';

test('renders translated text', () => {
  const { getByText } = render(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  );
  
  expect(getByText('Finde jemanden')).toBeInTheDocument();
});
```

## Migration bestehender Komponenten

1. **Texte identifizieren**: Alle hardcodierten Strings finden
2. **Keys definieren**: Sinnvolle Pfade in common.json anlegen
3. **Komponente anpassen**: Texte mit `t()` ersetzen
4. **Testen**: Sprachwechsel prüfen

### Beispiel-Migration

**Vorher:**
```tsx
function Hero() {
  return (
    <div>
      <h1>Finde jemanden, der dir hilft</h1>
      <button>Risiko anfragen</button>
    </div>
  );
}
```

**Nachher:**
```tsx
function Hero() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('hero.headline.line1')}</h1>
      <button>{t('hero.button')}</button>
    </div>
  );
}
```

## Tools & Helpers

### Translation Key Generator (VS Code Extension)
- i18n Ally - Visualisiert Keys inline

### Fehlende Übersetzungen finden
```tsx
// In i18n.ts
i18n.init({
  // ...
  debug: true,  // ✅ Zeigt fehlende Keys in Console
  saveMissing: true,  // ✅ Logged fehlende Keys
});
```

## Performance

### Lazy Loading für große Übersetzungen
```tsx
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });
```

## FAQ

**Q: Wie handle ich Pluralisierung?**
```json
{
  "items": "{{count}} Element",
  "items_plural": "{{count}} Elemente"
}
```
```tsx
{t('items', { count: 5 })}  // "5 Elemente"
```

**Q: Wie handle ich Datums-/Zahlenformate?**
```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
const date = new Date();
const formatted = date.toLocaleDateString(i18n.language);
```

**Q: Kann ich Markdown in Übersetzungen verwenden?**
Ja, mit react-markdown:
```tsx
import ReactMarkdown from 'react-markdown';
<ReactMarkdown>{t('content.withMarkdown')}</ReactMarkdown>
```
