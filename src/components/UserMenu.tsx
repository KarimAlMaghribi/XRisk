import { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Mail as MailIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { currentUser } from "./lib/current-user";

interface UserMenuProps {
  onLogout: () => void;
  variant?: "sidebar" | "appbar";
  onNavigate?: (page: string) => void;
}

export function UserMenu({ onLogout, variant = "sidebar", onNavigate }: UserMenuProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (variant === "appbar") {
    return (
      <Box sx={{ position: "relative" }}>
        <Box
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            px: 1.5,
            py: 1,
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(255, 103, 31, 0.08)",
            },
          }}
        >
          <Avatar
            alt={`${currentUser.firstName} ${currentUser.lastName}`}
            src={currentUser.avatar}
            sx={{ width: 32, height: 32 }}
          />
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Box
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: "#353131",
              }}
            >
              {currentUser.firstName} {currentUser.lastName}
            </Box>
            <Box
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                color: "#4f4a4a",
                lineHeight: 1.2,
              }}
            >
              Vertrauensscore: {currentUser.score} / 100
            </Box>
          </Box>
          {userMenuOpen ? (
            <ExpandLessIcon sx={{ color: "#4f4a4a", fontSize: 20 }} />
          ) : (
            <ExpandMoreIcon sx={{ color: "#4f4a4a", fontSize: 20 }} />
          )}
        </Box>

        {/* Dropdown Menu */}
        {userMenuOpen && (
          <Box
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: 220,
              bgcolor: "rgba(253, 252, 252, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 2,
              border: "1px solid rgba(230, 229, 229, 0.4)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            <List sx={{ p: 1 }}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => onNavigate?.("home")}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 103, 31, 0.06)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <DashboardIcon sx={{ color: "#4f4a4a", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4f4a4a",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 103, 31, 0.06)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AccountIcon sx={{ color: "#4f4a4a", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Konto"
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4f4a4a",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => onNavigate?.("messages")}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 103, 31, 0.06)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <MailIcon sx={{ color: "#4f4a4a", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nachrichten"
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4f4a4a",
                      },
                    }}
                  />
                  <Chip
                    label="3"
                    size="small"
                    sx={{
                      bgcolor: "#ff671f",
                      color: "white",
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      height: 20,
                      minWidth: 20,
                      "& .MuiChip-label": {
                        px: 0.75,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={onLogout}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(245, 73, 0, 0.06)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <LogoutIcon sx={{ color: "#f54900", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Abmelden"
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#f54900",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
      </Box>
    );
  }

  // Sidebar variant
  return (
    <ListItem disablePadding sx={{ mb: 1 }}>
      <Box sx={{ width: "100%" }}>
        <ListItemButton
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          sx={{
            px: 2.5,
            py: 1.5,
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(255, 103, 31, 0.08)",
              backdropFilter: "blur(8px)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Avatar
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              src={currentUser.avatar}
              sx={{ width: 32, height: 32 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={`${currentUser.firstName} ${currentUser.lastName}`}
            secondary={`Vertrauensscore: ${currentUser.score} / 100`}
            primaryTypographyProps={{
              className: "text-lg-semibold text-secondary",
            }}
            secondaryTypographyProps={{
              sx: {
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                color: "#4f4a4a",
              },
            }}
          />
          {userMenuOpen ? (
            <ExpandLessIcon sx={{ color: "#4f4a4a" }} />
          ) : (
            <ExpandMoreIcon sx={{ color: "#4f4a4a" }} />
          )}
        </ListItemButton>

        {/* Submenu */}
        {userMenuOpen && (
          <List sx={{ pl: 2, pt: 1 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavigate?.("home")}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.06)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <DashboardIcon sx={{ color: "#4f4a4a", fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#4f4a4a",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavigate?.("account")}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.06)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <AccountIcon sx={{ color: "#4f4a4a", fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Konto"
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#4f4a4a",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavigate?.("messages")}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.06)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <MailIcon sx={{ color: "#4f4a4a", fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Nachrichten"
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#4f4a4a",
                    },
                  }}
                />
                <Chip
                  label="3"
                  size="small"
                  sx={{
                    bgcolor: "#ff671f",
                    color: "white",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    height: 20,
                    minWidth: 20,
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={onLogout}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(245, 73, 0, 0.06)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LogoutIcon sx={{ color: "#f54900", fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Abmelden"
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#f54900",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Box>
    </ListItem>
  );
}
