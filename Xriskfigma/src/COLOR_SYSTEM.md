# Farb-System - RiskExchange

## Übersicht

Alle Farben sind als CSS-Variablen und Utility-Klassen definiert. **Verwende niemals Hard-codierte Hex-Werte oder rgba() direkt in Komponenten!**

## Text-Farben

| Klasse | Farbe | Verwendung |
|--------|-------|------------|
| `.text-primary` | `#353131` | Haupttext - hoher Kontrast |
| `.text-secondary` | `#4f4a4a` | Sekundärer Text - mittlerer Kontrast |
| `.text-muted` | `#717182` | Deaktiviert/Subtile Texte |
| `.text-inverse` | `#e6e5e5` | Text auf dunklen Hintergründen |
| `.text-brand` | `#ff671f` | Brand-Farbe Orange |
| `.text-white` | `#ffffff` | Weißer Text |

## Hintergrund-Farben (Solid)

| Klasse | Farbe | Verwendung |
|--------|-------|------------|
| `.bg-brand` | `#ff671f` | Primäre Brand-Farbe |
| `.bg-brand-hover` | `#e55b1a` | Brand-Farbe im Hover-State |
| `.bg-brand-active` | `#e05a1b` | Brand-Farbe im Active-State |
| `.bg-surface` | `#ffffff` | Weiße Oberflächen |
| `.bg-surface-variant` | `#f3f2f2` | Helle graue Oberflächen |

## Hintergrund-Farben (Transparent/Glasmorphism)

| Klasse | Farbe | Verwendung |
|--------|-------|------------|
| `.bg-surface-frost` | `rgba(255,255,255,0.6)` | Frosted Glass - 60% weiß |
| `.bg-surface-frost-hover` | `rgba(255,255,255,0.8)` | Frosted Glass Hover - 80% weiß |
| `.bg-surface-input` | `rgba(245,245,245,0.85)` | Input-Hintergründe mit Transparenz |

## Brand mit Transparenz (Hover/Active States)

| Klasse | Farbe | Verwendung |
|--------|-------|------------|
| `.bg-brand-alpha-3` | `rgba(255,103,31,0.03)` | 3% Brand - Subtiler Hover |
| `.bg-brand-alpha-6` | `rgba(255,103,31,0.06)` | 6% Brand - Hover State |
| `.bg-brand-alpha-12` | `rgba(255,103,31,0.12)` | 12% Brand - Active Background |
| `.bg-brand-alpha-20` | `rgba(255,103,31,0.2)` | 20% Brand - Active Border |
| `.bg-black-alpha-3` | `rgba(0,0,0,0.03)` | 3% Schwarz - Subtiler Hover |
| `.bg-black-alpha-6` | `rgba(0,0,0,0.06)` | 6% Schwarz - Leichter Schatten |
| `.bg-black-alpha-10` | `rgba(0,0,0,0.1)` | 10% Schwarz - Schatten |
| `.bg-black-alpha-20` | `rgba(0,0,0,0.2)` | 20% Schwarz - Overlay |

## Rahmen-Farben

| Klasse | Farbe | Verwendung |
|--------|-------|------------|
| `.border-brand` | `#ff671f` | Brand-Border |
| `.border-brand-alpha-20` | `rgba(255,103,31,0.2)` | Brand-Border mit 20% Transparenz |
| `.border-surface` | `#e6e5e5` | Standard-Border |
| `.border-muted` | `#cecaca` | Gedämpfter Border |
| `.border-input` | `#dddddd` | Input-Border |

## Schatten (Box-Shadow)

### Brand-basierte Schatten

| Klasse | Shadow-Wert | Verwendung |
|--------|-------------|------------|
| `.shadow-brand-sm` | `0px 2px 8px 0px rgba(255,103,31,0.25)` | Kleiner Brand-Schatten für Buttons |
| `.shadow-brand-md` | `0px 4px 12px 0px rgba(255,103,31,0.35)` | Mittlerer Brand-Schatten (Hover) |
| `.shadow-brand-active` | `0px 4px 12px rgba(255,103,31,0.15), inset 0px 1px 0px rgba(255,255,255,0.5)` | Active-State mit Inset |

### Neutrale Schatten

| Klasse | Shadow-Wert | Verwendung |
|--------|-------------|------------|
| `.shadow-sm` | `0px 2px 8px 0px rgba(0,0,0,0.06)` | Kleiner neutraler Schatten |
| `.shadow-md` | `0px 4px 12px 0px rgba(0,0,0,0.15)` | Mittlerer neutraler Schatten |
| `.shadow-lg` | `10px 10px 20px 0px rgba(0,0,0,0.1)` | Großer Schatten (z.B. Inputs) |
| `.shadow-input` | `0px 2px 4px 0px rgba(0,0,0,0.1)` | Schatten für Input-Elemente |
| `.shadow-button` | `0px 4px 4px 0px rgba(0,0,0,0.25)` | Schatten für Buttons |

## Backdrop Blur (Glasmorphism)

| Klasse | Blur-Wert | Verwendung |
|--------|-----------|------------|
| `.backdrop-blur-sm` | `blur(8px)` | Kleiner Blur |
| `.backdrop-blur-md` | `blur(12px)` | Mittlerer Blur |
| `.backdrop-blur-lg` | `blur(20px)` | Großer Blur (Navigation, Toggle) |
| `.backdrop-blur-xl` | `blur(47px)` | Extra großer Blur (Inputs) |

## Verwendungsbeispiele

### Button (Primary)
```tsx
<button className="bg-brand text-white shadow-brand-sm hover:bg-brand-hover hover:shadow-brand-md">
  Klick mich
</button>
```

### Navigation Link (Active)
```tsx
<button className="text-brand bg-brand-alpha-12 backdrop-blur-md border border-brand-alpha-20 shadow-brand-active">
  Aktiver Link
</button>
```

### Frosted Glass Toggle
```tsx
<div className="bg-surface-frost backdrop-blur-lg shadow-sm">
  Toggle Container
</div>
```

### Input Field
```tsx
<div className="bg-surface-input backdrop-blur-xl border border-input shadow-lg">
  <input className="text-primary placeholder:text-primary" />
</div>
```

## CSS-Variablen (Referenz)

Alle Farben sind als CSS-Variablen in `/styles/globals.css` definiert:

```css
/* Basis-Farben */
--color-brand: #ff671f;
--color-brand-hover: #e55b1a;
--color-brand-active: #e05a1b;
--color-text-primary: #353131;
--color-text-secondary: #4f4a4a;
--color-text-muted: #717182;
--color-text-inverse: #e6e5e5;
--color-surface: #ffffff;
--color-surface-variant: #f3f2f2;
--color-border: #e6e5e5;
--color-border-input: #dddddd;

/* Transparente Varianten */
--color-surface-frost: rgba(255,255,255,0.6);
--color-surface-frost-hover: rgba(255,255,255,0.8);
--color-surface-input: rgba(245,245,245,0.85);
--color-brand-alpha-3: rgba(255,103,31,0.03);
--color-brand-alpha-6: rgba(255,103,31,0.06);
--color-brand-alpha-12: rgba(255,103,31,0.12);
--color-brand-alpha-20: rgba(255,103,31,0.2);
--color-brand-alpha-25: rgba(255,103,31,0.25);
--color-brand-alpha-35: rgba(255,103,31,0.35);
--color-black-alpha-3: rgba(0,0,0,0.03);
--color-black-alpha-6: rgba(0,0,0,0.06);
--color-black-alpha-10: rgba(0,0,0,0.1);
--color-black-alpha-15: rgba(0,0,0,0.15);
--color-black-alpha-20: rgba(0,0,0,0.2);
--color-black-alpha-25: rgba(0,0,0,0.25);
```

## Wichtige Regeln

1. ✅ **Verwende immer Utility-Klassen** (`.bg-brand`, `.text-primary`, etc.)
2. ✅ **Kombiniere Klassen** für komplexe Styles (`.bg-surface-frost .backdrop-blur-lg .shadow-sm`)
3. ❌ **Keine Hard-codierten Farben** (`#ff671f`, `rgba(255,103,31,0.12)`)
4. ❌ **Keine Inline-Styles für Farben** (`style={{ backgroundColor: '#ff671f' }}`)
5. ✅ **Konsistente Hover/Active States** mit den definierten Alpha-Werten

## Migration von Hard-codierten Farben

| Alt (❌) | Neu (✅) |
|---------|---------|
| `bg-[#ff671f]` | `bg-brand` |
| `bg-[rgba(255,103,31,0.06)]` | `bg-brand-alpha-6` |
| `text-[#353131]` | `text-primary` |
| `border-[#dddddd]` | `border-input` |
| `backdrop-blur-[20px]` | `backdrop-blur-lg` |
| `shadow-[0px_2px_8px...]` | `shadow-sm` oder `shadow-brand-sm` |
