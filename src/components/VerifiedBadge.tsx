import { Badge, Tooltip, Box } from "@mui/material";
import { Verified as VerifiedIcon } from "@mui/icons-material";
import { User, isUserVerified, getProfileCompleteness } from "./types/user";
import { ReactNode } from "react";

interface VerifiedBadgeProps {
  user: User | undefined;
  children: ReactNode;
  avatarSize?: number;
}

export function VerifiedBadge({ user, children, avatarSize = 48 }: VerifiedBadgeProps) {
  if (!user || !isUserVerified(user)) {
    return <>{children}</>;
  }

  const iconSize = avatarSize < 60 ? "small" : "medium";
  const profileCompleteness = getProfileCompleteness(user);

  const tooltipContent = (
    <Box sx={{ p: 0.5 }}>
      <Box
        sx={{
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 600,
          fontSize: "13px",
          color: "#ffffff",
          mb: 1,
        }}
      >
        Verifizierter Nutzer
      </Box>
      <Box
        sx={{
          fontFamily: "'Roboto', sans-serif",
          fontSize: "12px",
          color: "#e6e5e5",
          lineHeight: 1.4,
        }}
      >
        Dieser Nutzer hat alle Verifizierungsschritte erfolgreich abgeschlossen:
      </Box>
      <Box
        sx={{
          mt: 1,
          fontFamily: "'Roboto', sans-serif",
          fontSize: "11px",
          color: "#e6e5e5",
        }}
      >
        ✓ Bonitätsprüfung bestanden
        <br />
        ✓ Profil zu {profileCompleteness}% vollständig
        <br />
        ✓ E-Mail verifiziert
        <br />
        ✓ Telefonnummer bestätigt
        <br />
        ✓ Adresse verifiziert
        <br />
        ✓ Bankkonto verknüpft
      </Box>
    </Box>
  );

  return (
    <Tooltip
      title={tooltipContent}
      arrow
      placement="top"
      enterDelay={300}
      enterTouchDelay={700}
      leaveTouchDelay={3000}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#353131",
            borderRadius: 1,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            p: 1.5,
            maxWidth: 280,
          },
        },
        arrow: {
          sx: {
            color: "#353131",
          },
        },
      }}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        badgeContent={
          <Box
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "50%",
              width: iconSize === "small" ? 16 : 20,
              height: iconSize === "small" ? 16 : 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <VerifiedIcon
              sx={{
                color: "#1976d2",
                fontSize: iconSize === "small" ? 14 : 18,
              }}
            />
          </Box>
        }
      >
        {children}
      </Badge>
    </Tooltip>
  );
}
