# Typografie-System - RiskExchange

## Übersicht

Das Typografie-System ist barrierefrei gestaltet (WCAG 2.1 AA+) und verwendet semantische HTML-Elemente für bessere Zugänglichkeit.

## Schriftfamilien

```css
--font-family-primary: 'Inter'    /* Einheitliche Schriftart für alle Texte */
--font-family-display: 'Inter'    /* Einheitliche Schriftart für alle Texte */
```

**Inter** wird durchgängig für alle Textelemente verwendet - von Überschriften über Body-Text bis zu Buttons und Labels. Dies sorgt für ein konsistentes, modernes Erscheinungsbild.

## Schriftgrößen (rem-basiert)

```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px - Basis für Barrierefreiheit */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 2rem;      /* 32px */
```

## Schriftstärken

```css
--font-weight-regular: 400;   /* Normaler Text */
--font-weight-medium: 500;    /* Hervorgehobener Text */
--font-weight-semibold: 600;  /* Sub-Headings */
--font-weight-bold: 700;      /* Wichtige Werte */
--font-weight-black: 900;     /* Haupt-Überschriften */
```

## Zeilenhöhen

```css
--line-height-tight: 1.25;     /* Für große Überschriften */
--line-height-normal: 1.5;     /* Standard für Body-Text (WCAG empfohlen) */
--line-height-relaxed: 1.625;  /* Für lange Textblöcke */
```

## Farben (WCAG AA+ konform)

```css
--color-text-primary: #353131;      /* Kontrastverhältnis 12.5:1 auf weiß */
--color-text-secondary: #4f4a4a;    /* Kontrastverhältnis 8.3:1 auf weiß */
--color-text-muted: #717182;        /* Kontrastverhältnis 4.6:1 auf weiß */
--color-text-inverse: #e6e5e5;      /* Auf dunklen Hintergründen */
--color-brand: #ff671f;             /* Brand Orange */
```

## Utility-Klassen

### Überschriften

#### `.heading-1`
- **Verwendung**: Hauptüberschrift der Seite (h1)
- **Schrift**: Inter Black 32px
- **Beispiel**: "Dashboard", "Marktplatz"

```tsx
<h1 className="heading-1">Dashboard</h1>
```

#### `.heading-2`
- **Verwendung**: Sektions-Überschriften (h2)
- **Schrift**: Inter Bold 24px
- **Beispiel**: "Angebotene Risiken", "Meine Absicherungen"

```tsx
<h2 className="heading-2">Angebotene Risiken</h2>
```

#### `.heading-3`
- **Verwendung**: Unter-Sektionen (h3)
- **Schrift**: Inter Semibold 20px
- **Beispiel**: Card-Titel

```tsx
<h3 className="heading-3">DJI Mavic 3 Drohne verleihen</h3>
```

#### `.heading-4`
- **Verwendung**: Kleinere Überschriften (h4)
- **Schrift**: Inter Medium 18px

```tsx
<h4 className="heading-4">Details</h4>
```

### Body-Text

#### `.body-base`
- **Verwendung**: Standard-Fließtext
- **Schrift**: Inter Regular 16px

```tsx
<p className="body-base">Standardtext mit guter Lesbarkeit</p>
```

#### `.body-base-medium`
- **Verwendung**: Hervorgehobener Body-Text
- **Schrift**: Inter Medium 16px

```tsx
<span className="body-base-medium">Wichtiger Text</span>
```

#### `.body-sm`
- **Verwendung**: Kleinerer Fließtext
- **Schrift**: Inter Regular 14px

```tsx
<p className="body-sm">Sekundäre Informationen</p>
```

#### `.body-sm-medium`
- **Verwendung**: Kleinerer hervorgehobener Text
- **Schrift**: Inter Medium 14px

```tsx
<span className="body-sm-medium">Nutzername</span>
```

#### `.body-xs`
- **Verwendung**: Sehr kleine Texte, Meta-Informationen
- **Schrift**: Inter Regular 12px

```tsx
<span className="body-xs">Score: 95</span>
```

### Spezial-Klassen

#### `.display-value`
- **Verwendung**: Numerische Werte, Beträge
- **Schrift**: Inter Bold 14px

```tsx
<span className="display-value">8.000 €</span>
```

#### `.label`
- **Verwendung**: Feld-Labels
- **Schrift**: Inter Regular 12px (secondary color)

```tsx
<label className="label">Wert</label>
```

#### `.button-text`
- **Verwendung**: Button-Text
- **Schrift**: Inter Medium 16px

```tsx
<button className="button-text">Risiko übernehmen</button>
```

### Textfarben

```tsx
<span className="text-primary">Primärer Text</span>
<span className="text-secondary">Sekundärer Text</span>
<span className="text-muted">Gedämpfter Text</span>
<span className="text-inverse">Text auf dunklem Hintergrund</span>
<span className="text-brand">Brand-Farbe</span>
```

## Semantische HTML-Elemente

### Verwende immer semantische Tags:

```tsx
✅ RICHTIG:
<h1 className="heading-1">Titel</h1>
<h2 className="heading-2">Untertitel</h2>
<p className="body-base">Text</p>
<label className="label">Feldname</label>

❌ FALSCH:
<div className="heading-1">Titel</div>
<span className="heading-2">Untertitel</span>
<div className="body-base">Text</div>
```

## Barrierefreiheit

### ARIA-Labels

Verwende ARIA-Labels für Screenreader:

```tsx
<span className="display-value" aria-label="Wert 8000 Euro">
  8.000 €
</span>

<div role="meter" aria-valuenow={3} aria-valuemin={1} aria-valuemax={5} 
     aria-label="Risikostufe 3 von 5">
  {/* Visueller Indikator */}
</div>
```

### Focus States

Alle interaktiven Elemente haben sichtbare Focus-Indikatoren:

```css
*:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}
```

### Kontrastverhältnisse

Alle Texte erfüllen WCAG AA+ Standards:
- **Großer Text (18px+)**: Mindestens 3:1
- **Normaler Text**: Mindestens 4.5:1
- **Unsere Werte**: 8.3:1 bis 12.5:1

## Komponenten-Beispiele

### RiskCard

```tsx
<article aria-label="Risiko: DJI Mavic 3">
  <h3 className="body-base-medium">DJI Mavic 3 Drohne verleihen</h3>
  <p className="body-sm text-secondary">Beschreibung...</p>
  
  <div role="group" aria-label="Risikoinformationen">
    <span className="label">Wert</span>
    <span className="display-value">2.500 €</span>
  </div>
  
  <button className="button-text text-inverse" aria-label="Risiko übernehmen">
    Risiko übernehmen
  </button>
</article>
```

### Dashboard Heading

```tsx
<header>
  <h1 className="heading-1">Dashboard</h1>
  <p className="body-base text-secondary">
    Verwalten Sie Ihre Risiken und Absicherungen
  </p>
</header>
```

## Migration Checklist

- [x] ✅ globals.css - Tokens definiert
- [x] ✅ Utility-Klassen erstellt
- [x] ✅ RiskCard.tsx - Typo + A11y
- [x] ✅ RiskCardList.tsx - Typo + A11y
- [ ] 📝 Dashboard.tsx
- [ ] 📝 Marketplace.tsx
- [ ] 📝 HomePage.tsx
- [ ] 📝 FilterDrawer.tsx
- [ ] 📝 RiskDetailDialog.tsx
- [ ] 📝 TakeRiskModal.tsx
- [ ] 📝 UserProfileDialog.tsx
- [ ] 📝 OffersDialog.tsx
- [ ] 📝 CreateRiskCard.tsx
- [ ] 📝 CreateRiskCardList.tsx

## Best Practices

1. **Verwende semantische HTML-Elemente** (h1-h6, p, label, button)
2. **Nutze rem-basierte Größen** für bessere Skalierung
3. **Stelle ausreichende Kontraste sicher** (WCAG AA+)
4. **Füge ARIA-Labels hinzu** für komplexe UI-Elemente
5. **Verwende role="meter"** für Risiko-Indikatoren
6. **Teste mit Screenreadern** (NVDA, JAWS, VoiceOver)
7. **Keyboard-Navigation testen** (Tab, Enter, Space)
