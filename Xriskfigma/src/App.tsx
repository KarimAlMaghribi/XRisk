import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Marketplace } from "./components/Marketplace";
import { DesignSystem } from "./components/DesignSystem";
import { LandingPage } from "./components/LandingPage";
import { RisktakerLandingPage } from "./components/RisktakerLandingPage";
import { RiskInputModal } from "./components/RiskInputModal";
import { UserMenu } from "./components/UserMenu";
import { Messages } from "./components/Messages";
import { AccountSettings } from "./components/AccountSettings";
import { RiskDetailPage } from "./components/RiskDetailPage";
import { TakeRiskPage } from "./components/TakeRiskPage";
import { TakeRiskModal } from "./components/TakeRiskModal";
import { ImpressumPage } from "./components/legal/ImpressumPage";
import { DatenschutzPage } from "./components/legal/DatenschutzPage";
import { AGBPage } from "./components/legal/AGBPage";
import { Risk } from "./types/risk";
import { toast } from "sonner@2.0.3";
import { currentUser } from "./lib/current-user";
import { mockConversations } from "./lib/messages-mock-data";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  Button,
  Container,
  ThemeProvider,
  createTheme,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import { Toaster } from "./components/ui/sonner";
import {
  Home as HomeIcon,
  Bolt as BoltIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Mail as MailIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import imgImage1 from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";

type Page =
  | "home"
  | "marketplace"
  | "messages"
  | "account"
  | "designsystem"
  | "risk-detail"
  | "take-risk"
  | "impressum"
  | "datenschutz"
  | "agb";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff671f",
      light: "#ff8548",
      dark: "#e05a1b",
      contrastText: "#e6e5e5",
    },
    secondary: {
      main: "#353131",
      light: "#4f4a4a",
      dark: "#030213",
    },
    background: {
      default: "#fdfcfc",
      paper: "#ffffff",
    },
    text: {
      primary: "#353131",
      secondary: "#4f4a4a",
    },
    divider: "#e6e5e5",
    success: {
      main: "#00a63e",
    },
    error: {
      main: "#f54900",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 900,
      fontSize: "32px",
      color: "#353131",
    },
    h6: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 900,
      fontSize: "24px",
    },
    body1: {
      fontFamily: "'Inter', sans-serif",
      fontSize: "16px",
    },
    body2: {
      fontFamily: "'Inter', sans-serif",
      fontSize: "14px",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid #e6e5e5",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
          fontSize: "16px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 200,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            "& fieldset": {
              borderColor: "#e6e5e5",
              "& legend": {
                fontSize: "0.75em",
              },
            },
            "&:hover fieldset": {
              borderColor: "#ff671f",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff671f",
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root": {
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            color: "#4F4A4A",
            backgroundColor: "#ffffff",
            paddingLeft: "4px",
            paddingRight: "4px",
            "&.Mui-focused": {
              color: "#ff671f",
            },
            "&.MuiInputLabel-shrink": {
              backgroundColor: "#ffffff",
            },
          },
        },
      },
    },
  },
});

const drawerWidthExpanded = 280;
const drawerWidthCollapsed = 72;

interface DrawerContentProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  onLogoClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenRiskModal: () => void;
  isMobile: boolean;
}

function DrawerContent({
  currentPage,
  setCurrentPage,
  onLogout,
  onLogoClick,
  isCollapsed,
  onToggleCollapse,
  onOpenRiskModal,
  isMobile,
}: DrawerContentProps) {
  return (
    <>
      <List sx={{ pt: 0 }}>
        {/* Logo */}
        <ListItem
          sx={{
            mb: 3,
            px: isCollapsed ? 0 : 1,
            justifyContent: isCollapsed
              ? "center"
              : "flex-start",
          }}
        >
          <Tooltip
            title={isCollapsed ? "Zur Startseite" : ""}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <Box
              component="img"
              src={imgImage1}
              alt="XRISK Logo"
              onClick={onLogoClick}
              sx={{
                height: isCollapsed ? 32 : 48,
                width: isCollapsed ? 37 : 55,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 0.7,
                },
              }}
            />
          </Tooltip>
        </ListItem>

        {/* Neues Risiko Button */}
        <ListItem sx={{ mb: 2, px: isCollapsed ? 0 : 1 }}>
          {isCollapsed ? (
            <Tooltip
              title="Neues Risiko anlegen"
              placement="right"
            >
              <IconButton
                onClick={onOpenRiskModal}
                sx={{
                  bgcolor: "#ff671f",
                  color: "white",
                  width: 48,
                  height: 48,
                  boxShadow:
                    "0 4px 16px rgba(255, 103, 31, 0.25)",
                  "&:hover": {
                    bgcolor: "#e05a1b",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<AddIcon />}
              onClick={onOpenRiskModal}
              sx={{
                py: 1.5,
                boxShadow:
                  "0 4px 16px rgba(255, 103, 31, 0.25)",
              }}
            >
              Neues Risiko anlegen
            </Button>
          )}
        </ListItem>

        {/* User Profile Header */}
        {!isCollapsed && (
          <>
            <ListItem sx={{ mb: 3, px: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  width: "100%",
                }}
              >
                <Avatar
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  src={currentUser.avatar}
                  sx={{ width: 40, height: 40 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "#353131",
                      lineHeight: 1.2,
                    }}
                  >
                    {currentUser.firstName}{" "}
                    {currentUser.lastName}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        color: "#4f4a4a",
                        lineHeight: 1.2,
                      }}
                    >
                      Vertrauensscore: {currentUser.score} / 100
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </ListItem>
          </>
        )}

        {isCollapsed && (
          <ListItem
            sx={{ mb: 3, px: 0, justifyContent: "center" }}
          >
            <Tooltip
              title={`${currentUser.firstName} ${currentUser.lastName}`}
              placement="right"
            >
              <Avatar
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                src={currentUser.avatar}
                sx={{
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                }}
                onClick={() => setCurrentPage("account")}
              />
            </Tooltip>
          </ListItem>
        )}

        {/* Divider */}
        <Box
          sx={{ mb: 2, height: "1px", bgcolor: "#e6e5e5" }}
        />

        {/* Home */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <Tooltip
            title={isCollapsed ? "Home" : ""}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              selected={currentPage === "home"}
              onClick={() => setCurrentPage("home")}
              sx={{
                px: isCollapsed ? 0 : 2.5,
                py: 1.5,
                borderRadius: 2,
                position: "relative",
                transition:
                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                justifyContent: isCollapsed
                  ? "center"
                  : "flex-start",
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 103, 31, 0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 103, 31, 0.2)",
                  boxShadow:
                    "0 4px 12px rgba(255, 103, 31, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.15)",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 103, 31, 0.06)",
                  backdropFilter: "blur(8px)",
                },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: isCollapsed ? "auto" : 36 }}
              >
                <HomeIcon
                  sx={{
                    color:
                      currentPage === "home"
                        ? "#ff671f"
                        : "#4f4a4a",
                    fontSize: 22,
                    transition: "all 0.2s ease",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Home"
                  primaryTypographyProps={{
                    className:
                      currentPage === "home"
                        ? "text-lg-semibold text-primary"
                        : "text-lg-semibold text-secondary",
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Riskobörse */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <Tooltip
            title={isCollapsed ? "Riskobörse" : ""}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              selected={currentPage === "marketplace"}
              onClick={() => setCurrentPage("marketplace")}
              sx={{
                px: isCollapsed ? 0 : 2.5,
                py: 1.5,
                borderRadius: 2,
                position: "relative",
                transition:
                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                justifyContent: isCollapsed
                  ? "center"
                  : "flex-start",
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 103, 31, 0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 103, 31, 0.2)",
                  boxShadow:
                    "0 4px 12px rgba(255, 103, 31, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.15)",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 103, 31, 0.06)",
                  backdropFilter: "blur(8px)",
                },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: isCollapsed ? "auto" : 36 }}
              >
                <BoltIcon
                  sx={{
                    color:
                      currentPage === "marketplace"
                        ? "#ff671f"
                        : "#4f4a4a",
                    fontSize: 22,
                    transition: "all 0.2s ease",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Riskobörse"
                  primaryTypographyProps={{
                    className:
                      currentPage === "marketplace"
                        ? "text-lg-semibold text-primary"
                        : "text-lg-semibold text-secondary",
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Nachrichten */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <Tooltip
            title={isCollapsed ? "Nachrichten" : ""}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              selected={currentPage === "messages"}
              onClick={() => setCurrentPage("messages")}
              sx={{
                px: isCollapsed ? 0 : 2.5,
                py: 1.5,
                borderRadius: 2,
                position: "relative",
                transition:
                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                justifyContent: isCollapsed
                  ? "center"
                  : "flex-start",
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 103, 31, 0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 103, 31, 0.2)",
                  boxShadow:
                    "0 4px 12px rgba(255, 103, 31, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.15)",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 103, 31, 0.06)",
                  backdropFilter: "blur(8px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? "auto" : 36,
                  position: "relative",
                }}
              >
                <MailIcon
                  sx={{
                    color:
                      currentPage === "messages"
                        ? "#ff671f"
                        : "#4f4a4a",
                    fontSize: 22,
                    transition: "all 0.2s ease",
                  }}
                />
                {isCollapsed &&
                  mockConversations.reduce(
                    (sum, conv) => sum + conv.unreadCount,
                    0,
                  ) > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        bgcolor: "#ff671f",
                        color: "white",
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {mockConversations.reduce(
                        (sum, conv) => sum + conv.unreadCount,
                        0,
                      )}
                    </Box>
                  )}
              </ListItemIcon>
              {!isCollapsed && (
                <>
                  <ListItemText
                    primary="Nachrichten"
                    primaryTypographyProps={{
                      className:
                        currentPage === "messages"
                          ? "text-lg-semibold text-primary"
                          : "text-lg-semibold text-secondary",
                    }}
                  />
                  {mockConversations.reduce(
                    (sum, conv) => sum + conv.unreadCount,
                    0,
                  ) > 0 && (
                    <Chip
                      label={mockConversations.reduce(
                        (sum, conv) => sum + conv.unreadCount,
                        0,
                      )}
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
                  )}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Konto */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <Tooltip
            title={isCollapsed ? "Konto" : ""}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              selected={currentPage === "account"}
              onClick={() => setCurrentPage("account")}
              sx={{
                px: isCollapsed ? 0 : 2.5,
                py: 1.5,
                borderRadius: 2,
                position: "relative",
                transition:
                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                justifyContent: isCollapsed
                  ? "center"
                  : "flex-start",
                "&.Mui-selected": {
                  bgcolor: "rgba(255, 103, 31, 0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 103, 31, 0.2)",
                  boxShadow:
                    "0 4px 12px rgba(255, 103, 31, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.15)",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 103, 31, 0.06)",
                  backdropFilter: "blur(8px)",
                },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: isCollapsed ? "auto" : 36 }}
              >
                <AccountIcon
                  sx={{
                    color:
                      currentPage === "account"
                        ? "#ff671f"
                        : "#4f4a4a",
                    fontSize: 22,
                    transition: "all 0.2s ease",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Konto"
                  primaryTypographyProps={{
                    className:
                      currentPage === "account"
                        ? "text-lg-semibold text-primary"
                        : "text-lg-semibold text-secondary",
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Divider */}
        <Box
          sx={{ my: 2, height: "1px", bgcolor: "#e6e5e5" }}
        />

        {/* Abmelden */}
        <ListItem disablePadding>
          <Tooltip
            title={isCollapsed ? "Abmelden" : ""}
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItemButton
              onClick={onLogout}
              sx={{
                px: isCollapsed ? 0 : 2.5,
                py: 1.5,
                borderRadius: 2,
                transition:
                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                justifyContent: isCollapsed
                  ? "center"
                  : "flex-start",
                "&:hover": {
                  bgcolor: "rgba(245, 73, 0, 0.06)",
                  backdropFilter: "blur(8px)",
                },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: isCollapsed ? "auto" : 36 }}
              >
                <LogoutIcon
                  sx={{
                    color: "#f54900",
                    fontSize: 22,
                    transition: "all 0.2s ease",
                  }}
                />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Abmelden"
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#f54900",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>

      {/* Bottom Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Toggle Collapse Button - Desktop only */}
        {!isMobile && (
          <Box
            sx={{ pb: 2, borderBottom: `1px solid #e6e5e5` }}
          >
            <Tooltip
              title={
                isCollapsed
                  ? "Sidebar erweitern"
                  : "Sidebar einklappen"
              }
              placement="right"
            >
              <IconButton
                onClick={onToggleCollapse}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  py: 1,
                  color: "#4f4a4a",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.06)",
                    color: "#ff671f",
                  },
                }}
              >
                {isCollapsed ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Design System Link */}
        <Box sx={{ pt: 2, borderTop: `1px solid #e6e5e5` }}>
          {isCollapsed ? (
            <Tooltip title="DesignSystem" placement="right">
              <IconButton
                onClick={() => setCurrentPage("designsystem")}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  py: 1.5,
                  color:
                    currentPage === "designsystem"
                      ? "#ff671f"
                      : "#4f4a4a",
                  bgcolor:
                    currentPage === "designsystem"
                      ? "rgba(255, 103, 31, 0.12)"
                      : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255, 103, 31, 0.06)",
                  },
                }}
              >
                <PaletteIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              onClick={() => setCurrentPage("designsystem")}
              startIcon={<PaletteIcon sx={{ fontSize: 22 }} />}
              className={
                currentPage === "designsystem"
                  ? "button-text-sm text-brand"
                  : "button-text-sm text-secondary"
              }
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                textTransform: "none",
                px: 2,
                py: 1,
                "&:hover": {
                  bgcolor: "rgba(255, 103, 31, 0.06)",
                },
              }}
            >
              DesignSystem
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<
    "risikogeber" | "risikonehmer"
  >("risikogeber");
  const [newRisks, setNewRisks] = useState<Risk[]>([]);
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(
    null,
  );
  const [takeRiskModalOpen, setTakeRiskModalOpen] =
    useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(
    muiTheme.breakpoints.down("md"),
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogoClick = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const handleUserTypeChange = (
    type: "risikogeber" | "risikonehmer",
  ) => {
    setUserType(type);
  };

  const handleRiskCreated = (risk: Risk) => {
    setNewRisks((prev) => [risk, ...prev]);
    setCurrentPage("home");
    setRiskModalOpen(false);

    // Show success toast
    toast.success(`Risiko "${risk.title}" wurde angelegt`, {
      description:
        "Die Riskoanalyse läuft gerade noch im Hintergrund.",
      duration: 5000,
    });
  };

  const handleDeleteRisk = (riskId: string) => {
    setNewRisks((prev) => prev.filter((r) => r.id !== riskId));
  };

  const handleOpenRiskModal = () => {
    setRiskModalOpen(true);
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage("home");
  };

  const handleRiskDetails = (risk: Risk) => {
    setSelectedRisk(risk);
    setCurrentPage("risk-detail");
  };

  const handleBackFromDetails = () => {
    setSelectedRisk(null);
    setCurrentPage("home");
  };

  const handleBackFromTakeRisk = () => {
    setSelectedRisk(null);
    setCurrentPage("marketplace");
  };

  const handleTakeRiskFromDetail = (risk: Risk) => {
    setSelectedRisk(risk);
    setTakeRiskModalOpen(true);
  };

  const handleTakeRiskFromMarketplace = (risk: Risk) => {
    setSelectedRisk(risk);
    setCurrentPage("take-risk");
  };

  const handleTakeRiskSubmit = (
    premium: number,
    coverages: string[],
  ) => {
    console.log("Take risk submitted:", { premium, coverages });
    toast.success("Angebot erfolgreich abgegeben", {
      description:
        "Der Risikogeber wird über Ihr Angebot informiert.",
      duration: 5000,
    });
  };

  // Show Landing Page if not logged in
  if (!isLoggedIn) {
    // Check if we're on a legal page
    if (currentPage === "impressum") {
      return (
        <ThemeProvider theme={theme}>
          <ImpressumPage 
            onNavigateBack={() => setCurrentPage("home")}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        </ThemeProvider>
      );
    }
    if (currentPage === "datenschutz") {
      return (
        <ThemeProvider theme={theme}>
          <DatenschutzPage 
            onNavigateBack={() => setCurrentPage("home")}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        </ThemeProvider>
      );
    }
    if (currentPage === "agb") {
      return (
        <ThemeProvider theme={theme}>
          <AGBPage 
            onNavigateBack={() => setCurrentPage("home")}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        </ThemeProvider>
      );
    }

    // Otherwise show landing page
    return (
      <ThemeProvider theme={theme}>
        {userType === "risikogeber" ? (
          <LandingPage
            onLogin={handleLogin}
            onUserTypeChange={handleUserTypeChange}
            onNavigate={(page) => {
              setCurrentPage(page as Page);
            }}
          />
        ) : (
          <RisktakerLandingPage
            onLogin={handleLogin}
            onUserTypeChange={handleUserTypeChange}
          />
        )}
      </ThemeProvider>
    );
  }

  const currentDrawerWidth = sidebarCollapsed
    ? drawerWidthCollapsed
    : drawerWidthExpanded;

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#fdfcfc",
        }}
      >
        {/* Sidebar Drawer with Glass Effect */}
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidthExpanded,
              boxSizing: "border-box",
              bgcolor: "rgba(253, 252, 252, 0.95)",
              backdropFilter: "blur(20px)",
              borderRight: "1px solid rgba(230, 229, 229, 0.3)",
              pt: 3,
              px: 3,
              pb: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "4px 0 24px rgba(0, 0, 0, 0.06)",
            },
          }}
        >
          <Box
            sx={{ position: "absolute", top: 16, right: 16 }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: "#4f4a4a" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <DrawerContent
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setCurrentPage(page);
              setMobileOpen(false);
            }}
            onLogout={handleLogout}
            onLogoClick={handleLogoClick}
            isCollapsed={false}
            onToggleCollapse={() => {}}
            onOpenRiskModal={handleOpenRiskModal}
            isMobile={true}
          />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: currentDrawerWidth,
            flexShrink: 0,
            transition: "width 0.3s ease",
            "& .MuiDrawer-paper": {
              width: currentDrawerWidth,
              boxSizing: "border-box",
              bgcolor: "rgba(253, 252, 252, 0.95)",
              backdropFilter: "blur(20px)",
              borderRight: "1px solid rgba(230, 229, 229, 0.3)",
              pt: 3,
              px: sidebarCollapsed ? 1.5 : 3,
              pb: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "4px 0 24px rgba(0, 0, 0, 0.06)",
              transition: "width 0.3s ease, padding 0.3s ease",
              overflowX: "hidden",
            },
          }}
        >
          <DrawerContent
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onLogout={handleLogout}
            onLogoClick={handleLogoClick}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
            onOpenRiskModal={handleOpenRiskModal}
            isMobile={false}
          />
        </Drawer>

        {/* Mobile Menu Button - Floating */}
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1300,
              bgcolor: "rgba(255, 103, 31, 0.9)",
              color: "white",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 16px rgba(255, 103, 31, 0.35)",
              "&:hover": {
                bgcolor: "#e05a1b",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            width: {
              xs: "100%",
              md: `calc(100% - ${currentDrawerWidth}px)`,
            },
            transition: "width 0.3s ease",
          }}
        >
          {currentPage === "messages" ? (
            <Box sx={{ height: "100vh" }}>
              <Messages />
            </Box>
          ) : currentPage === "account" ? (
            <Box
              sx={{
                bgcolor: "#fdfcfc",
                minHeight: "100vh",
                py: { xs: 3, md: 5 },
              }}
            >
              <AccountSettings
                onBack={() => setCurrentPage("home")}
              />
            </Box>
          ) : currentPage === "impressum" ? (
            <ImpressumPage onNavigateBack={() => setCurrentPage("home")} />
          ) : currentPage === "datenschutz" ? (
            <DatenschutzPage onNavigateBack={() => setCurrentPage("home")} />
          ) : currentPage === "agb" ? (
            <AGBPage onNavigateBack={() => setCurrentPage("home")} />
          ) : currentPage === "risk-detail" && selectedRisk ? (
            <RiskDetailPage
              risk={selectedRisk}
              onBack={handleBackFromDetails}
              onTakeRisk={handleTakeRiskFromDetail}
              onUserClick={() => {}}
            />
          ) : currentPage === "take-risk" && selectedRisk ? (
            <TakeRiskPage
              risk={selectedRisk}
              onBack={handleBackFromTakeRisk}
              onSubmit={handleTakeRiskSubmit}
              onUserClick={() => {}}
            />
          ) : (
            <Container
              maxWidth={false}
              sx={{
                px: { xs: 2, sm: 3, md: 5 },
                py: { xs: 3, md: 5 },
              }}
            >
              {currentPage === "home" && (
                <Dashboard
                  newRisks={newRisks}
                  onCreateRiskClick={handleOpenRiskModal}
                  onDeleteRisk={handleDeleteRisk}
                  onRiskDetails={handleRiskDetails}
                />
              )}
              {currentPage === "marketplace" && (
                <Marketplace
                  onRiskDetails={handleRiskDetails}
                  onTakeRisk={handleTakeRiskFromMarketplace}
                />
              )}
              {currentPage === "designsystem" && (
                <DesignSystem />
              )}
            </Container>
          )}
        </Box>
      </Box>

      {/* Risk Input Modal */}
      <RiskInputModal
        open={riskModalOpen}
        onClose={() => setRiskModalOpen(false)}
        initialRiskDescription=""
        onRiskCreated={handleRiskCreated}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
      />

      {/* Take Risk Modal */}
      {selectedRisk && (
        <TakeRiskModal
          open={takeRiskModalOpen}
          onClose={() => setTakeRiskModalOpen(false)}
          risk={selectedRisk}
        />
      )}
    </ThemeProvider>
  );
}