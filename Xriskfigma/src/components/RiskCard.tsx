import { Risk, calculateRiskScore } from "../types/risk";
import svgPaths from "../imports/svg-uh0650197e";
import { getOffersByRisk, getUserById } from "../lib/database";
import { CURRENT_USER_ID } from "../lib/current-user";
import { Skeleton } from "./ui/skeleton";

interface RiskCardProps {
  risk: Risk;
  onTakeRisk?: (risk: Risk) => void;
  onDetailsClick?: (risk: Risk) => void;
  onDelete?: (risk: Risk) => void;
  onFavoriteToggle?: (risk: Risk) => void;
  isFavorite?: boolean;
  variant?: 'marketplace' | 'dashboard';
  hideActions?: boolean; // Versteckt Favorite-Button und Aktions-Buttons
}

/**
 * RISKCARD KOMPONENTE - Varianten gemäß Figma
 * 
 * DASHBOARD-VARIANTEN:
 * 1. Analyse läuft (evaluating): Skeleton, kein User, Details Button, Badge "Analyse läuft"
 * 2. Entwurf (draft): Wert, kein User, Details Button, Badge "Entwurf"  
 * 3. Aktiv (active, own): Wert, kein User, Details Button, kein Badge
 * 4. Pending (pending, own with offers): Bestes Angebot, kein User, Details Button, Badge "X Angebote"
 * 5. Übernommenes Risiko (active, covered): Risikoskala, User, Prämie, Details Button, Badge "Noch X Tage"
 * 6. Übernommenes Risiko Abgeschlossen (completed, covered): Risikoskala, User, Prämie, Details Button, Badge "Abgeschlossen"
 * 
 * RISIKOBÖRSE-VARIANTEN:
 * 1. Default: Risikoskala, User, Prämie Range, "Angebot abgeben" Button (orange)
 * 2. Eigenes Angebot: Risikoskala, "Von Dir", Prämie Range, "Angebot abgeben" Button (grau/disabled)
 */

// Delete Icon Component
function DeleteIcon() {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g>
          <path d="M7.5 8.25V12.75" stroke="#F54900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M10.5 8.25V12.75" stroke="#F54900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3357c900} stroke="#F54900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M2.25 4.5H15.75" stroke="#F54900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p19dfc880} stroke="#F54900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

// Star Icon Component (Favorite)
function StarIcon({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <div className="relative shrink-0 size-[18px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <g>
            <path d={svgPaths.pe1f5000} fill="#ff671f" stroke="#ff671f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    );
  }
  
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g>
          <path d={svgPaths.pe1f5000} stroke="#4F4A4A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

// Calendar Icon Component
function CalendarIcon() {
  return (
    <div className="relative shrink-0 size-[14px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g>
          <path d="M4.66667 1.16667V3.5" stroke="#4F4A4A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" stroke="#4F4A4A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} stroke="#4F4A4A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" stroke="#4F4A4A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

// Risk Rating Bars Component (5 bars)
function RiskRatingBars({ riskScore }: { riskScore: number }) {
  // Calculate risk level from score
  const getRiskLevel = (score: number): number => {
    if (score < 15) return 1;  // Sehr niedrig
    if (score < 30) return 2;  // Niedrig
    if (score < 50) return 3;  // Mittel
    if (score < 70) return 4;  // Hoch
    return 5;                  // Sehr hoch
  };
  
  const filledBars = getRiskLevel(riskScore);
  
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className={`basis-0 ${
            bar <= filledBars ? 'bg-[#ff671f]' : 'bg-[#d9d9d9]'
          } grow h-[8px] min-h-px min-w-px rounded-[70px] shrink-0`}
        />
      ))}
    </div>
  );
}

// Badge Component
function Badge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'orange' }) {
  return (
    <div 
      className={`${
        variant === 'orange' ? 'bg-[#ffa726]' : 'bg-[#e6e5e5]'
      } box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] relative rounded-[8px] shrink-0`}
    >
      <p className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
        variant === 'orange' ? 'text-white' : 'text-[#4f4a4a]'
      }`}>
        {label}
      </p>
    </div>
  );
}

export function RiskCard({
  risk,
  onTakeRisk,
  onDetailsClick,
  onDelete,
  onFavoriteToggle,
  isFavorite = false,
  variant = 'marketplace',
  hideActions = false,
}: RiskCardProps) {
  const offers = getOffersByRisk(risk.id);
  const lowestOffer = offers.length > 0 
    ? offers.reduce((min, offer) => offer.premium < min.premium ? offer : min, offers[0])
    : null;

  // Determine card context
  const isOwnRisk = risk.createdByUserId === CURRENT_USER_ID;
  const isCoveredRisk = risk.takenByUserId === CURRENT_USER_ID;
  const isDashboard = variant === 'dashboard';

  // Determine what to show
  const showRiskBars = (isDashboard && isCoveredRisk) || (!isDashboard);
  const showUser = (isDashboard && isCoveredRisk) || (!isDashboard);
  const showCalendarIcon = !isDashboard;
  
  // Get value label and display
  const getValueInfo = () => {
    // Dashboard - Own risks
    if (isDashboard && isOwnRisk && !isCoveredRisk) {
      if (risk.status === 'evaluating') {
        return { label: 'Wert', value: null, isSkeleton: true };
      }
      if (risk.status === 'pending' && lowestOffer) {
        return { label: 'Bestes Angebot', value: `${lowestOffer.premium} €` };
      }
      return { label: 'Wert', value: `${risk.coverageAmount.toLocaleString("de-DE")} €` };
    }
    
    // Dashboard - Covered risks
    if (isDashboard && isCoveredRisk) {
      return { label: 'Prämie', value: `${risk.premium.toLocaleString("de-DE")} €` };
    }
    
    // Marketplace
    if (risk.recommendedPriceRange) {
      return { 
        label: 'Prämie', 
        value: `${risk.recommendedPriceRange.min} - ${risk.recommendedPriceRange.max} €` 
      };
    }
    
    return { label: 'Wert', value: `${risk.coverageAmount.toLocaleString("de-DE")} €` };
  };

  const valueInfo = getValueInfo();

  // Get user display info
  const getUserDisplay = () => {
    // When hideActions is true (e.g., landing page), always show real creator name
    if (hideActions) {
      const user = getUserById(risk.createdByUserId);
      return { 
        name: user ? `${user.firstName} ${user.lastName}` : risk.createdBy,
        isCurrentUser: false,
        avatar: user?.avatar || null
      };
    }
    
    if (isOwnRisk && !isDashboard) {
      return { name: 'Von Dir', isCurrentUser: true, avatar: null };
    }
    const user = getUserById(risk.createdByUserId);
    return { 
      name: user ? `${user.firstName} ${user.lastName}` : risk.createdBy,
      isCurrentUser: false,
      avatar: user?.avatar || null
    };
  };

  const userDisplay = getUserDisplay();

  // Get badge
  const getBadge = () => {
    if (risk.status === 'evaluating') {
      return { label: 'Analyse läuft', variant: 'default' as const };
    }
    if (risk.status === 'draft') {
      return { label: 'Entwurf', variant: 'default' as const };
    }
    if (risk.status === 'completed' && isCoveredRisk) {
      return { label: 'Abgeschlossen', variant: 'default' as const };
    }
    if (isDashboard && isOwnRisk && risk.status === 'pending' && offers.length > 0) {
      return { label: `${offers.length} ${offers.length === 1 ? 'Angebot' : 'Angebote'}`, variant: 'orange' as const };
    }
    if (isDashboard && isCoveredRisk && risk.status === 'active' && risk.expiresAt) {
      const daysLeft = Math.ceil((risk.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft > 0) {
        return { label: `Noch ${daysLeft} ${daysLeft === 1 ? 'Tag' : 'Tage'}`, variant: 'orange' as const };
      }
    }
    return null;
  };

  const badge = getBadge();

  // Get button config
  const getButtonConfig = () => {
    // Dashboard always shows only Details button
    if (isDashboard) {
      return { showOfferButton: false, offerButtonDisabled: false };
    }
    
    // Marketplace
    if (isOwnRisk) {
      return { showOfferButton: true, offerButtonDisabled: true };
    }
    
    return { showOfferButton: true, offerButtonDisabled: false };
  };

  const buttonConfig = getButtonConfig();

  // Calculate risk score if not present
  const riskScore = risk.riskScore ?? calculateRiskScore(risk);

  // Calculate days text
  const daysText = risk.duration === 1 ? "Tag" : "Tage";

  return (
    <div 
      className="bg-[#fdfcfc] box-border content-stretch flex flex-col items-start justify-between pb-[24px] pt-[32px] px-[24px] relative rounded-[16px] group transition-all h-full w-full"
      onMouseEnter={(e) => {
        const borderEl = e.currentTarget.querySelector('[aria-hidden="true"]') as HTMLElement;
        if (borderEl) {
          borderEl.style.borderColor = '#ff671f';
          borderEl.style.borderWidth = '2px';
        }
      }}
      onMouseLeave={(e) => {
        const borderEl = e.currentTarget.querySelector('[aria-hidden="true"]') as HTMLElement;
        if (borderEl) {
          borderEl.style.borderColor = '#e6e5e5';
          borderEl.style.borderWidth = '1px';
        }
      }}
    >
      <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[16px] transition-all" />
      
      {/* Main Content */}
      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
        
        {/* Risk Bars, Title and User Info - 8px gap between Title and User */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          
          {/* Risk Bars and Title - 16px gap between Risk Bars and Title */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            
            {/* Risk Rating Bars */}
            {showRiskBars && (
              <RiskRatingBars riskScore={riskScore} />
            )}
            
            {/* Title with Icon */}
            <div className="content-stretch flex items-start relative shrink-0 w-full">
              <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">
                {risk.title}
              </p>
              {onDelete ? (
                <div 
                  className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px] cursor-pointer hover:bg-[#ffebee] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(risk);
                  }}
                >
                  <DeleteIcon />
                </div>
              ) : !isDashboard && !hideActions && (
                <div 
                  className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px] cursor-pointer hover:bg-[#fff3e0] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onFavoriteToggle) {
                      onFavoriteToggle(risk);
                    }
                  }}
                >
                  <StarIcon filled={isFavorite} />
                </div>
              )}
            </div>
          </div>

          {/* User Info - 8px from Title above (via parent gap-[8px]) */}
          {showUser && (
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[24px] rounded-full overflow-hidden">
                {userDisplay.avatar ? (
                  <img 
                    src={userDisplay.avatar} 
                    alt={userDisplay.name}
                    className="block size-full object-cover"
                  />
                ) : (
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" fill="#D9D9D9" r="12" />
                  </svg>
                )}
              </div>
              <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-center leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">
                <p className="relative shrink-0">{userDisplay.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Value/Premium and Duration - 24px from above block (via parent gap-[24px]) */}
        <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
          
          {/* Value/Premium */}
          <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[47px] items-start min-h-px min-w-px not-italic relative shrink-0">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px] w-full">
              {valueInfo.label}
            </p>
            {valueInfo.isSkeleton ? (
              <Skeleton className="h-[21px] w-full rounded bg-[#d9d9d9]" />
            ) : (
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px] w-full">
                {valueInfo.value}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] w-full">
              Laufzeit
            </p>
            <div className="content-stretch flex gap-[8px] h-[21px] items-center relative shrink-0 w-full">
              {showCalendarIcon && <CalendarIcon />}
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px]">
                {risk.duration} {daysText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      {!hideActions && (
        <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0 w-full mt-[24px]">
          {/* Angebot abgeben Button - NUR im Marketplace */}
          {variant === 'marketplace' && (
            <div 
              className={`${
                buttonConfig.offerButtonDisabled
                  ? 'bg-[#e6e5e5] cursor-not-allowed'
                  : 'bg-[#ff671f] cursor-pointer hover:opacity-90'
              } box-border content-stretch flex gap-[10px] items-center justify-center px-0 py-[8px] relative rounded-[8px] shrink-0 w-full transition-opacity`}
              onClick={() => !buttonConfig.offerButtonDisabled && onTakeRisk?.(risk)}
            >
              <p className={`font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
                buttonConfig.offerButtonDisabled ? 'text-[#4f4a4a]' : 'text-white'
              }`}>
                Angebot abgeben
              </p>
            </div>
          )}
          
          {/* Details Button - NUR im Dashboard */}
          {variant === 'dashboard' && onDetailsClick && (
            <div 
              className="box-border content-stretch flex items-center justify-center h-[46px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#f3f2f2] transition-colors w-full border border-[#e6e5e5]"
              onClick={() => onDetailsClick(risk)}
            >
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">
                Details
              </p>
            </div>
          )}
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute content-stretch flex gap-[8px] items-start left-[24px] top-[-17px]">
          <Badge label={badge.label} variant={badge.variant} />
        </div>
      )}
    </div>
  );
}