import { useState, useRef, useEffect } from "react";
import { Box, Typography, InputBase, Paper, ClickAwayListener } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { Risk, categoryLabels } from "../types/risk";
import svgPaths from "../imports/svg-uh0650197e";

interface MarketplaceSearchBarProps {
  risks: Risk[];
  onSearch: (query: string) => void;
  onFavoriteToggle: (risk: Risk) => void;
  favoriteRiskIds: Set<string>;
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

export function MarketplaceSearchBar({ 
  risks, 
  onSearch, 
  onFavoriteToggle,
  favoriteRiskIds 
}: MarketplaceSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Risk[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter risks based on search query (case-insensitive)
  const filterRisks = (query: string): Risk[] => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    
    return risks.filter((risk) => {
      const titleMatch = risk.title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = risk.description.toLowerCase().includes(lowerQuery);
      const categoryLabel = categoryLabels[risk.category].toLowerCase();
      const categoryMatch = categoryLabel.includes(lowerQuery);
      
      return titleMatch || descriptionMatch || categoryMatch;
    }).slice(0, 5); // Limit to 5 suggestions
  };

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredRisks = filterRisks(searchQuery);
      setSuggestions(filteredRisks);
      // Don't automatically show suggestions on every render
      // Only show when user is actively typing or focusing
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, risks]);

  const handleSearch = () => {
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (risk: Risk) => {
    setSearchQuery(risk.title);
    setShowSuggestions(false);
    onSearch(risk.title);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
        {/* Search Input */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
            py: 2.5,
            backgroundColor: "#fdfcfc",
            border: "2px solid #e6e5e5",
            borderRadius: "16px",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#ff671f",
            },
            "&:focus-within": {
              borderColor: "#ff671f",
              boxShadow: "0 0 0 4px rgba(255, 103, 31, 0.1)",
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 28, color: "#ff671f" }} />
          
          <InputBase
            ref={inputRef}
            placeholder="Was möchtest du absichern?"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Show suggestions when user is actively typing
              if (e.target.value.trim()) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchQuery.trim() && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            sx={{
              flex: 1,
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              color: "#353131",
              "& input::placeholder": {
                color: "#9E9E9E",
                opacity: 1,
              },
            }}
          />

          <Box
            onClick={handleSearch}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 3,
              py: 1.5,
              backgroundColor: "#ff671f",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#e65a1a",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              Suchen
            </Typography>
          </Box>
        </Paper>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: "#fdfcfc",
                borderRadius: "16px",
                border: "1px solid #e6e5e5",
                maxHeight: "400px",
                overflow: "auto",
              }}
            >
            <Box sx={{ p: 2 }}>
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#4f4a4a",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 1,
                  px: 2,
                }}
              >
                Vorschläge
              </Typography>

              {suggestions.map((risk) => (
                <Box
                  key={risk.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#fff3e0",
                    },
                  }}
                >
                  <Box
                    onClick={() => handleSuggestionClick(risk)}
                    sx={{ flex: 1 }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353131",
                        mb: 0.5,
                        lineHeight: 1.4,
                      }}
                    >
                      {risk.title}
                    </Typography>
                    
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        color: "#4f4a4a",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      {categoryLabels[risk.category]} • {risk.duration} {risk.duration === 1 ? "Tag" : "Tage"} • {risk.coverageAmount.toLocaleString("de-DE")} €
                    </Typography>
                    
                    {/* Premium Range */}
                    {risk.recommendedPriceRange && (
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
                          color: "#ff671f",
                          fontWeight: 600,
                        }}
                      >
                        Prämie: {risk.recommendedPriceRange.min.toLocaleString("de-DE")} € - {risk.recommendedPriceRange.max.toLocaleString("de-DE")} €
                      </Typography>
                    )}
                  </Box>

                  {/* Favorite Icon */}
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavoriteToggle(risk);
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#fff3e0",
                      },
                    }}
                  >
                    <StarIcon filled={favoriteRiskIds.has(risk.id)} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
          </ClickAwayListener>
        )}
      </Box>
  );
}
