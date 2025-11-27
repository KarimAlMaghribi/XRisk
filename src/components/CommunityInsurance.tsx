import { useState, useMemo } from 'react';
import { communityRisks } from '../lib/community-mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { 
  Package, 
  Car, 
  Camera, 
  Bike, 
  Key, 
  Wrench, 
  Users, 
  TrendingUp, 
  Calendar, 
  Shield,
  Search,
  Filter,
  X,
  Heart,
  Star,
  AlertTriangle
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { calculateRiskScore, getRiskLevel, getRiskLevelLabel, getRiskLevelColor, getRiskLevelIconColor } from '../types/risk';

const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  pending: 'Verfügbar',
  completed: 'Abgeschlossen',
  draft: 'Entwurf',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  draft: 'bg-yellow-100 text-yellow-800',
};

const itemIcons: Record<string, any> = {
  drohne: Package,
  auto: Car,
  kamera: Camera,
  bike: Bike,
  schlüssel: Key,
  werkzeug: Wrench,
};

function getItemIcon(title: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('drohne')) return Package;
  if (lowerTitle.includes('auto') || lowerTitle.includes('anhänger')) return Car;
  if (lowerTitle.includes('kamera')) return Camera;
  if (lowerTitle.includes('bike') || lowerTitle.includes('fahrrad')) return Bike;
  if (lowerTitle.includes('schlüssel')) return Key;
  if (lowerTitle.includes('werkzeug')) return Wrench;
  return Shield;
}

interface CommunityRiskCardProps {
  risk: any;
  onAccept?: (id: string) => void;
  onView?: (id: string) => void;
}

function CommunityRiskCard({ risk, onAccept, onView }: CommunityRiskCardProps) {
  const IconComponent = getItemIcon(risk.title);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const riskScore = calculateRiskScore(risk);
  const riskLevel = getRiskLevel(riskScore);
  const riskLevelLabel = getRiskLevelLabel(riskLevel);
  const riskLevelColor = getRiskLevelColor(riskLevel);

  return (
    <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Badge variant="outline" className={statusColors[risk.status]}>
                {statusLabels[risk.status]}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        <CardTitle className="text-lg">{risk.title}</CardTitle>
        <CardDescription className="line-clamp-2">{risk.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {risk.createdBy.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{risk.createdBy}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
              <span className="mx-1">•</span>
              <span>12 Absicherungen</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Wert</p>
            <p className="font-semibold">{risk.coverageAmount.toLocaleString('de-DE')} €</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Prämie</p>
            <p className="font-semibold text-green-600">
              {risk.premium.toLocaleString('de-DE')} €
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{risk.duration} {risk.duration === 1 ? 'Tag' : 'Tage'}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Risikobewertung</span>
            <Badge variant="outline" className={`${riskLevelColor} text-xs`}>
              {riskLevelLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((point) => (
              <div
                key={point}
                className={`h-2 flex-1 rounded-full ${
                  point <= riskLevel
                    ? riskLevel === 1 || riskLevel === 2
                      ? 'bg-green-500'
                      : riskLevel === 3
                      ? 'bg-yellow-500'
                      : riskLevel === 4
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {risk.status === 'pending' && onAccept && (
          <Button onClick={() => onAccept(risk.id)} className="w-full">
            <Shield className="mr-2 h-4 w-4" />
            Absicherung anbieten
          </Button>
        )}
        {(risk.status === 'active' || risk.status === 'completed') && onView && (
          <Button onClick={() => onView(risk.id)} variant="outline" className="w-full">
            Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function CommunityInsurance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPremium, setMaxPremium] = useState([100]);
  const [maxDuration, setMaxDuration] = useState([14]);
  const [sortBy, setSortBy] = useState<'newest' | 'premium' | 'duration'>('newest');
  const [showFilters, setShowFilters] = useState(true);

  const availableRisks = communityRisks.filter((r) => r.status === 'pending');
  const activeRisks = communityRisks.filter((r) => r.status === 'active');
  const completedRisks = communityRisks.filter((r) => r.status === 'completed');

  const filteredRisks = useMemo(() => {
    let filtered = availableRisks;

    if (searchTerm) {
      filtered = filtered.filter((risk) =>
        risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (risk) => risk.premium <= maxPremium[0] && risk.duration <= maxDuration[0]
    );

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'premium') {
        return b.premium - a.premium;
      } else if (sortBy === 'duration') {
        return a.duration - b.duration;
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [searchTerm, maxPremium, maxDuration, sortBy, availableRisks]);

  const handleAccept = (riskId: string) => {
    console.log('Accept community risk:', riskId);
  };

  const handleView = (riskId: string) => {
    console.log('View community risk:', riskId);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMaxPremium([100]);
    setMaxDuration([14]);
    setSortBy('newest');
  };

  const totalEarnings = activeRisks
    .filter((r) => r.userRole === 'taker')
    .reduce((sum, r) => sum + r.premium, 0);

  const totalSpent = activeRisks
    .filter((r) => r.userRole === 'giver')
    .reduce((sum, r) => sum + r.premium, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1>Marktplatz</h1>
        <p className="text-muted-foreground">
          Peer-to-Peer Absicherungen für alltägliche Leihgaben - sicher teilen und verdienen
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verfügbare Angebote</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableRisks.length}</div>
            <p className="text-xs text-muted-foreground">Suchen einen Absicherer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Absicherungen</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRisks.length}</div>
            <p className="text-xs text-muted-foreground">Derzeit laufend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verdient</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{totalEarnings.toLocaleString('de-DE')} €
            </div>
            <p className="text-xs text-muted-foreground">Durch Absicherungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausgegeben</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSpent.toLocaleString('de-DE')} €
            </div>
            <p className="text-xs text-muted-foreground">Für eigene Absicherungen</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">
            Verfügbar ({availableRisks.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Meine Aktiven ({activeRisks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Abgeschlossen ({completedRisks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-4">
            {showFilters && (
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="search">Suche</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Gegenstand suchen..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max. Prämie</Label>
                        <span className="text-sm text-muted-foreground">
                          bis {maxPremium[0]} €
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={maxPremium}
                        onValueChange={setMaxPremium}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max. Dauer</Label>
                        <span className="text-sm text-muted-foreground">
                          bis {maxDuration[0]} Tage
                        </span>
                      </div>
                      <Slider
                        min={1}
                        max={14}
                        step={1}
                        value={maxDuration}
                        onValueChange={setMaxDuration}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sort">Sortierung</Label>
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger id="sort">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Neueste zuerst</SelectItem>
                          <SelectItem value="premium">Höchste Prämie</SelectItem>
                          <SelectItem value="duration">Kürzeste Dauer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" onClick={resetFilters} className="w-full">
                      <X className="mr-2 h-4 w-4" />
                      Zurücksetzen
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3>{filteredRisks.length} Angebote gefunden</h3>
                    <p className="text-muted-foreground">
                      Nachbarschaftshilfe & Verleih
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {showFilters ? 'Filter ausblenden' : 'Filter'}
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredRisks.map((risk) => (
                    <CommunityRiskCard
                      key={risk.id}
                      risk={risk}
                      onAccept={handleAccept}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div>
            <h3>Meine aktiven P2P-Deals</h3>
            <p className="text-muted-foreground">
              Ihre laufenden Absicherungen und Verleih-Aktivitäten
            </p>
          </div>
          {activeRisks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Keine aktiven Absicherungen</CardTitle>
                <CardDescription>
                  Sie haben aktuell keine laufenden P2P-Deals. Erstellen Sie eine neue Absicherung oder übernehmen Sie ein verfügbares Risiko.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeRisks.map((risk) => (
                <CommunityRiskCard
                  key={risk.id}
                  risk={risk}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div>
            <h3>Abgeschlossene P2P-Deals</h3>
            <p className="text-muted-foreground">
              Ihre erfolgreichen Peer-to-Peer Absicherungen
            </p>
          </div>
          {completedRisks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Keine abgeschlossenen Deals</CardTitle>
                <CardDescription>
                  Sie haben noch keine abgeschlossenen P2P-Absicherungen. Diese erscheinen hier, sobald ein Deal beendet wurde.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedRisks.map((risk) => (
                <CommunityRiskCard
                  key={risk.id}
                  risk={risk}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
