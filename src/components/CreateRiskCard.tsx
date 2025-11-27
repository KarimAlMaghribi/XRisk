import { Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface CreateRiskCardProps {
  onClick?: () => void;
}

export function CreateRiskCard({ onClick }: CreateRiskCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 360,
        border: "2px dashed rgba(255, 103, 31, 0.3)",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: "rgba(255, 103, 31, 0.02)",
        "&:hover": {
          bgcolor: "rgba(255, 103, 31, 0.08)",
          borderColor: "rgba(255, 103, 31, 0.5)",
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(255, 103, 31, 0.15)",
        },
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "rgba(255, 103, 31, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          "&&:hover": {
            bgcolor: "rgba(255, 103, 31, 0.15)",
            transform: "scale(1.1)",
          },
        }}
      >
        <AddIcon
          sx={{
            fontSize: 32,
            color: "#ff671f",
          }}
        />
      </Box>
      <Box
        className="body-base-medium text-brand"
        sx={{
          textAlign: "center",
        }}
      >
        Neues Risiko anlegen
      </Box>
    </Box>
  );
}
