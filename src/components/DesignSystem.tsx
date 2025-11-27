import { useState } from "react";
import { Box, Typography, Paper, Divider, Chip, Button, TextField, IconButton } from "@mui/material";
import { RiskCard } from "./RiskCard";
import { RiskCardList } from "./RiskCardList";
import { ChatBubble } from "./ChatBubble";
import { OfferMessageCard } from "./OfferMessageCard";
import { VerifiedBadge } from "./VerifiedBadge";
import { BaseModal } from "./BaseModal";
import { StatusBadge, CustomBadge } from "./StatusBadge";
import { Risk, RiskCategory, RiskStatus } from "./types/risk";
import { Message, OfferMessageData } from "./types/message";
import { Offer } from "./types/offer";
import { Trash2, Send, CheckCircle2, Clock, XCircle, AlertTriangle, Eye } from "lucide-react";

export function DesignSystem() {
  const [showModal, setShowModal] = useState(false);
  
  // Sample Data
  const sampleRisk: Risk = {
    id: "1",
    title: "DJI Mavic 3 Pro - Professionelle Drohne",
    category: "electronics" as RiskCategory,
    description: "Absicherung für professionelle Drohne DJI Mavic 3 Pro inkl. Zubehör. Neuwertig, gekauft im Januar 2024.",
    coverageAmount: 2500,
    premium: 75,
    duration: 7,
    status: "active" as RiskStatus,
    createdBy: "Max Mustermann",
    createdByUserId: "user1",
    createdAt: new Date("2024-01-15"),
    userRole: "giver",
    riskScore: 45,
    views: 142,
    favorites: 23,
    recommendedPriceRange: { min: 60, max: 90 },
  };

  const sampleMessage: Message = {
    id: "1",
    conversationId: "conv1",
    senderId: "user2",
    senderName: "Anna Schmidt",
    senderVerified: true,
    content: "Hallo! Ich würde gerne ein Angebot für deine Drohne abgeben. Ist sie noch verfügbar?",
    timestamp: new Date(),
    isRead: false,
  };

  const sampleOffer: Offer = {
    id: "1",
    riskId: "1",
    riskTitle: sampleRisk.title,
    riskCategory: sampleRisk.category,
    riskLevel: 3,
    coverageAmount: sampleRisk.coverageAmount,
    offeredBy: sampleRisk.createdBy,
    offeredByUserId: sampleRisk.createdByUserId,
    premium: sampleRisk.premium,
    takerId: "user2",
    takerName: "Anna Schmidt",
    takerAvatar: undefined,
    giverId: "user1",
    giverName: "Max Mustermann",
    amount: 75,
    message: "Ich habe Erfahrung mit Drohnen und würde das Risiko gerne übernehmen.",
    status: "pending",
    createdAt: new Date(),
    coverageTypes: {
      damage: true,
      replacement: true,
      lossOrTheft: true,
    },
  };

  const sampleOfferMessage: OfferMessageData = {
    offerId: sampleOffer.id,
    riskId: sampleOffer.riskId,
    riskTitle: sampleOffer.riskTitle,
    riskCategory: sampleOffer.riskCategory,
    riskLevel: sampleOffer.riskLevel,
    coverageAmount: sampleOffer.coverageAmount,
    offeredPremium: sampleOffer.premium,
    recommendedPriceRange: sampleOffer.recommendedPriceRange,
    coverageTypes: sampleOffer.coverageTypes,
    status: sampleOffer.status,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 8 }}>
      {/* Header */}
      <Box>
        <h1 className="heading-1" style={{ marginBottom: "8px" }}>
          Design System - RiskExchange
        </h1>
        <Typography className="body-sm text-secondary">
          Vollständige Übersicht aller Komponenten, Stile und Varianten
        </Typography>
      </Box>

      {/* Typography Section */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          1. Typografie
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Überschriften</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".display-hero" size="small" sx={{ mb: 1 }} />
                <p className="display-hero">Display Hero - Inter Black 52px</p>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".display-large" size="small" sx={{ mb: 1 }} />
                <p className="display-large">Display Large - Inter Black 40px</p>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".heading-1" size="small" sx={{ mb: 1 }} />
                <h1 className="heading-1">Heading 1 - Inter Black 32px</h1>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".heading-2" size="small" sx={{ mb: 1 }} />
                <h2 className="heading-2">Heading 2 - Inter Bold 24px</h2>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".heading-3" size="small" sx={{ mb: 1 }} />
                <h3 className="heading-3">Heading 3 - Inter Semibold 20px</h3>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".heading-4" size="small" sx={{ mb: 1 }} />
                <h4 className="heading-4">Heading 4 - Inter Medium 18px</h4>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Fließtext</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".body-base" size="small" sx={{ mb: 1 }} />
                <p className="body-base">Body Base - Inter Regular 16px - Standard-Fließtext</p>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".body-base-medium" size="small" sx={{ mb: 1 }} />
                <p className="body-base-medium">Body Base Medium - Inter Medium 16px</p>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".body-sm" size="small" sx={{ mb: 1 }} />
                <p className="body-sm">Body Small - Inter Regular 14px</p>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".body-xs" size="small" sx={{ mb: 1 }} />
                <p className="body-xs">Body Extra Small - Inter Regular 12px</p>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Spezialklassen</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".display-value" size="small" sx={{ mb: 1 }} />
                <span className="display-value">8.500 €</span>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".button-text" size="small" sx={{ mb: 1 }} />
                <span className="button-text">Button Text - Inter Medium 16px</span>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".label" size="small" sx={{ mb: 1 }} />
                <label className="label">Label - Inter Regular 12px</label>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Colors Section */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          2. Farben
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Brand Farben</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 2 }}>
              <Box sx={{ p: 3, bgcolor: "#ff671f", borderRadius: 1, textAlign: "center" }}>
                <Typography sx={{ color: "#fff" }}>Brand Primary</Typography>
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>#ff671f</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: "#e55b1a", borderRadius: 1, textAlign: "center" }}>
                <Typography sx={{ color: "#fff" }}>Brand Hover</Typography>
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>#e55b1a</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: "#e05a1b", borderRadius: 1, textAlign: "center" }}>
                <Typography sx={{ color: "#fff" }}>Brand Active</Typography>
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>#e05a1b</Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Status Farben</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 2 }}>
              <Box sx={{ p: 3, bgcolor: "#00a63e", borderRadius: 1, textAlign: "center" }}>
                <Typography sx={{ color: "#fff" }}>Success/Active</Typography>
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>#00a63e</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: "#ffa726", borderRadius: 1, textAlign: "center" }}>
                <Typography sx={{ color: "#fff" }}>Warning/Pending</Typography>
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>#ffa726</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: "#f54900", borderRadius: 1, textAlign: "center" }}>
                <Typography sx={{ color: "#fff" }}>Error/Expired</Typography>
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>#f54900</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: "#353131", borderRadius: 1, textAlign: "center" }}>
                <Typography sx={{ color: "#fff" }}>Completed</Typography>
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>#353131</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: "#2196f3", borderRadius: 1, textAlign: "center" }}>
                <Typography sx={{ color: "#fff" }}>Info/Evaluating</Typography>
                <Typography sx={{ color: "#fff", fontSize: "12px" }}>#2196f3</Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Text Farben</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".text-primary" size="small" sx={{ mb: 1 }} />
                <p className="text-primary">Primary Text - #353131</p>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".text-secondary" size="small" sx={{ mb: 1 }} />
                <p className="text-secondary">Secondary Text - #4f4a4a</p>
              </Box>
              <Box sx={{ p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                <Chip label=".text-brand" size="small" sx={{ mb: 1 }} />
                <p className="text-brand">Brand Text - #ff671f</p>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Buttons Section */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          3. Buttons
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Primary Buttons (Brand)</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <button className="bg-[#ff671f] cursor-pointer hover:opacity-90 text-inverse button-text box-border flex gap-2 items-center justify-center px-4 py-2 rounded-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)]">
                <span>Primary Button</span>
              </button>
              <button className="bg-[#ff671f] cursor-pointer hover:opacity-90 text-inverse button-text box-border flex gap-2 items-center justify-center px-4 py-2 rounded-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)]">
                <Send size={18} />
                <span>Mit Icon</span>
              </button>
              <button 
                disabled 
                className="bg-[#e6e5e5] cursor-not-allowed text-[#4f4a4a] button-text box-border flex gap-2 items-center justify-center px-4 py-2 rounded-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)]"
              >
                <span>Disabled</span>
              </button>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Secondary Buttons (Success)</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <button className="bg-[#00a63e] cursor-pointer hover:opacity-90 text-inverse button-text box-border flex gap-2 items-center justify-center px-4 py-2 rounded-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)]">
                <span>Success Button</span>
              </button>
              <button className="bg-[#00a63e] cursor-pointer hover:opacity-90 text-inverse button-text box-border flex gap-2 items-center justify-center px-4 py-2 rounded-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)]">
                <CheckCircle2 size={18} />
                <span>Veröffentlichen</span>
              </button>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Outlined Buttons</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <button className="button-text text-primary bg-transparent border border-[#e6e5e5] border-solid box-border flex gap-2 items-center justify-center px-4 py-2 rounded-[8px] cursor-pointer hover:bg-[#f3f2f2] transition-colors">
                <span>Outlined</span>
              </button>
              <button className="button-text text-primary bg-transparent border border-[#e6e5e5] border-solid box-border flex gap-2 items-center justify-center px-4 py-2 rounded-[8px] cursor-pointer hover:bg-[#f3f2f2] transition-colors">
                <Eye size={18} />
                <span>Details</span>
              </button>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Icon Buttons</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <IconButton sx={{ color: "#f54900", "&:hover": { bgcolor: "rgba(245, 73, 0, 0.08)" } }}>
                <Trash2 size={20} />
              </IconButton>
              <IconButton sx={{ color: "#ff671f", "&:hover": { bgcolor: "rgba(255, 103, 31, 0.08)" } }}>
                <Send size={20} />
              </IconButton>
              <IconButton sx={{ color: "#00a63e", "&:hover": { bgcolor: "rgba(0, 166, 62, 0.08)" } }}>
                <CheckCircle2 size={20} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Badges Section */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          4. Badges & Status Indicators
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Status Badges</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <StatusBadge status="active" />
              <StatusBadge status="pending" />
              <StatusBadge status="completed" />
              <StatusBadge status="draft" />
              <StatusBadge status="expired" />
              <StatusBadge status="evaluating" />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Risk Level Badges</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Chip label="Risikobewertung: 1" sx={{ bgcolor: "#00a63e", color: "#ffffff" }} />
              <Chip label="Risikobewertung: 2" sx={{ bgcolor: "#8bc34a", color: "#ffffff" }} />
              <Chip label="Risikobewertung: 3" sx={{ bgcolor: "#ffa726", color: "#ffffff" }} />
              <Chip label="Risikobewertung: 4" sx={{ bgcolor: "#ff5722", color: "#ffffff" }} />
              <Chip label="Risikobewertung: 5" sx={{ bgcolor: "#f44336", color: "#ffffff" }} />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Custom Badges</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <CustomBadge label="Bestes Angebot: 75 €" variant="success" />
              <CustomBadge label="3 Angebote" variant="warning" />
              <CustomBadge label="Noch 7 Tage" variant="success" />
              <CustomBadge label="+50 € Prämie" variant="success" />
              <CustomBadge label="Info Badge" variant="info" />
              <CustomBadge label="Neutral Badge" variant="neutral" />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Special Badges</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <VerifiedBadge size={24} />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Form Elements Section */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          5. Formular-Elemente
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Text Inputs</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "400px" }}>
              <Box>
                <label className="label" style={{ marginBottom: "4px", display: "block" }}>Label</label>
                <TextField
                  fullWidth
                  placeholder="Platzhalter-Text"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: "#ffffff",
                      "& fieldset": { borderColor: "#dddddd" },
                      "&:hover fieldset": { borderColor: "#cecaca" },
                      "&.Mui-focused fieldset": { borderColor: "#ff671f" },
                    },
                  }}
                />
              </Box>
              <Box>
                <label className="label" style={{ marginBottom: "4px", display: "block" }}>Mit Wert</label>
                <TextField
                  fullWidth
                  value="Eingegebener Text"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: "#ffffff",
                      "& fieldset": { borderColor: "#dddddd" },
                      "&:hover fieldset": { borderColor: "#cecaca" },
                      "&.Mui-focused fieldset": { borderColor: "#ff671f" },
                    },
                  }}
                />
              </Box>
              <Box>
                <label className="label" style={{ marginBottom: "4px", display: "block" }}>Disabled</label>
                <TextField
                  fullWidth
                  disabled
                  value="Deaktiviert"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: "#f3f2f2",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Textarea</Typography>
            <Box sx={{ maxWidth: "400px" }}>
              <label className="label" style={{ marginBottom: "4px", display: "block" }}>Beschreibung</label>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Mehrzeiliger Text..."
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "#ffffff",
                    "& fieldset": { borderColor: "#dddddd" },
                    "&:hover fieldset": { borderColor: "#cecaca" },
                    "&.Mui-focused fieldset": { borderColor: "#ff671f" },
                  },
                }}
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Number Inputs</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 2 }}>
              <Box>
                <label className="label" style={{ marginBottom: "4px", display: "block" }}>Betrag (€)</label>
                <TextField
                  fullWidth
                  type="number"
                  value="2500"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, step: 100 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: "#ffffff",
                      "& fieldset": { borderColor: "#dddddd" },
                      "&:hover fieldset": { borderColor: "#cecaca" },
                      "&.Mui-focused fieldset": { borderColor: "#ff671f" },
                    },
                  }}
                />
              </Box>
              <Box>
                <label className="label" style={{ marginBottom: "4px", display: "block" }}>Tage</label>
                <TextField
                  fullWidth
                  type="number"
                  value="7"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 1, max: 365 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: "#ffffff",
                      "& fieldset": { borderColor: "#dddddd" },
                      "&:hover fieldset": { borderColor: "#cecaca" },
                      "&.Mui-focused fieldset": { borderColor: "#ff671f" },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Risk Cards Section */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          6. Risk Cards
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Card View - Active</Typography>
            <Box sx={{ maxWidth: "380px" }}>
              <RiskCard
                risk={sampleRisk}
                onTakeRisk={() => {}}
                onDetailsClick={() => {}}
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Card View - Draft</Typography>
            <Box sx={{ maxWidth: "380px" }}>
              <RiskCard
                risk={{ ...sampleRisk, status: "draft" as RiskStatus }}
                onTakeRisk={() => {}}
                onDetailsClick={() => {}}
                onPublish={() => {}}
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Card View - Pending (Mit Angeboten)</Typography>
            <Box sx={{ maxWidth: "380px" }}>
              <RiskCard
                risk={{ ...sampleRisk, status: "pending" as RiskStatus }}
                onTakeRisk={() => {}}
                onDetailsClick={() => {}}
                customBadges={
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 1, bgcolor: "#00a63e", borderRadius: "16px" }}>
                      <CheckCircle2 size={16} color="#ffffff" />
                      <Typography className="button-text-sm" sx={{ color: "#ffffff" }}>Bestes Angebot</Typography>
                    </Box>
                  </Box>
                }
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>List View - Active</Typography>
            <RiskCardList
              risk={sampleRisk}
              onTakeRisk={() => {}}
              onDetailsClick={() => {}}
            />
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Card View - Expired</Typography>
            <Box sx={{ maxWidth: "380px" }}>
              <RiskCard
                risk={{ ...sampleRisk, status: "expired" as RiskStatus }}
                onTakeRisk={() => {}}
                onDetailsClick={() => {}}
                customActionDisabled={true}
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Card View - Completed</Typography>
            <Box sx={{ maxWidth: "380px" }}>
              <RiskCard
                risk={{ ...sampleRisk, status: "completed" as RiskStatus, takenBy: "Anna Schmidt" }}
                onTakeRisk={() => {}}
                onDetailsClick={() => {}}
                customActionDisabled={true}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Message Components Section */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          7. Nachrichten-Komponenten
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Chat Bubble - Beispiel 1</Typography>
            <ChatBubble 
              text="Mein E-Bike geht auf eine 2-wöchige Alpenüberquerung"
              author="Max Mustermann"
              position={{ left: "0", top: "0" }}
              scrollProgress={1}
            />
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Chat Bubble - Beispiel 2</Typography>
            <ChatBubble 
              text="Ich verleihe meine teure Drohne für eine Bergtour"
              author="Anna Schmidt"
              position={{ left: "0", top: "0" }}
              scrollProgress={1}
            />
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Message Bubble - Standard</Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "white",
                border: "1px solid rgba(230, 229, 229, 0.4)",
                borderRadius: 2,
                maxWidth: "600px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#353131" }}>
                  {sampleMessage.senderName}
                </Typography>
                {sampleMessage.senderVerified && <VerifiedBadge size={16} />}
                <Typography sx={{ fontSize: "11px", color: "#9e9e9e" }}>
                  vor 5 Min
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "14px", color: "#353131" }}>
                {sampleMessage.content}
              </Typography>
            </Paper>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Message Bubble - System Message</Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "rgba(255, 103, 31, 0.08)",
                border: "1px solid rgba(255, 103, 31, 0.2)",
                borderRadius: 2,
                maxWidth: "600px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#353131" }}>
                  System
                </Typography>
                <Typography sx={{ fontSize: "11px", color: "#9e9e9e" }}>
                  vor 10 Min
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "14px", color: "#353131" }}>
                Das Angebot wurde akzeptiert. Die Absicherung ist nun aktiv.
              </Typography>
            </Paper>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Offer Message Card - Pending</Typography>
            <OfferMessageCard
              offer={sampleOfferMessage}
              onAccept={() => {}}
              onDecline={() => {}}
              isCurrentUser={false}
            />
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Offer Message Card - Accepted</Typography>
            <OfferMessageCard
              offer={{ ...sampleOfferMessage, status: "accepted" }}
              onAccept={() => {}}
              onDecline={() => {}}
              isCurrentUser={false}
            />
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Offer Message Card - Rejected</Typography>
            <OfferMessageCard
              offer={{ ...sampleOfferMessage, status: "declined" }}
              onAccept={() => {}}
              onDecline={() => {}}
              isCurrentUser={false}
            />
          </Box>
        </Box>
      </Paper>

      {/* Modals Section */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          8. Modals & Dialoge
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Base Modal</Typography>
            <Button 
              variant="contained" 
              onClick={() => setShowModal(true)}
              sx={{
                bgcolor: "#ff671f",
                "&:hover": { bgcolor: "#e55b1a" },
                textTransform: "none",
              }}
            >
              Modal öffnen
            </Button>
          </Box>

          <Divider />

          <Box>
            <Typography className="body-sm text-secondary">
              Weitere Modal-Varianten:
            </Typography>
            <ul className="body-sm" style={{ marginTop: "8px", paddingLeft: "24px" }}>
              <li>RiskInputModal - Risiko erstellen/bearbeiten</li>
              <li>TakeRiskModal - Angebot abgeben</li>
              <li>DeleteRiskDialog - Bestätigungsdialog</li>
              <li>RiskDetailDialog - Detail-Ansicht</li>
              <li>UserProfileDialog - Benutzerprofil</li>
              <li>AuthModal - Login/Registrierung</li>
            </ul>
          </Box>
        </Box>

        <BaseModal open={showModal} onClose={() => setShowModal(false)} title="Base Modal Beispiel">
          <Box sx={{ p: 3 }}>
            <Typography className="body-base" sx={{ mb: 2 }}>
              Dies ist ein Beispiel für das Base Modal mit Standard-Styling.
            </Typography>
            <Typography className="body-sm text-secondary">
              Es nutzt Glasmorphism-Effekte und das Standard-Spacing-System.
            </Typography>
          </Box>
        </BaseModal>
      </Paper>

      {/* Spacing System */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          9. Spacing-System (8er-Reihe)
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Kleine Abstände (4px Schritte)</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { value: "4px", label: "gap-1 / 0.5" },
                { value: "8px", label: "gap-2 / 1" },
                { value: "12px", label: "gap-3 / 1.5" },
              ].map((item) => (
                <Box key={item.value} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                  <Chip label={item.label} size="small" />
                  <Box sx={{ width: item.value, height: "24px", bgcolor: "#ff671f", borderRadius: 0.5 }} />
                  <Typography className="body-sm">{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography className="label" sx={{ mb: 2 }}>Hauptabstände (8px Reihe)</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { value: "16px", label: "gap-4 / 2" },
                { value: "24px", label: "gap-6 / 3" },
                { value: "32px", label: "gap-8 / 4" },
                { value: "40px", label: "gap-10 / 5" },
                { value: "48px", label: "gap-12 / 6" },
              ].map((item) => (
                <Box key={item.value} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f3f2f2", borderRadius: 1 }}>
                  <Chip label={item.label} size="small" />
                  <Box sx={{ width: item.value, height: "24px", bgcolor: "#ff671f", borderRadius: 0.5 }} />
                  <Typography className="body-sm">{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Status Icons */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          10. Status Icons
        </h2>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 3, bgcolor: "#f3f2f2", borderRadius: 1 }}>
            <CheckCircle2 size={32} color="#00a63e" />
            <Typography className="body-sm">Success</Typography>
            <Typography className="body-xs text-secondary">#00a63e</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 3, bgcolor: "#f3f2f2", borderRadius: 1 }}>
            <Clock size={32} color="#ffa726" />
            <Typography className="body-sm">Pending</Typography>
            <Typography className="body-xs text-secondary">#ffa726</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 3, bgcolor: "#f3f2f2", borderRadius: 1 }}>
            <XCircle size={32} color="#f54900" />
            <Typography className="body-sm">Error</Typography>
            <Typography className="body-xs text-secondary">#f54900</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 3, bgcolor: "#f3f2f2", borderRadius: 1 }}>
            <AlertTriangle size={32} color="#ffa726" />
            <Typography className="body-sm">Warning</Typography>
            <Typography className="body-xs text-secondary">#ffa726</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 3, bgcolor: "#f3f2f2", borderRadius: 1 }}>
            <Eye size={32} color="#353131" />
            <Typography className="body-sm">View</Typography>
            <Typography className="body-xs text-secondary">#353131</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 3, bgcolor: "#f3f2f2", borderRadius: 1 }}>
            <Trash2 size={32} color="#f54900" />
            <Typography className="body-sm">Delete</Typography>
            <Typography className="body-xs text-secondary">#f54900</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Border Radius */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5" }}>
        <h2 className="heading-2" style={{ marginBottom: "24px" }}>
          11. Border Radius
        </h2>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 2 }}>
          {[
            { label: "Small", value: "8px" },
            { label: "Medium", value: "14px" },
            { label: "Large", value: "16px" },
            { label: "Pill", value: "100px" },
          ].map((item) => (
            <Box key={item.label} sx={{ p: 3, bgcolor: "#ff671f", borderRadius: item.value, textAlign: "center" }}>
              <Typography sx={{ color: "#fff" }}>{item.label}</Typography>
              <Typography sx={{ color: "#fff", fontSize: "12px" }}>{item.value}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Summary */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e6e5e5", bgcolor: "#f3f2f2" }}>
        <h2 className="heading-2" style={{ marginBottom: "16px" }}>
          Design-System Zusammenfassung
        </h2>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography className="body-base-medium" sx={{ mb: 1 }}>Prinzipien:</Typography>
            <ul className="body-sm" style={{ paddingLeft: "24px", margin: 0 }}>
              <li>Konsequente 8er-Reihe für Abstände (4px im kleinen Bereich erlaubt)</li>
              <li>Alle Styles durch Klassen im Design-System definiert</li>
              <li>Brand-Farbe Orange (#ff671f) für primäre Aktionen</li>
              <li>Material UI 3 als Basis-Framework</li>
              <li>Glasmorphism-Effekte für moderne Optik</li>
              <li>Responsive Mobile-First Ansatz</li>
            </ul>
          </Box>

          <Box>
            <Typography className="body-base-medium" sx={{ mb: 1 }}>Status-System:</Typography>
            <ul className="body-sm" style={{ paddingLeft: "24px", margin: 0 }}>
              <li>active (grün) - Aktive Risiken im Marktplatz</li>
              <li>pending (orange) - Angebote ausstehend</li>
              <li>completed (grau) - Erfolgreich abgeschlossen</li>
              <li>draft (hellgrau) - Noch nicht veröffentlicht</li>
              <li>expired (rot) - Abgelaufen</li>
              <li>evaluating (blau) - In Prüfung</li>
            </ul>
          </Box>

          <Box>
            <Typography className="body-base-medium" sx={{ mb: 1 }}>Risikobewertung (5-Punkte-Skala):</Typography>
            <ul className="body-sm" style={{ paddingLeft: "24px", margin: 0 }}>
              <li>Level 1 (grün) - Sehr niedriges Risiko</li>
              <li>Level 2 (hellgrün) - Niedriges Risiko</li>
              <li>Level 3 (orange) - Mittleres Risiko</li>
              <li>Level 4 (dunkelorange) - Hohes Risiko</li>
              <li>Level 5 (rot) - Sehr hohes Risiko</li>
            </ul>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
