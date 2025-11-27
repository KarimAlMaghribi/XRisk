import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  Pagination,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Bolt as BoltIcon,
  FilterList as FilterListIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import { communityRisks } from "./lib/community-mock-data";
import {
  calculateRiskScore,
  getRiskLevel,
  Risk,
  categoryLabels,
} from "./types/risk";
import { TakeRiskModal } from "./TakeRiskModal";
import { RiskCard } from "./RiskCard";
import { FilterDrawer, FilterState } from "./FilterDrawer";
import { UserProfileDialog } from "./UserProfileDialog";
import { RiskDetailDialog } from "./RiskDetailDialog";
import { MarketplaceSearchBar } from "./MarketplaceSearchBar";
import { RiskToleranceSelector, RiskToleranceLevel } from "./RiskToleranceSelector";
import { users } from "./lib/user-mock-data";
import { CURRENT_USER_ID } from "./lib/current-user";

type MarketplaceFilter = "all" | "own" | "favorites";

const ITEMS_PER_PAGE = 20;

interface MarketplaceProps {
  onRiskDetails?: (risk: Risk) => void;
  onTakeRisk?: (risk: Risk) => void;
}

export function Marketplace({ onRiskDetails, onTakeRisk }: MarketplaceProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [marketplaceFilter, setMarketplaceFilter] = useState<MarketplaceFilter>("all");
  const [favoriteRiskIds, setFavoriteRiskIds] = useState<Set<string>>(new Set(["c1", "c5", "c8"])); // Mock favorites
  const [searchQuery, setSearchQuery] = useState("");
  const [riskTolerance, setRiskTolerance] = useState<RiskToleranceLevel>(null);
  const [filters, setFilters] = useState<FilterState>({
    riskLevels: [],
    categories: [],
    durationRange: [1, 14],
    valueRange: [0, 10000],
    minRating: 0,
  });

  const handleTakeRisk = (risk: Risk) => {
    if (onTakeRisk) {
      onTakeRisk(risk);
    } else {
      setSelectedRisk(risk);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRisk(null);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleMarketplaceFilterChange = (event: React.SyntheticEvent, newValue: MarketplaceFilter) => {
    setMarketplaceFilter(newValue);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setProfileDialogOpen(true);
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleDetailsClick = (risk: Risk) => {
    if (onRiskDetails) {
      onRiskDetails(risk);
    } else {
      setSelectedRisk(risk);
      setDetailDialogOpen(true);
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedRisk(null);
  };

  const handleFavoriteToggle = (risk: Risk) => {
    setFavoriteRiskIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(risk.id)) {
        newSet.delete(risk.id);
      } else {
        newSet.add(risk.id);
      }
      return newSet;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Get pending risks (marketplace listings)
  const allPendingRisks = communityRisks.filter((r) => r.status === "pending");
  
  // Calculate counts for tab labels
  const allRisksCount = allPendingRisks.length;
  const ownRisksCount = allPendingRisks.filter((risk) => risk.createdByUserId === CURRENT_USER_ID).length;
  const favoritesCount = allPendingRisks.filter((risk) => favoriteRiskIds.has(risk.id)).length;

  // Apply marketplace filter (Alle/Eigene/Favoriten)
  let pendingRisks = [...allPendingRisks];
  if (marketplaceFilter === "own") {
    pendingRisks = pendingRisks.filter((risk) => risk.createdByUserId === CURRENT_USER_ID);
  } else if (marketplaceFilter === "favorites") {
    pendingRisks = pendingRisks.filter((risk) => favoriteRiskIds.has(risk.id));
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    pendingRisks = pendingRisks.filter((risk) => {
      const titleMatch = risk.title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = risk.description.toLowerCase().includes(lowerQuery);
      const categoryLabel = categoryLabels[risk.category].toLowerCase();
      const categoryMatch = categoryLabel.includes(lowerQuery);
      
      return titleMatch || descriptionMatch || categoryMatch;
    });
  }

  // Apply filters
  const filteredRisks = pendingRisks.filter((risk) => {
    const riskLevel = getRiskLevel(calculateRiskScore(risk));
    
    // Risk level filter
    if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(riskLevel)) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(risk.category)) {
      return false;
    }

    // Duration filter
    if (risk.duration < filters.durationRange[0] || risk.duration > filters.durationRange[1]) {
      return false;
    }

    // Value filter
    if (risk.coverageAmount < filters.valueRange[0] || risk.coverageAmount > filters.valueRange[1]) {
      return false;
    }

    // Rating filter (mocked for now, always 4.8)
    if (4.8 < filters.minRating) {
      return false;
    }

    return true;
  });

  // Count active filters
  const activeFilterCount =
    filters.riskLevels.length +
    filters.categories.length +
    (filters.durationRange[0] !== 1 || filters.durationRange[1] !== 14 ? 1 : 0) +
    (filters.valueRange[0] !== 0 || filters.valueRange[1] !== 10000 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  // Pagination
  const totalPages = Math.ceil(filteredRisks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRisks = filteredRisks.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "32px",
            color: "#353131",
            mb: 2,
          }}
        >
          Risikobörse
        </Typography>
        <Typography className="body-base text-primary">
          Übernehmen Sie Risiken und verdienen Sie Prämien
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mt: 1 }}>
        <MarketplaceSearchBar
          risks={communityRisks.filter((r) => r.status === "pending")}
          onSearch={handleSearch}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteRiskIds={favoriteRiskIds}
        />
      </Box>

      {/* Risk Tolerance Selector */}
      <Box>
        <RiskToleranceSelector
          value={riskTolerance}
          onChange={setRiskTolerance}
        />
      </Box>

      {/* Marketplace Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "#e6e5e5" }}>
        <Tabs
          value={marketplaceFilter}
          onChange={handleMarketplaceFilterChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#ff671f",
              height: 2,
            },
          }}
        >
          <Tab
            label={`Alle (${allRisksCount})`}
            value="all"
            icon={<PublicIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            sx={{
              minHeight: 48,
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#9e9e9e",
              px: 2,
              "&.Mui-selected": {
                color: "#ff671f",
                fontWeight: 500,
              },
              "&:hover": {
                color: "#4f4a4a",
              },
            }}
          />
          <Tab
            label={`Eigene (${ownRisksCount})`}
            value="own"
            icon={<PersonIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            sx={{
              minHeight: 48,
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#9e9e9e",
              px: 2,
              "&.Mui-selected": {
                color: "#ff671f",
                fontWeight: 500,
              },
              "&:hover": {
                color: "#4f4a4a",
              },
            }}
          />
          <Tab
            label={`Favoriten (${favoritesCount})`}
            value="favorites"
            icon={<StarIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            sx={{
              minHeight: 48,
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#9e9e9e",
              px: 2,
              "&.Mui-selected": {
                color: "#ff671f",
                fontWeight: 500,
              },
              "&:hover": {
                color: "#4f4a4a",
              },
            }}
          />
        </Tabs>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography className="body-sm text-secondary">
            {filteredRisks.length} {filteredRisks.length === 1 ? 'Angebot' : 'Angebote'} gefunden
          </Typography>
        </Box>

        {/* Filter Button */}
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setFilterDrawerOpen(true)}
          sx={{
            borderColor: "#e6e5e5",
            color: "#353131",
            textTransform: "none",
            fontFamily: "'Roboto', sans-serif",
            px: 2,
            position: "relative",
            "&:hover": { borderColor: "#cecaca" },
          }}
        >
          Filter
          {activeFilterCount > 0 && (
            <Chip
              label={activeFilterCount}
              size="small"
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                height: 20,
                minWidth: 20,
                bgcolor: "#ff671f",
                color: "#e6e5e5",
                fontSize: "11px",
                fontFamily: "'Inter', sans-serif",
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
        </Button>
      </Box>

      {/* Risk Cards */}
      {filteredRisks.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            bgcolor: "#f3f2f2",
            borderRadius: 1,
          }}
        >
          <Typography className="body-sm text-secondary">
            {marketplaceFilter === "own"
              ? "Sie haben noch keine eigenen Risiken erstellt."
              : marketplaceFilter === "favorites"
              ? "Sie haben noch keine Favoriten gespeichert."
              : "Keine Risiken gefunden. Passen Sie die Filter an."}
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 3,
              maxWidth: "100%",
              alignItems: "stretch",
              "@media (min-width: 1400px)": {
                gridTemplateColumns: "repeat(4, 1fr)",
              },
            }}
          >
            {paginatedRisks.map((risk) => {
              return (
                <Box key={risk.id} sx={{ minWidth: "320px", display: "flex" }}>
                  <RiskCard 
                    risk={risk} 
                    onTakeRisk={handleTakeRisk} 
                    onDetailsClick={handleDetailsClick}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={favoriteRiskIds.has(risk.id)}
                    variant="marketplace"
                  />
                </Box>
              );
            })}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                  },
                  "& .Mui-selected": {
                    bgcolor: "#ff671f !important",
                    color: "#e6e5e5",
                    "&:hover": {
                      bgcolor: "#e05a1b !important",
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Take Risk Modal */}
      <TakeRiskModal
        open={modalOpen}
        onClose={handleCloseModal}
        risk={selectedRisk}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />

      {/* User Profile Dialog */}
      <UserProfileDialog
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        user={selectedUserId ? users[selectedUserId] : null}
      />

      {/* Risk Detail Dialog */}
      <RiskDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        risk={selectedRisk}
        onTakeRisk={handleTakeRisk}
        onUserClick={handleUserClick}
      />
    </Box>
  );
}
