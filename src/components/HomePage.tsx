import { useState } from 'react';
import { riskDatabase } from './lib/database';
import { CURRENT_USER_ID } from './lib/current-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, TrendingUp, AlertCircle, Handshake } from 'lucide-react';
import { Button } from './ui/button';
import { RiskCard } from './RiskCard';
import type { Risk } from './types/risk';

export function HomePage() {
  const [risks] = useState(riskDatabase);
  
  // Filter risks based on user's relationship
  const ownOfferedRisks = risks.filter((r) => r.createdByUserId === CURRENT_USER_ID);
  const coveredRisks = risks.filter((r) => r.takenByUserId === CURRENT_USER_ID);
  
  // All risks for stats
  const allActiveRisks = risks.filter((r) => r.status === 'active');
  const allCompletedRisks = risks.filter((r) => r.status === 'completed');
  const allPendingRisks = risks.filter((r) => r.status === 'pending');

  const totalEarnings = coveredRisks
    .filter((r) => r.status === 'active')
    .reduce((sum, r) => sum + r.premium, 0);
    
  const totalSpent = ownOfferedRisks
    .filter((r) => r.status === 'active')
    .reduce((sum, r) => sum + r.premium, 0);
    
  const totalCompletedEarnings = coveredRisks
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.premium, 0);

  const handleView = (risk: Risk) => {
    console.log('View risk:', risk.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Willkommen bei RiskExchange - Ihrer P2P Absicherungs-Community
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive Deals
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allActiveRisks.length}</div>
            <p className="text-xs text-muted-foreground">
              Laufende P2P-Absicherungen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verdient (aktiv)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{totalEarnings.toLocaleString('de-DE')} €
            </div>
            <p className="text-xs text-muted-foreground">
              Als Absicherer laufend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ausgegeben
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalSpent.toLocaleString('de-DE')} €
            </div>
            <p className="text-xs text-muted-foreground">
              Für eigene Absicherungen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verfügbare Deals
            </CardTitle>
            <Handshake className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {allPendingRisks.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Warten auf Absicherer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Own Offered Risks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>Meine angebotenen Risiken</h2>
            <p className="text-muted-foreground">
              {ownOfferedRisks.length === 0 
                ? 'Noch keine eigenen Risiken erstellt' 
                : `${ownOfferedRisks.length} eigene ${ownOfferedRisks.length === 1 ? 'Risiko' : 'Risiken'}`
              }
            </p>
          </div>
          {ownOfferedRisks.length > 3 && (
            <Button variant="outline">Alle anzeigen</Button>
          )}
        </div>

        {ownOfferedRisks.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Keine eigenen Risiken</CardTitle>
              <CardDescription>
                Erstellen Sie ein neues Risiko, um Absicherung für Ihre Gegenstände zu finden.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {ownOfferedRisks.slice(0, 6).map((risk) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                onDetailsClick={handleView}
                variant="dashboard"
              />
            ))}
          </div>
        )}
      </div>

      {/* Covered Risks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>Meine abgesicherten Risiken</h2>
            <p className="text-muted-foreground">
              {coveredRisks.length === 0 
                ? 'Noch keine abgesicherten Risiken' 
                : `${coveredRisks.length} ${coveredRisks.length === 1 ? 'Absicherung' : 'Absicherungen'} als Partner`
              }
            </p>
          </div>
          {coveredRisks.length > 3 && (
            <Button variant="outline">Alle anzeigen</Button>
          )}
        </div>

        {coveredRisks.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Keine abgesicherten Risiken</CardTitle>
              <CardDescription>
                Übernehmen Sie Risiken vom Marktplatz, um als Risikopartner zu verdienen.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {coveredRisks.slice(0, 6).map((risk) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                onDetailsClick={handleView}
                variant="dashboard"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
