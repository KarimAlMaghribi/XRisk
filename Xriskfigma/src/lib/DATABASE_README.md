# RiskExchange Datenbank-Architektur

## 📚 Übersicht

Die zentrale Datenbank (`/lib/database.ts`) ist der **Single Point of Truth** für alle Daten in der RiskExchange App.

## 🗄️ Datenbank-Strukturen

### 1. User Datenbank (`userDatabase`)

Speichert alle Benutzer-Informationen.

```typescript
userDatabase: Record<string, User>
```

**Beispiel:**
```typescript
{
  'u5': {
    id: 'u5',
    displayName: 'Sie',
    firstName: 'Max',
    lastName: 'Mustermann',
    score: 96,
    // ...
  }
}
```

### 2. Risiko Datenbank (`riskDatabase`)

Speichert alle Risiken mit automatisch berechneten Werten (views, favorites).

```typescript
riskDatabase: Risk[]
```

**Wichtige Felder:**
- `createdByUserId`: ID des Erstellers (Risikogeber)
- `takenByUserId`: ID des Risikogebers (optional)
- `views`: Wird automatisch berechnet aus `viewsRelation`
- `favorites`: Wird automatisch berechnet aus `favoritesRelation`

### 3. Angebots Datenbank (`offerDatabase`)

Speichert alle Angebote von Risikogebern.

```typescript
offerDatabase: Offer[]
```

**Wichtige Felder:**
- `riskId`: ID des zugehörigen Risikos
- `offeredByUserId`: ID des Anbieters
- `status`: 'pending' | 'accepted' | 'rejected'

## 🔗 Relationale Strukturen

### 1. Favoriten-Relation (`favoritesRelation`)

**Beziehung:** N:N zwischen Users und Risks

```typescript
favoritesRelation: Record<string, string[]>
```

**Beispiel:**
```typescript
{
  'u5': ['R-100002', 'R-100005', 'R-100007'],  // User u5 hat 3 Risiken favorisiert
  'u1': ['R-100005', 'R-100007', 'R-100008']
}
```

### 2. Views-Relation (`viewsRelation`)

Tracking welche User welche Risiken gesehen haben.

```typescript
viewsRelation: Record<string, string[]>
```

**Beispiel:**
```typescript
{
  'R-100002': ['u2', 'u3', 'u5', 'u6'],  // 4 User haben Risiko R-100002 gesehen
  'R-100005': ['u1', 'u2', 'u3', 'u5']
}
```

## 📊 Beziehungen

```
User (1) ──────< erstellt >────── (N) Risk
User (N) ──────< bietet an >───── (N) Risk (via Offers)
User (N) ──────< favorisiert >─── (N) Risk
User (N) ──────< sieht >───────── (N) Risk
User (1) ──────< nimmt >───────── (N) Risk
```

## 🔍 Query-Funktionen

### User Queries

```typescript
getUserById(userId: string): User | undefined
getAllUsers(): User[]
getUserDisplayName(userId: string): string
getUserStats(userId: string): {...}
```

### Risk Queries

```typescript
getRiskById(riskId: string): Risk | undefined
getAllRisks(): Risk[]
getRisksByCreator(userId: string): Risk[]  // Risiken die User erstellt hat
getRisksByTaker(userId: string): Risk[]    // Risiken die User übernommen hat
getRisksByStatus(status): Risk[]
```

### Offer Queries

```typescript
getOfferById(offerId: string): Offer | undefined
getOffersByRisk(riskId: string): Offer[]
getOffersByUser(userId: string): Offer[]
getPendingOffersByRisk(riskId: string): Offer[]
```

### Favoriten Queries

```typescript
getFavoritesByUser(userId: string): string[]
getUserFavoriteRisks(userId: string): Risk[]
isRiskFavorited(userId: string, riskId: string): boolean
addFavorite(userId: string, riskId: string): void
removeFavorite(userId: string, riskId: string): void
```

### Views Queries

```typescript
getViewsByRisk(riskId: string): string[]
hasUserViewedRisk(userId: string, riskId: string): boolean
addView(userId: string, riskId: string): void
```

## 💡 Verwendung in Komponenten

### Beispiel 1: Risiken eines Users anzeigen

```typescript
import { getRisksByCreator, CURRENT_USER_ID } from '../lib/database';

function MyComponent() {
  const myRisks = getRisksByCreator(CURRENT_USER_ID);
  
  return (
    <div>
      {myRisks.map(risk => (
        <RiskCard key={risk.id} risk={risk} />
      ))}
    </div>
  );
}
```

### Beispiel 2: User-Statistiken abrufen

```typescript
import { getUserStats } from '../lib/database';

function UserProfile({ userId }: { userId: string }) {
  const stats = getUserStats(userId);
  
  return (
    <div>
      <p>Erstellt: {stats.createdRisks}</p>
      <p>Übernommen: {stats.takenRisks}</p>
      <p>Angebote: {stats.offeredOn}</p>
      <p>Favoriten: {stats.favorites}</p>
    </div>
  );
}
```

### Beispiel 3: Angebote für ein Risiko abrufen

```typescript
import { getPendingOffersByRisk } from '../lib/database';

function RiskOffers({ riskId }: { riskId: string }) {
  const offers = getPendingOffersByRisk(riskId);
  
  return (
    <div>
      <h3>{offers.length} Angebote</h3>
      {offers.map(offer => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
```

## ⚠️ Wichtige Regeln

1. **Immer die Query-Funktionen verwenden** - Nie direkt auf die Datenbanken zugreifen
2. **Keine redundanten Daten** - User-Namen etc. werden automatisch aus Relations berechnet
3. **Relations pflegen** - Bei neuen Favoriten/Views die Relations aktualisieren
4. **IDs konsistent verwenden** - Immer `userId`, `riskId`, `offerId` verwenden

## 🔄 Migration bestehender Komponenten

Alte Imports:
```typescript
import { users } from '../lib/user-mock-data';
import { communityRisks } from '../lib/community-mock-data';
import { offers } from '../lib/offers-mock-data';
```

Neue Imports:
```typescript
import { 
  userDatabase, 
  riskDatabase, 
  offers 
} from '../lib/database';
```

**Hinweis:** Die alten Dateien funktionieren weiterhin aus Kompatibilitätsgründen, leiten aber zur neuen Datenbank weiter.

## 📈 Datenintegrität

Die Datenbank garantiert:

- ✅ Automatische Berechnung von `views` und `favorites`
- ✅ Automatisches Einfügen von User-Namen aus User-Datenbank
- ✅ Konsistente IDs über alle Relations
- ✅ Single Point of Truth für alle Daten

## 🚀 Zukünftige Erweiterungen

- [ ] Nachrichten-Relation (User <-> Risk)
- [ ] Bewertungs-System (User bewertet User)
- [ ] Transaktions-Historie
- [ ] Notification-System
