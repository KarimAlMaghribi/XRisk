import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  Typography,
  IconButton,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Info as InfoIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { mockConversations, mockMessages } from "./lib/messages-mock-data";
import { Conversation, Message } from "./types/message";
import { currentUser } from "./lib/current-user";
import { OfferMessageCard } from "./OfferMessageCard";
import { users } from "./lib/user-mock-data";

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0]
  );
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || []);
    }
  }, [selectedConversation]);

  const getRiskLevelColor = (level: number): string => {
    switch (level) {
      case 1:
        return "#4caf50"; // Green
      case 2:
        return "#8bc34a"; // Light Green
      case 3:
        return "#ffc107"; // Yellow/Orange
      case 4:
        return "#ff9800"; // Orange
      case 5:
        return "#f44336"; // Red
      default:
        return "#9e9e9e";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "active":
        return "Aktiv";
      case "in-negotiation":
        return "In Verhandlung";
      case "transferred":
        return "Übertragen";
      case "completed":
        return "Abgeschlossen";
      default:
        return status;
    }
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `vor ${minutes} Min`;
    if (hours < 24) return `vor ${hours} Std`;
    if (days < 7) return `vor ${days} Tag${days > 1 ? "en" : ""}`;
    return date.toLocaleDateString("de-DE");
  };

  const formatCurrency = (amount: number, currency: string = "EUR"): string => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`,
      senderAvatar: currentUser.avatar,
      senderVerified: true,
      content: newMessage,
      timestamp: new Date(),
      isRead: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleAcceptOffer = (offerId: string) => {
    setMessages(messages.map(msg => {
      if (msg.offerData && msg.offerData.offerId === offerId) {
        return {
          ...msg,
          offerData: {
            ...msg.offerData,
            status: 'accepted'
          }
        };
      }
      return msg;
    }));
  };

  const handleDeclineOffer = (offerId: string) => {
    setMessages(messages.map(msg => {
      if (msg.offerData && msg.offerData.offerId === offerId) {
        return {
          ...msg,
          offerData: {
            ...msg.offerData,
            status: 'declined'
          }
        };
      }
      return msg;
    }));
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", height: "100%", bgcolor: "#fdfcfc" }}>
      {/* Left Sidebar - Conversations List */}
      <Box
        sx={{
          width: 380,
          borderRight: "1px solid rgba(230, 229, 229, 0.4)",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
        }}
      >
        {/* Search and Filter */}
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            placeholder="Konversationen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#4f4a4a" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <FilterIcon sx={{ color: "#4f4a4a" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#f5f5f5",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 103, 31, 0.3)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff671f",
                },
              },
            }}
          />
        </Box>

        {/* Conversations List */}
        <List sx={{ flexGrow: 1, overflow: "auto", px: 2 }}>
          {filteredConversations.map((conversation) => (
            <ListItem key={conversation.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedConversation?.id === conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                sx={{
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    bgcolor: "rgba(255, 103, 31, 0.08)",
                    "&:hover": {
                      bgcolor: "rgba(255, 103, 31, 0.12)",
                    },
                  },
                  "&:hover": {
                    bgcolor: "rgba(245, 245, 245, 0.5)",
                  },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 64 }}>
                  <Badge
                    badgeContent={conversation.unreadCount}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: "#ff671f",
                      },
                    }}
                  >
                    <Avatar
                      src={conversation.partnerAvatar}
                      alt={conversation.partnerName}
                      sx={{ width: 48, height: 48 }}
                    >
                      {!conversation.partnerAvatar && <AccountCircleIcon />}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    overflow: "hidden",
                    minWidth: 0,
                  }}
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                      <Typography
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#353131",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "140px",
                        }}
                      >
                        {conversation.partnerName}
                      </Typography>
                      {users[conversation.partnerId]?.verification.hasVerifiedEmail && 
                       users[conversation.partnerId]?.verification.hasVerifiedPhone && (
                        <VerifiedBadge size="small" />
                      )}
                      <Chip
                        label={conversation.myRole}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "10px",
                          bgcolor: conversation.myRole === "Risikogeber" ? "#2196f3" : "#9c27b0",
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      {/* Risiko-Titel */}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "12px",
                          color: "#353131",
                          fontWeight: 500,
                          display: "block",
                          mb: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conversation.riskTitle}
                      </Typography>
                      
                      {/* Angebot - wenn vorhanden */}
                      {conversation.currentOffer && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "11px",
                              color: "#757575",
                            }}
                          >
                            Angebot:
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#ff671f",
                            }}
                          >
                            {formatCurrency(conversation.currentOffer.premium)}
                          </Typography>
                          <Chip
                            label={
                              conversation.currentOffer.status === "accepted"
                                ? "Angenommen"
                                : conversation.currentOffer.status === "declined"
                                ? "Abgelehnt"
                                : "Offen"
                            }
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: "9px",
                              bgcolor:
                                conversation.currentOffer.status === "accepted"
                                  ? "#4caf50"
                                  : conversation.currentOffer.status === "declined"
                                  ? "#f44336"
                                  : "#ff9800",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      )}
                      
                      {/* Letzte Nachricht */}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "12px",
                          color: "#757575",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {conversation.lastMessage}
                      </Typography>
                      
                      {/* Zeitstempel */}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "11px",
                          color: "#9e9e9e",
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        {formatDate(conversation.lastMessageTime)}
                      </Typography>
                    </Box>
                  }
                  secondaryTypographyProps={{
                    component: "div",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Right Side - Messages and Risk Details */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {selectedConversation ? (
          <>
            {/* Risk & Offer Header */}
            <Paper
              elevation={0}
              sx={{
                borderBottom: "1px solid rgba(230, 229, 229, 0.4)",
                bgcolor: "white",
                p: 3,
              }}
            >
              {/* Risiko-Titel und Status */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#353131",
                    mb: 1,
                  }}
                >
                  {selectedConversation.riskTitle}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={selectedConversation.riskCategory}
                    size="small"
                    sx={{
                      bgcolor: "#f3f2f2",
                      color: "#4f4a4a",
                    }}
                  />
                  <Chip
                    label={`Risikobewertung ${selectedConversation.riskLevel}/5`}
                    size="small"
                    sx={{
                      bgcolor: getRiskLevelColor(selectedConversation.riskLevel),
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={getStatusLabel(selectedConversation.riskStatus)}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "#e6e5e5",
                      color: "#4f4a4a",
                    }}
                  />
                </Box>
              </Box>

              {/* Aktuelles Angebot - wenn vorhanden */}
              {selectedConversation.currentOffer && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: selectedConversation.currentOffer.status === "accepted" 
                      ? "rgba(76, 175, 80, 0.08)" 
                      : selectedConversation.currentOffer.status === "declined"
                      ? "rgba(244, 67, 54, 0.08)"
                      : "rgba(255, 103, 31, 0.08)",
                    borderRadius: 2,
                    border: `2px solid ${
                      selectedConversation.currentOffer.status === "accepted"
                        ? "#4caf50"
                        : selectedConversation.currentOffer.status === "declined"
                        ? "#f44336"
                        : "#ff671f"
                    }`,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#757575",
                          textTransform: "uppercase",
                          mb: 0.5,
                          fontWeight: 600,
                        }}
                      >
                        {selectedConversation.myRole === "Risikogeber" 
                          ? "Angebot von " + selectedConversation.partnerName
                          : "Ihr Angebot"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#ff671f",
                          }}
                        >
                          {formatCurrency(selectedConversation.currentOffer.premium)}
                        </Typography>
                        <Typography sx={{ fontSize: "14px", color: "#757575" }}>
                          für {formatCurrency(selectedConversation.riskCoverageAmount)} Absicherung
                        </Typography>
                      </Box>
                      {selectedConversation.currentOffer.recommendedPriceRange && (
                        <Typography sx={{ fontSize: "12px", color: "#757575", mt: 0.5 }}>
                          Empfohlene Spanne: {formatCurrency(selectedConversation.currentOffer.recommendedPriceRange.min)} - {formatCurrency(selectedConversation.currentOffer.recommendedPriceRange.max)}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={
                        selectedConversation.currentOffer.status === "accepted"
                          ? "Angenommen"
                          : selectedConversation.currentOffer.status === "declined"
                          ? "Abgelehnt"
                          : "Offen"
                      }
                      sx={{
                        bgcolor:
                          selectedConversation.currentOffer.status === "accepted"
                            ? "#4caf50"
                            : selectedConversation.currentOffer.status === "declined"
                            ? "#f44336"
                            : "#ff671f",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Messages Area */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: "auto",
                p: 3,
                bgcolor: "#fdfcfc",
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    mb: 3,
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <Avatar
                    src={message.senderAvatar}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: message.isSystemMessage ? "#ff671f" : "#e0e0e0",
                    }}
                  >
                    {message.isSystemMessage ? (
                      <InfoIcon sx={{ fontSize: 20 }} />
                    ) : !message.senderAvatar ? (
                      <AccountCircleIcon />
                    ) : null}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#353131",
                        }}
                      >
                        {message.senderName}
                      </Typography>
                      {message.senderVerified && !message.isSystemMessage && (
                        <VerifiedBadge size="small" />
                      )}
                      <Typography sx={{ fontSize: "11px", color: "#9e9e9e" }}>
                        {formatDate(message.timestamp)}
                      </Typography>
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: message.isSystemMessage
                          ? "rgba(255, 103, 31, 0.08)"
                          : "white",
                        border: message.isSystemMessage
                          ? "1px solid rgba(255, 103, 31, 0.2)"
                          : "1px solid rgba(230, 229, 229, 0.4)",
                        borderRadius: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", color: "#353131" }}>
                        {message.content}
                      </Typography>

                      {/* Offer Card */}
                      {message.offerData && (
                        <Box sx={{ mt: 2 }}>
                          <OfferMessageCard
                            offer={message.offerData}
                            onAccept={handleAcceptOffer}
                            onDecline={handleDeclineOffer}
                            isCurrentUser={message.senderId === currentUser.id}
                          />
                        </Box>
                      )}

                      {/* Risk References */}
                      {message.riskReferences && message.riskReferences.length > 0 && (
                        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                          {message.riskReferences.map((ref, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                p: 1.5,
                                bgcolor:
                                  ref.status === "critical"
                                    ? "rgba(244, 67, 54, 0.08)"
                                    : "rgba(255, 152, 0, 0.08)",
                                borderRadius: 1,
                                border: `1px solid ${
                                  ref.status === "critical" ? "#f44336" : "#ff9800"
                                }`,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                                  {ref.parameter}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color:
                                      ref.status === "critical" ? "#f44336" : "#ff9800",
                                  }}
                                >
                                  {ref.currentValue}
                                  {ref.threshold && ` / ${ref.threshold}`}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {message.attachments.map((attachment) => (
                            <Chip
                              key={attachment.id}
                              icon={<DescriptionIcon />}
                              label={`${attachment.name} (${attachment.size})`}
                              clickable
                              size="small"
                              sx={{
                                bgcolor: "#f5f5f5",
                                "&:hover": {
                                  bgcolor: "rgba(255, 103, 31, 0.08)",
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderTop: "1px solid rgba(230, 229, 229, 0.4)",
                bgcolor: "white",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                <IconButton
                  sx={{
                    color: "#4f4a4a",
                    "&:hover": {
                      bgcolor: "rgba(255, 103, 31, 0.08)",
                    },
                  }}
                >
                  <AttachFileIcon />
                </IconButton>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Nachricht schreiben..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(230, 229, 229, 0.4)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 103, 31, 0.3)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff671f",
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    bgcolor: "#ff671f",
                    color: "white",
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "0 4px 16px rgba(255, 103, 31, 0.25)",
                    "&:hover": {
                      bgcolor: "#e05a1b",
                    },
                    "&:disabled": {
                      bgcolor: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                >
                  Senden
                </Button>
              </Box>
            </Paper>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#9e9e9e",
            }}
          >
            <Typography>Wähle eine Konversation aus</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
