import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  AccountBalance as AccountBalanceIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  CreditScore as CreditScoreIcon,
} from "@mui/icons-material";
import { User, isUserVerified, getProfileCompleteness } from "../types/user";
import { VerifiedBadge } from "./VerifiedBadge";
import { currentUser } from "../lib/current-user";

interface AccountSettingsProps {
  onBack: () => void;
}

export function AccountSettings({ onBack }: AccountSettingsProps) {
  const [user, setUser] = useState<User>(currentUser);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isProcessingCreditCheck, setIsProcessingCreditCheck] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState("max.mustermann@email.de");
  const [phone, setPhone] = useState("+49 176 12345678");
  const [address, setAddress] = useState("Musterstraße 123");
  const [city, setCity] = useState("Berlin");
  const [postalCode, setPostalCode] = useState("10115");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isVerified = isUserVerified(user);
  const profileCompleteness = getProfileCompleteness(user);

  const handleSavePersonal = () => {
    setUser({
      ...user,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName.charAt(0)}.`,
      verification: {
        ...user.verification,
        hasFullName: firstName.length > 0 && lastName.length > 0,
      },
    });
    setIsEditingPersonal(false);
  };

  const handleCancelPersonal = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setIsEditingPersonal(false);
  };

  const handleSaveAddress = () => {
    setIsEditingAddress(false);
    // In real app: save to backend
  };

  const handleCancelAddress = () => {
    setAddress("Musterstraße 123");
    setCity("Berlin");
    setPostalCode("10115");
    setIsEditingAddress(false);
  };

  const handleVerifyEmail = () => {
    // Simulate email verification
    setUser({
      ...user,
      verification: {
        ...user.verification,
        hasVerifiedEmail: true,
      },
    });
  };

  const handleVerifyPhone = () => {
    // Simulate phone verification
    setUser({
      ...user,
      verification: {
        ...user.verification,
        hasVerifiedPhone: true,
      },
    });
  };

  const handleVerifyAddress = () => {
    // Simulate address verification
    setUser({
      ...user,
      verification: {
        ...user.verification,
        hasConfirmedAddress: true,
      },
    });
    setIsEditingAddress(false);
  };

  const handleRunCreditCheck = () => {
    setIsProcessingCreditCheck(true);
    // Simulate credit check process
    setTimeout(() => {
      const newScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      setUser({
        ...user,
        verification: {
          ...user.verification,
          creditCheckScore: newScore,
        },
      });
      setIsProcessingCreditCheck(false);
    }, 3000);
  };

  const handleConnectBank = () => {
    // Simulate bank account connection
    setUser({
      ...user,
      verification: {
        ...user.verification,
        hasBankAccount: true,
      },
    });
  };

  const handleChangePassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditingPassword(false);
      // In real app: send to backend
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            color: "#353131",
            mb: 1,
          }}
        >
          Kontoeinstellungen
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "16px",
            color: "#4F4A4A",
          }}
        >
          Verwalten Sie Ihre persönlichen Daten und Verifizierungen
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        {/* Left Column - Profile Overview */}
        <Box sx={{ flex: "0 0 auto", width: { xs: "100%", md: 320 } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid #e6e5e5",
              borderRadius: 2,
              position: "sticky",
              top: 24,
            }}
          >
            {/* Avatar */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <VerifiedBadge user={user} avatarSize={120}>
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: "4px solid #e6e5e5",
                  }}
                />
              </VerifiedBadge>
              <Button
                startIcon={<CloudUploadIcon />}
                size="small"
                sx={{
                  textTransform: "none",
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  color: "#ff671f",
                }}
              >
                Foto ändern
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Profile Completeness */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#353131",
                  }}
                >
                  Profilvollständigkeit
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#ff671f",
                  }}
                >
                  {profileCompleteness}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={profileCompleteness}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#e6e5e5",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#ff671f",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            {/* Verification Status */}
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#353131",
                  mb: 2,
                }}
              >
                Verifizierungsstatus
              </Typography>
              {isVerified ? (
                <Chip
                  icon={<VerifiedIcon />}
                  label="Vollständig verifiziert"
                  color="primary"
                  sx={{
                    bgcolor: "#4caf50",
                    color: "#ffffff",
                    "& .MuiChip-icon": {
                      color: "#ffffff",
                    },
                  }}
                />
              ) : (
                <Chip
                  icon={<WarningIcon />}
                  label="Nicht vollständig verifiziert"
                  sx={{
                    bgcolor: "#fff3cd",
                    color: "#856404",
                    border: "1px solid #ffeaa7",
                  }}
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Trust Score */}
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#353131",
                  mb: 1,
                }}
              >
                Vertrauensscore
              </Typography>
              <Box
                sx={{
                  bgcolor: "#f3f2f2",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "36px",
                    fontWeight: 700,
                    color: "#ff671f",
                  }}
                >
                  {user.score}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "12px",
                    color: "#4F4A4A",
                  }}
                >
                  von 100 Punkten
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Column - Settings Sections */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Personal Information */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5", borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#353131",
                }}
              >
                Persönliche Informationen
              </Typography>
              {!isEditingPersonal && (
                <IconButton
                  size="small"
                  onClick={() => setIsEditingPersonal(true)}
                  sx={{ color: "#ff671f" }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>

            <Stack spacing={2}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField
                  label="Vorname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditingPersonal}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                />
                <TextField
                  label="Nachname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditingPersonal}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                />
              </Box>

              {isEditingPersonal && (
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelPersonal}
                    sx={{
                      textTransform: "none",
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      borderColor: "#e6e5e5",
                      color: "#4F4A4A",
                    }}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleSavePersonal}
                    sx={{
                      textTransform: "none",
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      bgcolor: "#ff671f",
                      "&:hover": {
                        bgcolor: "#e55a1a",
                      },
                    }}
                  >
                    Speichern
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Contact & Verification */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5", borderRadius: 2 }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#353131",
                mb: 3,
              }}
            >
              Kontakt & Verifizierung
            </Typography>

            <Stack spacing={3}>
              {/* Email */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <EmailIcon sx={{ fontSize: 20, color: "#4F4A4A" }} />
                  <Typography
                    sx={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353131",
                    }}
                  >
                    E-Mail-Adresse
                  </Typography>
                  {user.verification.hasVerifiedEmail && (
                    <CheckCircleIcon sx={{ fontSize: 18, color: "#4caf50", ml: "auto" }} />
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={user.verification.hasVerifiedEmail}
                    InputProps={{
                      sx: {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                      },
                    }}
                  />
                  {!user.verification.hasVerifiedEmail && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleVerifyEmail}
                      sx={{
                        textTransform: "none",
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        borderColor: "#ff671f",
                        color: "#ff671f",
                        "&:hover": {
                          borderColor: "#e55a1a",
                          bgcolor: "#fff5f0",
                        },
                      }}
                    >
                      Verifizieren
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Phone */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <PhoneIcon sx={{ fontSize: 20, color: "#4F4A4A" }} />
                  <Typography
                    sx={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#353131",
                    }}
                  >
                    Telefonnummer
                  </Typography>
                  {user.verification.hasVerifiedPhone && (
                    <CheckCircleIcon sx={{ fontSize: 18, color: "#4caf50", ml: "auto" }} />
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={user.verification.hasVerifiedPhone}
                    InputProps={{
                      sx: {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                      },
                    }}
                  />
                  {!user.verification.hasVerifiedPhone && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleVerifyPhone}
                      sx={{
                        textTransform: "none",
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        borderColor: "#ff671f",
                        color: "#ff671f",
                        "&:hover": {
                          borderColor: "#e55a1a",
                          bgcolor: "#fff5f0",
                        },
                      }}
                    >
                      Verifizieren
                    </Button>
                  )}
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Address */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5", borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HomeIcon sx={{ fontSize: 20, color: "#4F4A4A" }} />
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#353131",
                  }}
                >
                  Adresse
                </Typography>
                {user.verification.hasConfirmedAddress && (
                  <CheckCircleIcon sx={{ fontSize: 20, color: "#4caf50" }} />
                )}
              </Box>
              {!isEditingAddress && (
                <IconButton
                  size="small"
                  onClick={() => setIsEditingAddress(true)}
                  sx={{ color: "#ff671f" }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>

            <Stack spacing={2}>
              <TextField
                label="Straße und Hausnummer"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isEditingAddress}
                fullWidth
                size="small"
                InputProps={{
                  sx: {
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                  },
                }}
              />
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 2 }}>
                <TextField
                  label="PLZ"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={!isEditingAddress}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                />
                <TextField
                  label="Stadt"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!isEditingAddress}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                />
              </Box>

              {isEditingAddress && (
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelAddress}
                    sx={{
                      textTransform: "none",
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      borderColor: "#e6e5e5",
                      color: "#4F4A4A",
                    }}
                  >
                    Abbrechen
                  </Button>
                  {!user.verification.hasConfirmedAddress ? (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleVerifyAddress}
                      sx={{
                        textTransform: "none",
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        bgcolor: "#ff671f",
                        "&:hover": {
                          bgcolor: "#e55a1a",
                        },
                      }}
                    >
                      Speichern & Verifizieren
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleSaveAddress}
                      sx={{
                        textTransform: "none",
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        bgcolor: "#ff671f",
                        "&:hover": {
                          bgcolor: "#e55a1a",
                        },
                      }}
                    >
                      Speichern
                    </Button>
                  )}
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Credit Check / Bonitätsprüfung */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CreditScoreIcon sx={{ fontSize: 24, color: "#4F4A4A" }} />
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#353131",
                }}
              >
                Bonitätsprüfung
              </Typography>
            </Box>

            {user.verification.creditCheckScore > 0 ? (
              <Box>
                <Box
                  sx={{
                    bgcolor: "#f3f2f2",
                    borderRadius: 2,
                    p: 3,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#353131",
                      }}
                    >
                      Aktueller Score
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
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "32px",
                          fontWeight: 700,
                          color: user.verification.creditCheckScore >= 70 ? "#4caf50" : "#ff9800",
                        }}
                      >
                        {user.verification.creditCheckScore}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "16px",
                          color: "#4F4A4A",
                        }}
                      >
                        / 100
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={user.verification.creditCheckScore}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#e6e5e5",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: user.verification.creditCheckScore >= 70 ? "#4caf50" : "#ff9800",
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {user.verification.creditCheckScore >= 70 ? (
                  <Alert
                    severity="success"
                    icon={<CheckCircleIcon />}
                    sx={{
                      mb: 2,
                      "& .MuiAlert-message": {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                      },
                    }}
                  >
                    Ihre Bonität wurde erfolgreich geprüft und bestätigt.
                  </Alert>
                ) : (
                  <Alert
                    severity="warning"
                    icon={<WarningIcon />}
                    sx={{
                      mb: 2,
                      "& .MuiAlert-message": {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                      },
                    }}
                  >
                    Ihr Score liegt unter dem erforderlichen Schwellenwert von 70 Punkten. Eine erneute Prüfung kann in 30 Tagen durchgeführt werden.
                  </Alert>
                )}

                <Button
                  variant="outlined"
                  fullWidth
                  disabled={isProcessingCreditCheck}
                  onClick={handleRunCreditCheck}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    borderColor: "#e6e5e5",
                    color: "#4F4A4A",
                    "&:hover": {
                      borderColor: "#ff671f",
                      color: "#ff671f",
                    },
                  }}
                >
                  Erneut prüfen
                </Button>
              </Box>
            ) : (
              <Box>
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    "& .MuiAlert-message": {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                >
                  Führen Sie eine Bonitätsprüfung durch, um Ihr Profil zu verifizieren und das Vertrauen anderer Nutzer zu gewinnen. Die Prüfung ist kostenlos und dauert nur wenige Minuten.
                </Alert>

                {isProcessingCreditCheck && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        color: "#4F4A4A",
                        mb: 1,
                      }}
                    >
                      Bonitätsprüfung läuft...
                    </Typography>
                    <LinearProgress
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#ff671f",
                        },
                      }}
                    />
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  disabled={isProcessingCreditCheck}
                  onClick={handleRunCreditCheck}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    bgcolor: "#ff671f",
                    "&:hover": {
                      bgcolor: "#e55a1a",
                    },
                  }}
                >
                  Bonitätsprüfung starten
                </Button>
              </Box>
            )}
          </Paper>

          {/* Bank Account */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AccountBalanceIcon sx={{ fontSize: 24, color: "#4F4A4A" }} />
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#353131",
                }}
              >
                Bankkonto
              </Typography>
              {user.verification.hasBankAccount && (
                <CheckCircleIcon sx={{ fontSize: 20, color: "#4caf50", ml: "auto" }} />
              )}
            </Box>

            {user.verification.hasBankAccount ? (
              <Box
                sx={{
                  bgcolor: "#f3f2f2",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    color: "#353131",
                    mb: 0.5,
                  }}
                >
                  Verknüpftes Konto
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#353131",
                  }}
                >
                  DE89 3704 0044 0532 0130 00
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "12px",
                    color: "#4F4A4A",
                    mt: 0.5,
                  }}
                >
                  Sparkasse Berlin
                </Typography>
              </Box>
            ) : (
              <Box>
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    "& .MuiAlert-message": {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                >
                  Verknüpfen Sie ein Bankkonto, um Zahlungen zu empfangen und Ihre Verifizierung abzuschließen.
                </Alert>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleConnectBank}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    bgcolor: "#ff671f",
                    "&:hover": {
                      bgcolor: "#e55a1a",
                    },
                  }}
                >
                  Bankkonto verknüpfen
                </Button>
              </Box>
            )}
          </Paper>

          {/* Password */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5", borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#353131",
                }}
              >
                Passwort & Sicherheit
              </Typography>
              {!isEditingPassword && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsEditingPassword(true)}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    borderColor: "#e6e5e5",
                    color: "#4F4A4A",
                  }}
                >
                  Passwort ändern
                </Button>
              )}
            </Box>

            {isEditingPassword && (
              <Stack spacing={2}>
                <TextField
                  label="Aktuelles Passwort"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                />
                <TextField
                  label="Neues Passwort"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                  helperText="Mindestens 8 Zeichen"
                />
                <TextField
                  label="Passwort bestätigen"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  size="small"
                  error={newPassword !== confirmPassword && confirmPassword.length > 0}
                  helperText={
                    newPassword !== confirmPassword && confirmPassword.length > 0
                      ? "Passwörter stimmen nicht überein"
                      : ""
                  }
                  InputProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                    },
                  }}
                />

                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setOldPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setIsEditingPassword(false);
                    }}
                    sx={{
                      textTransform: "none",
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      borderColor: "#e6e5e5",
                      color: "#4F4A4A",
                    }}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleChangePassword}
                    disabled={
                      !oldPassword ||
                      !newPassword ||
                      newPassword !== confirmPassword ||
                      newPassword.length < 8
                    }
                    sx={{
                      textTransform: "none",
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      bgcolor: "#ff671f",
                      "&:hover": {
                        bgcolor: "#e55a1a",
                      },
                    }}
                  >
                    Passwort ändern
                  </Button>
                </Box>
              </Stack>
            )}

            {!isEditingPassword && (
              <Typography
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  color: "#4F4A4A",
                }}
              >
                Ihr Passwort wurde zuletzt am 15. Oktober 2024 geändert.
              </Typography>
            )}
          </Paper>

          {/* Danger Zone */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid #ffcdd2",
              borderRadius: 2,
              bgcolor: "#ffebee",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#c62828",
                mb: 2,
              }}
            >
              Gefahrenzone
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                color: "#4F4A4A",
                mb: 2,
              }}
            >
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden dauerhaft gelöscht.
            </Typography>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                borderColor: "#c62828",
                color: "#c62828",
                "&:hover": {
                  borderColor: "#b71c1c",
                  bgcolor: "#ffcdd2",
                },
              }}
            >
              Konto löschen
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
