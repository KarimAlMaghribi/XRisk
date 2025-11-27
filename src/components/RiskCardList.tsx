import {
  Risk,
  categoryLabels,
} from "./types/risk";
import svgPaths from "../imports/svg-46hs940qrm";
import { Box, Typography } from "@mui/material";
import { getOffersByRisk } from "./lib/database";
import { StatusBadge, CustomBadge } from "./StatusBadge";
import { RiskRatingBars } from "./RiskRatingBars";
import { Star } from "lucide-react";

interface RiskCardListProps {
  risk: Risk;
  onTakeRisk: (risk: Risk) => void;
  onDetailsClick?: (risk: Risk) => void;
  onDelete?: (risk: Risk) => void;
  onPublish?: (risk: Risk) => void;
  onFavoriteToggle?: (risk: Risk) => void;
  customActionLabel?: string;
  customActionDisabled?: boolean;
  customBadges?: React.ReactNode;
  hideAction?: boolean;
  hidePrimaryAction?: boolean;
  showDelete?: boolean;
  showStatusBadge?: boolean;
  showOffersBadge?: boolean;
  showDescription?: boolean;
  isOwnRisk?: boolean;
}

// Delete Icon Component
function DeleteIcon() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M7.5 8.25V12.75" id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M10.5 8.25V12.75" id="Vector_2" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3357c900} id="Vector_3" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M2.25 4.5H15.75" id="Vector_4" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p19dfc880} id="Vector_5" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

export function RiskCardList({ 
  risk, 
  onTakeRisk, 
  onDetailsClick, 
  onDelete, 
  onPublish,
  onFavoriteToggle, 
  customActionLabel, 
  customActionDisabled, 
  customBadges, 
  hideAction, 
  hidePrimaryAction, 
  showDelete,
  showStatusBadge = true,
  showOffersBadge = true,
  showDescription = true,
  isOwnRisk = false
}: RiskCardListProps) {
  const offers = getOffersByRisk(risk.id);

  const showBadges = (showStatusBadge && risk.status !== 'draft') || (showOffersBadge && offers.length > 0 && risk.status !== 'draft') || customBadges;

  return (
    <Box
      component="article"
      aria-label={`Risiko: ${risk.title}`}
      sx={{
        bgcolor: "#fdfcfc",
        borderRadius: "16px",
        p: 3,
        display: "flex",
        gap: 3,
        alignItems: "center",
        position: "relative",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        border: "1px solid transparent",
        transition: "all 0.2s",
        "&:hover": {
          border: "1px solid #ff671f",
          boxShadow: "0px 4px 16px rgba(255, 103, 31, 0.25)",
        },
      }}
    >
      {/* Status Badges - absolutely positioned outside */}
      {showBadges && (
        <div className="absolute content-stretch flex gap-[8px] items-start left-[24px] top-[-14px]" data-name="Status Container">
          {customBadges ? (
            customBadges
          ) : (
            <>
              {/* Status Badge */}
              {showStatusBadge && risk.status !== 'draft' && (
                <StatusBadge status={risk.status} />
              )}
              
              {/* Offers Badge */}
              {showOffersBadge && offers.length > 0 && risk.status !== 'draft' && (
                <CustomBadge 
                  label={`${offers.length} ${offers.length === 1 ? 'Angebot' : 'Angebote'}`}
                  variant="success"
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Left Section - Risk Info */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Risk Rating Bars */}
        <RiskRatingBars riskScore={risk.riskScore || 0} />

        {/* Title and Favorite */}
        <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
          <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#353131] text-[16px]">
            {risk.title}
          </p>
          {!isOwnRisk && onFavoriteToggle && (
            <div 
              className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px] cursor-pointer hover:bg-[#fff3e0] transition-colors" 
              data-name="Styled(button)"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(risk);
              }}
            >
              <Star 
                size={18} 
                className={risk.isFavorite ? "fill-[#ff671f] stroke-[#ff671f]" : "stroke-[#4f4a4a]"}
              />
            </div>
          )}
          {showDelete && onDelete && (
            <div 
              className="content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[24px] cursor-pointer hover:bg-[#ffebee] transition-colors" 
              data-name="Styled(button)"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(risk);
              }}
            >
              <DeleteIcon />
            </div>
          )}
        </div>

        {/* User and Risk Details - In a Row */}
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
          {/* User */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
            <div className="relative shrink-0 size-[24px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" fill="var(--fill-0, #D9D9D9)" id="Ellipse 4" r="12" />
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#4f4a4a] text-[12px] text-nowrap whitespace-pre">
              {risk.createdBy}
            </p>
          </div>

          <Typography component="span" sx={{ color: "#cecaca" }}>•</Typography>

          {/* Premium or Value */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4f4a4a] text-[12px]">
              {risk.recommendedPriceRange ? 'Prämie:' : 'Wert:'}
            </p>
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#353131] text-[14px]">
              {risk.recommendedPriceRange 
                ? `${risk.recommendedPriceRange.min} - ${risk.recommendedPriceRange.max} €`
                : `${risk.coverageAmount.toLocaleString("de-DE")} €`
              }
            </p>
          </div>

          <Typography component="span" sx={{ color: "#cecaca" }}>•</Typography>

          {/* Duration */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#353131] text-[14px]">
              {risk.duration} {risk.duration === 1 ? "Tag" : "Tage"}
            </p>
          </div>
        </div>
      </Box>

      {/* Buttons - Right Section */}
      {!hideAction && (
        <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
          {risk.status === "draft" ? (
            // Draft state: Show Edit and Publish buttons
            <>
              <div 
                className="box-border content-stretch flex h-[46px] items-center justify-center px-6 relative rounded-[8px] cursor-pointer hover:bg-[#f3f2f2] transition-colors" 
                data-name="Button"
                onClick={() => onDetailsClick?.(risk)}
              >
                <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">
                  Bearbeiten
                </p>
              </div>
              <div 
                className="box-border content-stretch flex h-[46px] items-center justify-center px-6 relative rounded-[8px] bg-[#00a63e] cursor-pointer hover:opacity-90 transition-opacity" 
                data-name="Button"
                onClick={() => onPublish?.(risk)}
              >
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-white text-[16px] text-nowrap whitespace-pre">
                  Veröffentlichen
                </p>
              </div>
            </>
          ) : (
            // Normal state
            <>
              {showDescription && onDetailsClick && (
                <div 
                  className="box-border content-stretch flex h-[46px] items-center justify-center px-6 relative rounded-[8px] cursor-pointer hover:bg-[#f3f2f2] transition-colors" 
                  data-name="Button"
                  onClick={() => onDetailsClick(risk)}
                >
                  <div aria-hidden="true" className="absolute border border-[#e6e5e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[#353131] text-[16px] text-nowrap whitespace-pre">
                    Details
                  </p>
                </div>
              )}
              {!hidePrimaryAction && (
                <div 
                  className={`box-border content-stretch flex h-[46px] items-center justify-center px-6 relative rounded-[8px] ${
                    customActionDisabled 
                      ? "bg-[#e6e5e5] cursor-not-allowed" 
                      : "bg-[#ff671f] cursor-pointer hover:opacity-90"
                  } transition-opacity`}
                  data-name="Button"
                  onClick={() => !customActionDisabled && onTakeRisk(risk)}
                >
                  <p className={`font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 ${
                    customActionDisabled ? "text-[#4f4a4a]" : "text-white"
                  } text-[16px] text-nowrap whitespace-pre`}>
                    {customActionLabel || "Angebot abgeben"}
                  </p>
                </div>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
