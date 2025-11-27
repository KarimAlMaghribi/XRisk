# Spacing System - RiskExchange

## Design System

Das Spacing-System basiert auf 4px und 8px Schritten für konsistente Abstände in der gesamten Anwendung.

### Spacing-Tokens (globals.css)

```css
--spacing-1: 4px;   /* Kleinste Abstände */
--spacing-2: 8px;   /* Standard kleine Abstände */
--spacing-3: 12px;  /* Mittlere Abstände */
--spacing-4: 16px;  /* Standard mittlere Abstände */
--spacing-5: 20px;  /* Größere mittlere Abstände */
--spacing-6: 24px;  /* Standard große Abstände */
--spacing-8: 32px;  /* Sehr große Abstände */
--spacing-10: 40px; /* Extra große Abstände */
--spacing-12: 48px; /* Maximum Abstände */
--spacing-16: 64px; /* Ausnahme große Abstände */
```

### Utility-Klassen

#### Gap
- `gap-1` bis `gap-16` - Abstände zwischen Flex/Grid-Items

#### Padding
- `p-1` bis `p-12` - Padding auf allen Seiten
- `px-1` bis `px-8` - Horizontales Padding
- `py-1` bis `py-8` - Vertikales Padding
- `pt-1` bis `pt-8` - Padding oben
- `pb-1` bis `pb-8` - Padding unten
- `pl-1` bis `pl-8` - Padding links
- `pr-1` bis `pr-8` - Padding rechts

#### Margin
- `m-1` bis `m-8` - Margin auf allen Seiten
- `mx-1` bis `mx-8` - Horizontaler Margin
- `my-1` bis `my-8` - Vertikaler Margin
- `mt-1` bis `mt-8` - Margin oben
- `mb-1` bis `mb-8` - Margin unten
- `ml-1` bis `ml-8` - Margin links
- `mr-1` bis `mr-8` - Margin rechts

## Anwendungsbeispiele

### RiskCard (Grid-Ansicht)
```tsx
<div className="p-8 gap-6">        /* 32px padding, 24px gap */
  <div className="gap-2">           /* 8px gap */
  <div className="gap-6">           /* 24px gap zwischen Wert/Laufzeit */
  <div className="p-4 gap-2">      /* 16px padding, 8px gap User Section */
</div>
```

### Material UI Komponenten
MUI verwendet ein 8px-basiertes Spacing-System:
- `gap: 1` = 8px
- `gap: 2` = 16px
- `gap: 3` = 24px
- `gap: 4` = 32px
- `p: 3` = 24px

## Komponenten-Status

### ✅ Migriert
- RiskCard.tsx
- RiskCardList.tsx (nutzt MUI spacing)
- globals.css (Tokens & Utility-Klassen definiert)

### 📝 Zu migrieren
- Dashboard.tsx
- Marketplace.tsx
- HomePage.tsx
- FilterDrawer.tsx
- RiskDetailDialog.tsx
- TakeRiskModal.tsx
- UserProfileDialog.tsx
- OffersDialog.tsx

## Regeln

1. **Hauptcontainer**: `p-8` (32px) oder `p-6` (24px)
2. **Sektionen-Gap**: `gap-6` (24px)
3. **Element-Gap**: `gap-2` (8px) oder `gap-4` (16px)
4. **Kleinere Abstände**: `gap-1` (4px) für eng beieinander liegende Elemente
5. **MUI Komponenten**: Nutzen das MUI Spacing (1 = 8px)
