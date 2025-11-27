# RiskCard Komponente - Varianten Dokumentation

## Übersicht

Die RiskCard zeigt Risiken in zwei Hauptkontexten mit unterschiedlicher Darstellung:
- **Dashboard** (`variant="dashboard"`)
- **Risikobörse/Marketplace** (`variant="marketplace"`)

Die Komponente erkennt automatisch die Beziehung des eingeloggten Nutzers zum Risiko und zeigt die passenden Elemente an.

---

## Dashboard Varianten

**WICHTIG**: Im Dashboard wird **NIEMALS** der "Angebot abgeben" Button angezeigt - nur der Details Button!

### 1. Analyse läuft (`status: 'evaluating'`)
**Eigenes Risiko in Prüfung**

```tsx
<RiskCard risk={risk} onDetailsClick={handleView} variant="dashboard" />
```

**Zeigt:**
- ✅ Titel
- ✅ Delete Icon
- ✅ Wert (Label)
- ✅ **Skeleton Animation** (statt Wert)
- ✅ Laufzeit (kein Kalender-Icon)
- ✅ Details Button (outline)
- ✅ Badge: "Analyse läuft" (grau)

**Zeigt NICHT:**
- ❌ Risikoskala
- ❌ User/Autor
- ❌ Angebot abgeben Button

---

### 2. Entwurf (`status: 'draft'`)
**Eigenes Risiko vor Veröffentlichung**

**Zeigt:**
- ✅ Titel
- ✅ Delete Icon
- ✅ Wert: `{coverageAmount} €`
- ✅ Laufzeit (kein Kalender-Icon)
- ✅ Details Button (outline)
- ✅ Badge: "Entwurf" (grau)

**Zeigt NICHT:**
- ❌ Risikoskala
- ❌ User/Autor
- ❌ Angebot abgeben Button

---

### 3. Aktiv (`status: 'active'`, eigenes Risiko)
**Laufendes eigenes Risiko**

**Zeigt:**
- ✅ Titel
- ✅ Delete Icon
- ✅ Wert: `{coverageAmount} €`
- ✅ Laufzeit (kein Kalender-Icon)
- ✅ Details Button (outline)

**Zeigt NICHT:**
- ❌ Risikoskala
- ❌ User/Autor
- ❌ Angebot abgeben Button
- ❌ Badge

---

### 4. Pending mit Angeboten (`status: 'pending'`, eigenes Risiko, offers > 0)
**Eigenes Risiko mit eingehenden Angeboten**

**Zeigt:**
- ✅ Titel
- ✅ Delete Icon
- ✅ Bestes Angebot: `{lowestOffer.premium} €`
- ✅ Laufzeit (kein Kalender-Icon)
- ✅ Details Button (outline)
- ✅ Badge: "X Angebote" (orange)

**Zeigt NICHT:**
- ❌ Risikoskala
- ❌ User/Autor
- ❌ Angebot abgeben Button

---

### 5. Übernommenes Risiko aktiv (`status: 'active'`, isCoveredRisk)
**Als Risikonehmer aktive Absicherung**

**Zeigt:**
- ✅ **Risikoskala** (5 Balken, gefüllt nach riskScore)
- ✅ Titel
- ✅ **User/Autor** (Profilbild + Name des Risikogebers)
- ✅ Prämie: `{premium} €` (vereinbarter Betrag)
- ✅ Laufzeit (kein Kalender-Icon)
- ✅ Details Button (outline)
- ✅ Badge: "Noch X Tage" (orange, berechnet aus expiresAt)

**Zeigt NICHT:**
- ❌ Delete Icon
- ❌ Angebot abgeben Button

---

### 6. Übernommenes Risiko abgeschlossen (`status: 'completed'`, isCoveredRisk)
**Als Risikonehmer beendete Absicherung**

**Zeigt:**
- ✅ **Risikoskala** (5 Balken, gefüllt nach riskScore)
- ✅ Titel
- ✅ **User/Autor** (Profilbild + Name des Risikogebers)
- ✅ Prämie: `{premium} €`
- ✅ Laufzeit (kein Kalender-Icon)
- ✅ Details Button (outline)
- ✅ Badge: "Abgeschlossen" (grau)

**Zeigt NICHT:**
- ❌ Delete Icon
- ❌ Angebot abgeben Button

---

## Risikobörse/Marketplace Varianten

### 1. Default (Fremdes Risiko)
**Risiko von anderem Nutzer**

```tsx
<RiskCard risk={risk} onTakeRisk={handleTake} onDetailsClick={handleView} variant="marketplace" />
```

**Zeigt:**
- ✅ **Risikoskala** (5 Balken, gefüllt nach riskScore)
- ✅ Titel
- ✅ **Star Icon** (Favorite Toggle)
- ✅ **User/Autor** (Profilbild + Name)
- ✅ **Prämie**: `{min} - {max} €` (recommendedPriceRange)
- ✅ Laufzeit **mit Kalender-Icon**
- ✅ **"Angebot abgeben" Button (orange)**
- ✅ Details Button (outline)

**Zeigt NICHT:**
- ❌ Delete Icon
- ❌ Badge

---

### 2. Eigenes Angebot (isOwnRisk)
**Eigenes Risiko in der Risikobörse**

**Zeigt:**
- ✅ **Risikoskala** (5 Balken, gefüllt nach riskScore)
- ✅ Titel
- ✅ **Star Icon** (Favorite Toggle)
- ✅ **"Von Dir"** (statt Autor-Name + Profilbild)
- ✅ **Prämie**: `{min} - {max} €` (recommendedPriceRange)
- ✅ Laufzeit **mit Kalender-Icon**
- ✅ **"Angebot abgeben" Button (grau/disabled)**
- ✅ Details Button (outline)

**Zeigt NICHT:**
- ❌ Delete Icon
- ❌ Badge

---

## Technische Details

### Props Interface

```typescript
interface RiskCardProps {
  risk: Risk;
  onTakeRisk?: (risk: Risk) => void;
  onDetailsClick?: (risk: Risk) => void;
  onDelete?: (risk: Risk) => void;
  variant?: 'marketplace' | 'dashboard';
}
```

### Automatische Erkennung

Die Komponente bestimmt automatisch:

```typescript
const isOwnRisk = risk.createdByUserId === CURRENT_USER_ID;
const isCoveredRisk = risk.takenByUserId === CURRENT_USER_ID;
const isDashboard = variant === 'dashboard';
```

### Wert/Prämie Logik

```typescript
// Dashboard - Eigenes Risiko
if (isDashboard && isOwnRisk) {
  if (status === 'evaluating') return 'Wert' + Skeleton
  if (status === 'pending' && hasOffers) return 'Bestes Angebot'
  return 'Wert'
}

// Dashboard - Abgesichertes Risiko
if (isDashboard && isCoveredRisk) {
  return 'Prämie' (fester Betrag)
}

// Marketplace
if (recommendedPriceRange) {
  return 'Prämie' (Range)
}
return 'Wert'
```

### Badge Logik

```typescript
// evaluating → "Analyse läuft" (grau)
// draft → "Entwurf" (grau)
// completed + covered → "Abgeschlossen" (grau)
// pending + own + offers → "X Angebote" (orange)
// active + covered + expiresAt → "Noch X Tage" (orange)
```

---

## Styling Details

### Flexible Höhe
Cards passen sich dem Inhalt an (`h-full`). Durch `items-stretch` im Grid werden alle Cards einer Zeile gleich hoch wie die höchste Card.

### Hover-Effekt
Border färbt sich orange bei Hover und wird 2px dick:
```tsx
onMouseEnter → borderColor: '#ff671f', borderWidth: '2px'
onMouseLeave → borderColor: '#e6e5e5', borderWidth: '1px'
```

### Skeleton Animation
Bei `status: 'evaluating'` wird der Wert als Skeleton angezeigt:
```tsx
<Skeleton className="h-[21px] w-full rounded bg-[#d9d9d9]" />
```

### 8er-Abstände (Material UI 3)
- Gap zwischen Elementen: 8px, 16px, 24px
- Padding Card: 24px (links/rechts), 32px (top), 24px (bottom)

---

## Verwendung

### Dashboard
```tsx
import { RiskCard } from './components/RiskCard';

<RiskCard
  risk={ownRisk}
  onDetailsClick={handleView}
  onDelete={handleDelete}  // optional
  variant="dashboard"
/>
```

### Marketplace
```tsx
import { RiskCard } from './components/RiskCard';

<RiskCard
  risk={marketplaceRisk}
  onTakeRisk={handleTakeRisk}
  onDetailsClick={handleView}
  variant="marketplace"
/>
```

---

## Mock-Daten Beispiele

### Eigenes Risiko mit Angeboten
```typescript
{
  id: 'R-100006',
  status: 'pending',
  createdByUserId: 'u5',  // = CURRENT_USER_ID
  coverageAmount: 3200,
  // offers im System: 3 Angebote
  // → Zeigt "Bestes Angebot: 40 €" + Badge "3 Angebote"
}
```

### Abgesichertes Risiko
```typescript
{
  id: 'R-100009',
  status: 'active',
  takenByUserId: 'u5',  // = CURRENT_USER_ID
  createdByUserId: 'u12',
  createdBy: 'Thomas K.',
  premium: 110,
  riskScore: 35,  // → 2 von 5 Balken orange
  expiresAt: new Date('2024-11-07'),
  // → Zeigt Risikoskala, User "Thomas K.", Prämie 110 €, Badge "Noch 2 Tage"
}
```

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2025-11-09 | Kompletter Neuaufbau nach Figma-Design |
| 2025-11-09 | Varianten-System implementiert (dashboard/marketplace) |
| 2025-11-09 | Skeleton Animation für 'evaluating' Status |
| 2025-11-09 | Badge-System vereinfacht (2 Varianten: grau/orange) |
