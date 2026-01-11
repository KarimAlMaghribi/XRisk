import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Avatar,
  Divider,
} from "@mui/material";
import { UserPlus, LogIn } from "lucide-react";

interface AuthModalProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name: string) => Promise<void>;
}

export function AuthModal({ onLogin, onRegister }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: "login" | "register") => {
    setActiveTab(newValue);
    setErrorMessage(null);
    setFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (activeTab === "login") {
        await onLogin(formData.email, formData.password);
      } else {
        await onRegister(formData.email, formData.password, formData.name);
      }
    } catch (error) {
      setErrorMessage("Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Angaben.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header with Icon */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Avatar
          sx={{
            bgcolor: "#ff671f",
            width: 40,
            height: 40,
          }}
        >
          {activeTab === "login" ? <LogIn size={20} /> : <UserPlus size={20} />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography className="heading-3 text-primary" sx={{ mb: 0.5 }}>
            {activeTab === "login" ? "Anmelden" : "Registrieren"}
          </Typography>
          <Typography className="body-sm text-secondary">
            {activeTab === "login" 
              ? "Melden Sie sich an, um Ihr Risiko anzulegen" 
              : "Erstellen Sie ein Konto, um fortzufahren"}
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          borderBottom: 1,
          borderColor: "#e6e5e5",
          "& .MuiTab-root": {
            textTransform: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#4f4a4a",
            "&.Mui-selected": {
              color: "#ff671f",
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#ff671f",
          },
        }}
      >
        <Tab label="Anmelden" value="login" />
        <Tab label="Registrieren" value="register" />
      </Tabs>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {activeTab === "register" && (
            <Box>
              <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
                Vollständiger Name:
              </Typography>
              <TextField
                required
                name="name"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Max Mustermann"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f3f2f2",
                    borderRadius: 1,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    color: "#353131",
                    "& fieldset": {
                      borderColor: "#e6e5e5",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ff671f",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff671f",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    "&::placeholder": {
                      color: "#4f4a4a",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          )}

          <Box>
            <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
              E-Mail:
            </Typography>
            <TextField
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="max@example.com"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f3f2f2",
                  borderRadius: 1,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  color: "#353131",
                  "& fieldset": {
                    borderColor: "#e6e5e5",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff671f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff671f",
                    borderWidth: "2px",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  "&::placeholder": {
                    color: "#4f4a4a",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Box>
            <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
              Passwort:
            </Typography>
            <TextField
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f3f2f2",
                  borderRadius: 1,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  color: "#353131",
                  "& fieldset": {
                    borderColor: "#e6e5e5",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff671f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff671f",
                    borderWidth: "2px",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  "&::placeholder": {
                    color: "#4f4a4a",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          {activeTab === "register" && (
            <Box>
              <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
                Passwort bestätigen:
              </Typography>
              <TextField
                required
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="••••••••"
                fullWidth
                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ""}
                helperText={
                  formData.password !== formData.confirmPassword && formData.confirmPassword !== ""
                    ? "Passwörter stimmen nicht überein"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f3f2f2",
                    borderRadius: 1,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    color: "#353131",
                    "& fieldset": {
                      borderColor: "#e6e5e5",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ff671f",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff671f",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    "&::placeholder": {
                      color: "#4f4a4a",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          {errorMessage && (
            <Typography className="body-sm" sx={{ color: "#b91c1c", textAlign: "center" }}>
              {errorMessage}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={
              isSubmitting ||
              activeTab === "register" &&
              (formData.password !== formData.confirmPassword || !formData.name)
            }
            sx={{
              bgcolor: "#ff671f",
              color: "#e6e5e5",
              textTransform: "none",
              fontFamily: "'Roboto', sans-serif",
              fontSize: "16px",
              py: 1.5,
              "&:hover": {
                bgcolor: "#e05a1b",
              },
              "&:disabled": {
                bgcolor: "#e6e5e5",
                color: "#4f4a4a",
              },
            }}
          >
            {activeTab === "login" ? "Anmelden" : "Registrieren"}
          </Button>

          {activeTab === "login" && (
            <Typography
              className="body-sm text-secondary"
              sx={{ textAlign: "center", mt: 1 }}
            >
              Noch kein Konto?{" "}
              <Box
                component="span"
                sx={{
                  color: "#ff671f",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => setActiveTab("register")}
              >
                Jetzt registrieren
              </Box>
            </Typography>
          )}

          {activeTab === "register" && (
            <Typography
              className="body-sm text-secondary"
              sx={{ textAlign: "center", mt: 1 }}
            >
              Bereits ein Konto?{" "}
              <Box
                component="span"
                sx={{
                  color: "#ff671f",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => setActiveTab("login")}
              >
                Jetzt anmelden
              </Box>
            </Typography>
          )}
        </Box>
      </form>
    </Box>
  );
}
