import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  LinearProgress,
  Fade,
  Grow,
} from "@mui/material";
import { Wand2, Sparkles, FileText, CheckCircle2, Search, BarChart3, TrendingUp, Zap } from "lucide-react";
import { Risk } from "./types/risk";
import { BaseModal } from "./BaseModal";
import { AuthModal } from "./AuthModal";

interface RiskInputModalProps {
  open: boolean;
  onClose: () => void;
  initialRiskDescription: string;
  onRiskCreated?: (risk: Risk) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

// Helper function to extract key items from risk description
function getItemFromDescription(description: string): string {
  const lower = description.toLowerCase();
  
  // Common items
  if (lower.includes("espresso") || lower.includes("kaffee")) return "Espressomaschine";
  if (lower.includes("drohne")) return "Drohne";
  if (lower.includes("bohrmaschine") || lower.includes("bohrer")) return "Bohrmaschine";
  if (lower.includes("kamera")) return "Kamera";
  if (lower.includes("auto") || lower.includes("fahrzeug")) return "Auto";
  if (lower.includes("fahrrad") || lower.includes("bike")) return "Fahrrad";
  if (lower.includes("werkzeug")) return "Werkzeug";
  if (lower.includes("laptop") || lower.includes("computer")) return "Laptop";
  if (lower.includes("mixer") || lower.includes("küche")) return "Küchengerät";
  if (lower.includes("rasenmäher")) return "Rasenmäher";
  if (lower.includes("akkuschrauber")) return "Akkuschrauber";
  
  return "Gerät";
}

function getLoadingMessages(item: string): string[] {
  return [
    `Wow, eine ${item}! 😊`,
    `Ich analysiere die Details Ihrer ${item}...`,
    `Spannend! Ich schaue mir das genauer an...`,
    `Einen Moment, ich bewerte das Risiko für Ihre ${item}...`,
    `Ich prüfe die technischen Spezifikationen...`,
    `Fast geschafft! Ich prüfe noch ein paar Details...`,
    `Ich ermittle passende Risikofaktoren...`,
    `Gleich fertig mit der Erstanalyse...`,
    `Ich bereite die Risikobewertung vor...`,
    `Nur noch einen Moment...`,
  ];
}

// Helper to determine category from description
function getCategoryFromDescription(description: string): Risk['category'] {
  const lower = description.toLowerCase();
  
  if (lower.includes("auto") || lower.includes("fahrzeug") || lower.includes("drohne")) return "vehicles";
  if (lower.includes("laptop") || lower.includes("computer") || lower.includes("kamera")) return "electronics";
  if (lower.includes("bohrmaschine") || lower.includes("werkzeug") || lower.includes("akkuschrauber")) return "tools";
  if (lower.includes("espresso") || lower.includes("mixer") || lower.includes("küche")) return "household";
  if (lower.includes("fahrrad") || lower.includes("ski")) return "sports";
  
  return "other";
}

// Loading phases configuration based on Nielsen Norman Group best practices
interface LoadingPhase {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number; // milliseconds
  progress: number; // 0-100
}

export function RiskInputModal({ open, onClose, initialRiskDescription, onRiskCreated, isLoggedIn, onLogin }: RiskInputModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<"input" | "loading" | "questions" | "auth">("input");
  const [riskDescription, setRiskDescription] = useState(initialRiskDescription);
  const [detectedItem, setDetectedItem] = useState("Gerät");
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    description: initialRiskDescription,
    startDate: "",
    endDate: "",
    insuranceValue: "1000",
  });
  const [pendingRisk, setPendingRisk] = useState<Risk | null>(null);
  
  // Define loading phases - focused on preparing follow-up questions
  const loadingPhases: LoadingPhase[] = [
    {
      id: 0,
      title: "Eingaben analysieren",
      description: "Ihre Risikobeschreibung wird verarbeitet...",
      icon: <Search size={24} />,
      duration: 2500,
      progress: 25,
    },
    {
      id: 1,
      title: "Kontext verstehen",
      description: "Kategorie und Risikotyp werden ermittelt...",
      icon: <BarChart3 size={24} />,
      duration: 2500,
      progress: 50,
    },
    {
      id: 2,
      title: "Rückfragen ermitteln",
      description: "Notwendige Informationen werden identifiziert...",
      icon: <TrendingUp size={24} />,
      duration: 2500,
      progress: 75,
    },
    {
      id: 3,
      title: "Fragebogen vorbereiten",
      description: "Spezifische Fragen werden generiert...",
      icon: <Zap size={24} />,
      duration: 2500,
      progress: 100,
    },
  ];

  const today = new Date().toISOString().split('T')[0];
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  const oneYearLaterStr = oneYearLater.toISOString().split('T')[0];

  // Manage loading phases
  useEffect(() => {
    if (!isLoading || step !== "loading") {
      setCurrentPhaseIndex(0);
      setProgress(0);
      setCompletedPhases([]);
      return;
    }

    let phaseTimer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    const runPhase = (phaseIndex: number) => {
      if (phaseIndex >= loadingPhases.length) {
        // All phases complete
        setStep("questions");
        setIsLoading(false);
        return;
      }

      const phase = loadingPhases[phaseIndex];
      const startProgress = phaseIndex === 0 ? 0 : loadingPhases[phaseIndex - 1].progress;
      const endProgress = phase.progress;
      const progressRange = endProgress - startProgress;
      const updateInterval = 50; // Update every 50ms for smooth animation
      const steps = phase.duration / updateInterval;
      const progressIncrement = progressRange / steps;
      
      let currentProgress = startProgress;
      
      // Smooth progress animation
      progressInterval = setInterval(() => {
        currentProgress += progressIncrement;
        if (currentProgress >= endProgress) {
          currentProgress = endProgress;
          clearInterval(progressInterval);
        }
        setProgress(Math.min(currentProgress, 100));
      }, updateInterval);

      // Move to next phase
      phaseTimer = setTimeout(() => {
        setCompletedPhases(prev => [...prev, phaseIndex]);
        setCurrentPhaseIndex(phaseIndex + 1);
        clearInterval(progressInterval);
        runPhase(phaseIndex + 1);
      }, phase.duration);
    };

    runPhase(0);

    return () => {
      clearTimeout(phaseTimer);
      clearInterval(progressInterval);
    };
  }, [isLoading, step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form values
    const form = e.target as HTMLFormElement;
    const description = (form.elements.namedItem("risk-description") as HTMLTextAreaElement)?.value || initialRiskDescription;
    const startDate = (form.elements.namedItem("start-date") as HTMLInputElement)?.value || today;
    const endDate = (form.elements.namedItem("end-date") as HTMLInputElement)?.value || oneYearLaterStr;
    const insuranceValue = (form.elements.namedItem("insurance-value") as HTMLInputElement)?.value || "1000";
    
    setFormData({
      description,
      startDate,
      endDate,
      insuranceValue,
    });
    setRiskDescription(description);
    
    // Detect item from description
    const item = getItemFromDescription(description);
    setDetectedItem(item);
    
    setIsLoading(true);
    setStep("loading");
    setCurrentPhaseIndex(0);
    setProgress(0);
    setCompletedPhases([]);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the new risk object
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const newRisk: Risk = {
      id: `r-${Date.now()}`,
      title: detectedItem,
      category: getCategoryFromDescription(formData.description),
      description: formData.description,
      coverageAmount: parseInt(formData.insuranceValue),
      premium: 0, // Will be calculated
      duration: duration,
      status: "evaluating",
      createdBy: "Sie",
      createdByUserId: "u5",
      createdAt: new Date(),
      expiresAt: endDate,
      userRole: "giver",
      riskScore: 0,
      views: 0,
      favorites: 0,
    };
    
    // Check if user is logged in
    if (!isLoggedIn) {
      // Store the risk and show auth modal
      setPendingRisk(newRisk);
      setStep("auth");
    } else {
      // Call the callback immediately
      if (onRiskCreated) {
        onRiskCreated(newRisk);
      }
      
      // Close modal and reset
      setIsLoading(false);
      setStep("input");
      onClose();
    }
  };

  const handleAuthLogin = (_email: string, _password: string) => {
    // Simulate login
    onLogin();
    
    // Now create the risk
    if (pendingRisk && onRiskCreated) {
      onRiskCreated(pendingRisk);
    }
    
    // Close modal and reset
    setIsLoading(false);
    setStep("input");
    setPendingRisk(null);
    onClose();
  };

  const handleAuthRegister = (_email: string, _password: string, _name: string) => {
    // Simulate registration and login
    onLogin();
    
    // Now create the risk
    if (pendingRisk && onRiskCreated) {
      onRiskCreated(pendingRisk);
    }
    
    // Close modal and reset
    setIsLoading(false);
    setStep("input");
    setPendingRisk(null);
    onClose();
  };

  const handleClose = () => {
    if (!isLoading) {
      setStep("input");
      setIsLoading(false);
      onClose();
    }
  };

  // Render step 1: Input Form
  const renderInputForm = () => (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header with Step Number */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Avatar
            sx={{
              bgcolor: "#ff671f",
              width: 40,
              height: 40,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            1
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography className="heading-3 text-primary" sx={{ mb: 0.5 }}>
              Risikoeingabe & Bewertung
            </Typography>
            <Typography className="body-sm text-secondary">
              Beschreiben Sie Ihr versicherbares Risiko
            </Typography>
          </Box>
        </Box>

        {/* Risikobeschreibung */}
        <Box>
          <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
            Risikobeschreibung:
          </Typography>
          <TextField
            name="risk-description"
            id="risk-description"
            defaultValue={initialRiskDescription}
            placeholder="Beschreiben Sie Ihr versicherbares Risiko im Detail..."
            multiline
            rows={6}
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

        {/* Date Fields Row */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box>
            <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
              Versicherungsbeginn:
            </Typography>
            <TextField
              type="date"
              name="start-date"
              id="start-date"
              defaultValue={today}
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
              }}
            />
          </Box>
          <Box>
            <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
              Versicherungsende:
            </Typography>
            <TextField
              type="date"
              name="end-date"
              id="end-date"
              defaultValue={oneYearLaterStr}
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
              }}
            />
          </Box>
        </Box>

        {/* Versicherungswert */}
        <Box>
          <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
            Versicherungswert (EUR):
          </Typography>
          <TextField
            type="number"
            name="insurance-value"
            id="insurance-value"
            defaultValue="1000"
            inputProps={{ min: 0, step: 100 }}
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
            }}
          />
        </Box>
      </Box>
    </form>
  );

  // Render step 2: Loading with optimized UX
  const renderLoading = () => {
    return (
      <Box sx={{ py: 4 }}>
        {/* Header with Icon */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", mb: 4 }}>
          <Box
            sx={{
              position: "relative",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Animated Ring */}
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "3px solid #f3f2f2",
                borderTopColor: "#ff671f",
                animation: "spin 1s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            {/* Icon */}
            <Avatar
              sx={{
                bgcolor: "#ff671f",
                width: 64,
                height: 64,
                boxShadow: "0 4px 16px rgba(255, 103, 31, 0.25)",
              }}
            >
              <Sparkles size={32} color="#ffffff" />
            </Avatar>
          </Box>
        </Box>

        {/* Progress Information */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography className="heading-3 text-primary" sx={{ mb: 1 }}>
            Rückfragen werden ermittelt
          </Typography>
          <Typography className="body-sm text-secondary">
            {Math.round(progress)}% abgeschlossen
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 6, px: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: "#f3f2f2",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#ff671f",
                borderRadius: 1,
                transition: "transform 0.2s ease-out",
              },
            }}
          />
        </Box>

        {/* Phases List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>
          {loadingPhases.map((phase, index) => {
            const isCompleted = completedPhases.includes(index);
            const isCurrent = index === currentPhaseIndex;
            const isPending = index > currentPhaseIndex;

            return (
              <Fade in={true} key={phase.id} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isCurrent ? "rgba(255, 103, 31, 0.08)" : "transparent",
                    border: isCurrent ? "1px solid rgba(255, 103, 31, 0.2)" : "1px solid transparent",
                    transition: "all 0.3s ease",
                    transform: isCurrent ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {/* Icon/Status */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isCompleted ? "#00a63e" : isCurrent ? "#ff671f" : "#f3f2f2",
                      color: isCompleted || isCurrent ? "#ffffff" : "#4f4a4a",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? (
                      <Grow in={true}>
                        <Box sx={{ display: "flex" }}>
                          <CheckCircle2 size={24} />
                        </Box>
                      </Grow>
                    ) : (
                      phase.icon
                    )}
                  </Box>

                  {/* Text Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      className="body-base-medium"
                      sx={{
                        color: isCurrent ? "#ff671f" : isCompleted ? "#00a63e" : "#353131",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {phase.title}
                    </Typography>
                    <Typography
                      className="body-sm"
                      sx={{
                        color: isPending ? "#9ca3af" : "#4f4a4a",
                        opacity: isPending ? 0.6 : 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {phase.description}
                    </Typography>
                  </Box>

                  {/* Loading Spinner for Current Phase */}
                  {isCurrent && (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "2px solid #f3f2f2",
                        borderTopColor: "#ff671f",
                        animation: "spin 0.8s linear infinite",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>
              </Fade>
            );
          })}
        </Box>

        {/* Bottom Info */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography className="body-sm text-secondary" sx={{ fontStyle: "italic" }}>
            Die KI prüft, welche Informationen für die spätere Risikoanalyse benötigt werden
          </Typography>
        </Box>
      </Box>
    );
  };

  // Render step 3: Questions
  const renderQuestions = () => (
    <form onSubmit={handleQuestionSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header with Step Number */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Avatar
            sx={{
              bgcolor: "#ff671f",
              width: 40,
              height: 40,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            2
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography className="heading-3 text-primary" sx={{ mb: 0.5 }}>
              Zusätzliche Informationen
            </Typography>
            <Typography className="body-sm text-secondary">
              Um Ihr Risiko besser einschätzen zu können, benötige ich noch ein paar Details
            </Typography>
          </Box>
        </Box>

        {/* Question 1 */}
        <Box>
          <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
            Welche Marke, welches Modell und welches Baujahr hat {detectedItem === "Gerät" ? "das Gerät" : `die ${detectedItem}`}?
          </Typography>
          <TextField
            name="model-info"
            placeholder="z.B. DeLonghi Magnifica S, Baujahr 2020"
            fullWidth
            multiline
            rows={3}
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

        {/* Question 2 */}
        <Box>
          <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
            Wo wird {detectedItem === "Gerät" ? "es" : "sie"} während der Leihdauer genutzt/aufbewahrt (privat oder gewerblich, Standort) und welche Sicherheitsvorkehrungen inkl. Transport/Verpackung sind vorhanden?
          </Typography>
          <TextField
            name="storage-security"
            placeholder="z.B. Privat in Küche, Originalverpackung vorhanden, Transport im Auto"
            fullWidth
            multiline
            rows={4}
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
      </Box>
    </form>
  );

  const getTitle = () => {
    if (step === "input") return "Risikoeingabe & Bewertung";
    if (step === "loading") return "KI-Analyse läuft";
    if (step === "auth") return "Anmeldung erforderlich";
    return "Zusätzliche Informationen";
  };

  const getSubtitle = () => {
    if (step === "input") return "Schritt 1 von 3";
    if (step === "loading") return "Bitte warten Sie einen Moment...";
    if (step === "auth") return "Schritt 3 von 3";
    return "Schritt 2 von 3";
  };

  const getIcon = () => {
    if (step === "loading") return <Sparkles size={24} color="#e6e5e5" />;
    return <FileText size={24} color="#e6e5e5" />;
  };

  const actions = step !== "loading" && step !== "auth" ? (
    <>
      <Button
        onClick={handleClose}
        variant="outlined"
        sx={{
          textTransform: "none",
          fontFamily: "'Roboto', sans-serif",
          borderColor: "#e6e5e5",
          color: "#353131",
          "&:hover": {
            borderColor: "#353131",
            bgcolor: "transparent",
          },
        }}
      >
        Abbrechen
      </Button>
      <Button
        type="submit"
        variant="contained"
        onClick={(e) => {
          if (step === "input") {
            const form = document.querySelector('form');
            if (form) {
              form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          } else if (step === "questions") {
            const form = document.querySelector('form');
            if (form) {
              form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          }
        }}
        sx={{
          bgcolor: "#ff671f",
          color: "#e6e5e5",
          textTransform: "none",
          fontFamily: "'Roboto', sans-serif",
          display: "flex",
          gap: 1,
          alignItems: "center",
          "&:hover": {
            bgcolor: "#ff671f",
            opacity: 0.9,
          },
        }}
      >
        {step === "input" ? (
          <>
            <Wand2 size={20} />
            Risikobewertung starten
          </>
        ) : (
          "Risiko erstellen"
        )}
      </Button>
    </>
  ) : undefined;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={getTitle()}
      subtitle={getSubtitle()}
      icon={getIcon()}
      actions={actions}
      maxWidth="md"
    >
      {step === "input" && renderInputForm()}
      {step === "loading" && renderLoading()}
      {step === "questions" && renderQuestions()}
      {step === "auth" && <AuthModal onLogin={handleAuthLogin} onRegister={handleAuthRegister} />}
    </BaseModal>
  );
}
