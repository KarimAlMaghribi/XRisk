import React, { useState, useEffect } from "react";
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
import { createSSE, getRisk, inquiryResponse, startWorkflow, WorkflowStartPayload } from "../api/risks";
import { useSession } from "../auth/useSession";

interface RiskInputModalProps {
  open: boolean;
  onClose: () => void;
  initialRiskDescription: string;
  onRiskCreated?: (risk: Risk) => void;
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

export function RiskInputModal({ open, onClose, initialRiskDescription, onRiskCreated }: RiskInputModalProps) {
  const { user, doLogin, doRegister } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<"input" | "loading" | "questions" | "auth">("input");
  const [detectedItem, setDetectedItem] = useState("Gerät");
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [workflowTaskId, setWorkflowTaskId] = useState<string | null>(null);
  const [workflowRiskUuid, setWorkflowRiskUuid] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Array<{ id: string; prompt: string }>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingPayload, setPendingPayload] = useState<WorkflowStartPayload | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [formData, setFormData] = useState({
    description: initialRiskDescription,
    startDate: "",
    endDate: "",
    insuranceValue: "1000",
  });
  
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

  const resetWorkflow = () => {
    eventSource?.close();
    setEventSource(null);
    setWorkflowTaskId(null);
    setWorkflowRiskUuid(null);
    setQuestions([]);
    setAnswers({});
    setPendingPayload(null);
    setErrorMessage(null);
    setIsLoading(false);
    setStep("input");
  };

  const mapBackendRiskToUi = (payload: Record<string, unknown>): Risk => {
    const analysis = (payload.analysis as Record<string, unknown>) || {};
    const startDateValue = (payload.start_date as string) || formData.startDate || today;
    const endDateValue = (payload.end_date as string) || formData.endDate || oneYearLaterStr;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      id: (payload.risk_uuid as string) || `${Date.now()}`,
      title: (analysis.title as string) || detectedItem || "Risiko",
      category: getCategoryFromDescription(
        ((analysis.title as string) || (payload.initial_prompt as string) || formData.description || "").toString()
      ),
      description: (analysis.summary as string) || (payload.initial_prompt as string) || formData.description,
      coverageAmount: Number(payload.insurance_value || formData.insuranceValue || 0),
      premium: 0,
      duration: Number.isFinite(duration) ? duration : 1,
      status: ((payload.status as string) || "completed") as Risk["status"],
      createdBy: "Sie",
      createdByUserId: "session-user",
      createdAt: new Date(),
      expiresAt: endDate,
      userRole: "giver",
      riskScore: Number(analysis.acceptance_risk_percentage || 0),
      views: 0,
      favorites: 0,
    };
  };

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

  useEffect(() => {
    return () => {
      eventSource?.close();
    };
  }, [eventSource]);

  const extractQuestions = (payload: Record<string, unknown>): Array<{ id: string; prompt: string }> => {
    const candidate =
      (payload.questions as unknown[]) ??
      ((payload.inquiry as { questions?: unknown[] } | undefined)?.questions) ??
      (payload.inquiry_questions as unknown[]);

    if (!Array.isArray(candidate)) return [];

    return candidate.map((item, index) => {
      if (typeof item === "string") {
        return { id: `q-${index}`, prompt: item };
      }
      const question = item as { id?: string; prompt?: string; question?: string; text?: string };
      return {
        id: question.id || `q-${index}`,
        prompt: question.prompt || question.question || question.text || `Frage ${index + 1}`,
      };
    });
  };

  const handleWorkflowEvent = async (payload: Record<string, unknown>) => {
    const status =
      (payload.status as string | undefined) ||
      (payload.state as string | undefined) ||
      (payload.phase as string | undefined);

    if (!status) return;

    if (status === "inquiry_awaiting_response") {
      const nextQuestions = extractQuestions(payload);
      setQuestions(nextQuestions);
      setAnswers((prev) => {
        const next = { ...prev };
        nextQuestions.forEach((question) => {
          if (!next[question.id]) {
            next[question.id] = "";
          }
        });
        return next;
      });
      setIsLoading(false);
      setStep("questions");
    }

    if (status === "completed" && workflowRiskUuid) {
      setIsLoading(false);
      try {
        const riskResponse = (await getRisk(workflowRiskUuid)) as Record<string, unknown>;
        const risk = mapBackendRiskToUi(riskResponse);
        if (onRiskCreated) {
          onRiskCreated(risk);
        }
        resetWorkflow();
        onClose();
      } catch (error) {
        setErrorMessage("Die Risikoauswertung konnte nicht geladen werden.");
      }
    }

    if (status === "failed") {
      setIsLoading(false);
      setErrorMessage("Die Risikoanalyse ist fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  const beginWorkflow = async (payload: WorkflowStartPayload) => {
    setErrorMessage(null);
    setIsLoading(true);
    setStep("loading");
    setCurrentPhaseIndex(0);
    setProgress(0);
    setCompletedPhases([]);

    try {
      const response = await startWorkflow(payload);
      const taskId = response.task_id;
      const riskUuid = response.risk_uuid;
      setPendingPayload(null);
      setWorkflowTaskId(taskId);
      setWorkflowRiskUuid(riskUuid);

      const sse = createSSE(taskId);
      sse.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as Record<string, unknown>;
          handleWorkflowEvent(payload);
        } catch (error) {
          setErrorMessage("Unerwartetes Datenformat im Workflow-Stream.");
        }
      };
      sse.onerror = () => {
        setErrorMessage("Die Verbindung zum Workflow-Stream wurde unterbrochen.");
      };
      setEventSource(sse);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Workflow konnte nicht gestartet werden. Bitte erneut versuchen.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form values
    const form = e.target as HTMLFormElement;
    const description = (form.elements.namedItem("risk-description") as HTMLTextAreaElement)?.value || initialRiskDescription;
    const startDate = (form.elements.namedItem("start-date") as HTMLInputElement)?.value || today;
    const endDate = (form.elements.namedItem("end-date") as HTMLInputElement)?.value || oneYearLaterStr;
    const insuranceValue = (form.elements.namedItem("insurance-value") as HTMLInputElement)?.value || "1000";
    
    const payload: WorkflowStartPayload = {
      initial_prompt: description,
      start_date: startDate,
      end_date: endDate,
      insurance_value: Number(insuranceValue),
    };

    setFormData({
      description,
      startDate,
      endDate,
      insuranceValue,
    });
    const item = getItemFromDescription(description);
    setDetectedItem(item);

    if (!user) {
      setPendingPayload(payload);
      setStep("auth");
      return;
    }

    void beginWorkflow(payload);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowTaskId || !workflowRiskUuid) {
      setErrorMessage("Die Workflow-Session fehlt. Bitte erneut starten.");
      return;
    }

    setIsLoading(true);
    setStep("loading");

    try {
      await inquiryResponse({
        task_id: workflowTaskId,
        risk_uuid: workflowRiskUuid,
        answers,
      });
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Antworten konnten nicht gesendet werden.");
    }
  };

  const handleAuthLogin = async (email: string, password: string) => {
    await doLogin(email, password);
    if (pendingPayload) {
      setStep("loading");
      await beginWorkflow(pendingPayload);
    }
  };

  const handleAuthRegister = async (email: string, password: string, name: string) => {
    await doRegister(email, password, name);
    if (pendingPayload) {
      setStep("loading");
      await beginWorkflow(pendingPayload);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetWorkflow();
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

        {questions.length === 0 ? (
          <Typography className="body-sm text-secondary">
            Bitte warten, Fragen werden geladen...
          </Typography>
        ) : (
          questions.map((question, index) => (
            <Box key={question.id}>
              <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
                {question.prompt}
              </Typography>
              <TextField
                name={`question-${question.id}`}
                placeholder={`Antwort ${index + 1}`}
                fullWidth
                multiline
                rows={3}
                value={answers[question.id] || ""}
                onChange={(event) =>
                  setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))
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
          ))
        )}
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
      {errorMessage && (
        <Typography className="body-sm" sx={{ color: "#b91c1c", mb: 2 }}>
          {errorMessage}
        </Typography>
      )}
      {step === "input" && renderInputForm()}
      {step === "loading" && renderLoading()}
      {step === "questions" && renderQuestions()}
      {step === "auth" && <AuthModal onLogin={handleAuthLogin} onRegister={handleAuthRegister} />}
    </BaseModal>
  );
}
