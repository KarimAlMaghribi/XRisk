import { Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface CreateRiskCardListProps {
  onClick?: () => void;
}

export function CreateRiskCardList({ onClick }: CreateRiskCardListProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: "100%",
        minHeight: 120,
        border: "2px dashed rgba(255, 103, 31, 0.3)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: "rgba(255, 103, 31, 0.02)",
        px: 3,
        py: 2,
        "&:hover": {
          bgcolor: "rgba(255, 103, 31, 0.08)",
          borderColor: "rgba(255, 103, 31, 0.5)",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 16px rgba(255, 103, 31, 0.15)",
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: "rgba(255, 103, 31, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
      >
        <AddIcon
          sx={{
            fontSize: 24,
            color: "#ff671f",
          }}
        />
      </Box>
      <Box
        className="body-sm-medium text-brand"
      >
        Neues Risiko anlegen
      </Box>
    </Box>
  );
}
