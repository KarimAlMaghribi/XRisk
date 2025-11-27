import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Slider,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { RiskLevel, RiskCategory, categoryLabels } from "./types/risk";

export interface FilterState {
  riskLevels: RiskLevel[];
  categories: RiskCategory[];
  durationRange: [number, number];
  valueRange: [number, number];
  minRating: number;
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  onApplyFilters,
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleRiskLevelToggle = (level: RiskLevel) => {
    setLocalFilters((prev) => ({
      ...prev,
      riskLevels: prev.riskLevels.includes(level)
        ? prev.riskLevels.filter((l) => l !== level)
        : [...prev.riskLevels, level],
    }));
  };

  const handleCategoryToggle = (category: RiskCategory) => {
    setLocalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      riskLevels: [],
      categories: [],
      durationRange: [1, 14],
      valueRange: [0, 10000],
      minRating: 0,
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e6e5e5",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FilterIcon sx={{ fontSize: 20, color: "#030213" }} />
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#030213",
              }}
            >
              Filter
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Filter Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* Risk Level */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#353131",
                mb: 2,
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Risikoeinschätzung
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[1, 2, 3, 4, 5].map((level) => (
                <FormControlLabel
                  key={level}
                  control={
                    <Checkbox
                      checked={localFilters.riskLevels.includes(level as RiskLevel)}
                      onChange={() => handleRiskLevelToggle(level as RiskLevel)}
                      sx={{
                        color: "#4f4a4a",
                        "&.Mui-checked": { color: "#ff671f" },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {[...Array(level)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 16,
                              height: 8,
                              bgcolor: "#ff671f",
                              borderRadius: "200px",
                            }}
                          />
                        ))}
                        {[...Array(5 - level)].map((_, i) => (
                          <Box
                            key={i + level}
                            sx={{
                              width: 16,
                              height: 8,
                              bgcolor: "#cecaca",
                              borderRadius: "200px",
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "13px",
                          color: "#353131",
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        Level {level}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Category */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#353131",
                mb: 2,
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Kategorie
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {(Object.keys(categoryLabels) as RiskCategory[]).map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={localFilters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      sx={{
                        color: "#4f4a4a",
                        "&.Mui-checked": { color: "#ff671f" },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "13px",
                        color: "#353131",
                        fontVariationSettings: "'wdth' 100",
                      }}
                    >
                      {categoryLabels[category]}
                    </Typography>
                  }
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Duration Range */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#353131",
                mb: 2,
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Laufzeit (Tage)
            </Typography>
            <Slider
              value={localFilters.durationRange}
              onChange={(_, value) =>
                setLocalFilters({ ...localFilters, durationRange: value as [number, number] })
              }
              valueLabelDisplay="auto"
              min={1}
              max={14}
              sx={{
                color: "#ff671f",
                "& .MuiSlider-thumb": { bgcolor: "#ff671f" },
                "& .MuiSlider-track": { bgcolor: "#ff671f" },
                "& .MuiSlider-rail": { bgcolor: "#cecaca" },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "12px",
                  color: "#4f4a4a",
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                {localFilters.durationRange[0]} Tag{localFilters.durationRange[0] !== 1 ? "e" : ""}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "12px",
                  color: "#4f4a4a",
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                {localFilters.durationRange[1]} Tage
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Value Range */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#353131",
                mb: 2,
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Wert (€)
            </Typography>
            <Slider
              value={localFilters.valueRange}
              onChange={(_, value) =>
                setLocalFilters({ ...localFilters, valueRange: value as [number, number] })
              }
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              sx={{
                color: "#ff671f",
                "& .MuiSlider-thumb": { bgcolor: "#ff671f" },
                "& .MuiSlider-track": { bgcolor: "#ff671f" },
                "& .MuiSlider-rail": { bgcolor: "#cecaca" },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "12px",
                  color: "#4f4a4a",
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                {localFilters.valueRange[0].toLocaleString("de-DE")} €
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "12px",
                  color: "#4f4a4a",
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                {localFilters.valueRange[1].toLocaleString("de-DE")} €
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Min Rating */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#353131",
                mb: 2,
                fontVariationSettings: "'wdth' 100",
              }}
            >
              Minimale Bewertung
            </Typography>
            <Slider
              value={localFilters.minRating}
              onChange={(_, value) =>
                setLocalFilters({ ...localFilters, minRating: value as number })
              }
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
              marks={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
              ]}
              sx={{
                color: "#ff671f",
                "& .MuiSlider-thumb": { bgcolor: "#ff671f" },
                "& .MuiSlider-track": { bgcolor: "#ff671f" },
                "& .MuiSlider-rail": { bgcolor: "#cecaca" },
                "& .MuiSlider-markLabel": {
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "12px",
                  color: "#4f4a4a",
                },
              }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: "1px solid #e6e5e5",
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={handleReset}
            sx={{
              borderColor: "#e6e5e5",
              color: "#353131",
              textTransform: "none",
              fontFamily: "'Roboto', sans-serif",
              "&:hover": { borderColor: "#cecaca" },
            }}
          >
            Zurücksetzen
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleApply}
            sx={{
              bgcolor: "#ff671f",
              color: "#e6e5e5",
              textTransform: "none",
              fontFamily: "'Roboto', sans-serif",
              "&:hover": { bgcolor: "#ff671f", opacity: 0.9 },
            }}
          >
            Anwenden
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
