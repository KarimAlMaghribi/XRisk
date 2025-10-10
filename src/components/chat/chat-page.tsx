// src/pages/chat/chat-page.tsx
import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { ChatSidebar } from "../../components/chat/chat-sidebar";
import { ChatHeader } from "../../components/chat/chat-header";
import { ChatMessages } from "../../components/chat/chat-messages";
import { ChatSender } from "../../components/chat/chat-sender";
import { ChatsList } from "../../components/chat/chats-list";

/**
 * Desktop: 2-Pane (Sidebar + Thread)
 * Mobile/Tablet: One-Pane (Liste ↔ Thread) mit Back & Swipe-Back.
 * WICHTIG: Auf Mobile wird der Thread NUR via lokalen State geöffnet,
 * damit der Zurück-Button zuverlässig funktioniert.
 */
const ChatPage: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isTouch = useMediaQuery("(pointer: coarse)");

  // Nutzer-gesteuertes Öffnen/Schließen des Threads (Listenklick / Back)
  const [threadOpen, setThreadOpen] = React.useState(false);

  // Swipe-Back (vom linken Rand) nur wenn Thread offen & mobil
  const touchStartX = React.useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isDesktop && threadOpen) touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDesktop && threadOpen && touchStartX.current !== null) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const startedAtEdge = touchStartX.current <= 24;
      if (startedAtEdge && dx > 60) setThreadOpen(false);
    }
    touchStartX.current = null;
  };

  if (isDesktop) {
    return (
        <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden", width: "100%" }}>
          <ChatSidebar />
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100dvh" }}>
            <ChatHeader />
            <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
              <ChatMessages />
            </Box>
            <ChatSender />
          </Box>
        </Box>
    );
  }

  // Mobile/Tablet: One-Pane
  return (
      <Box
          onTouchStart={isTouch ? handleTouchStart : undefined}
          onTouchEnd={isTouch ? handleTouchEnd : undefined}
          sx={{ display: "flex", flexDirection: "column", height: "100dvh", width: "100%", overflow: "hidden", bgcolor: "background.default" }}
      >
        {threadOpen ? (
            <>
              <ChatHeader onMobileBack={() => setThreadOpen(false)} />
              <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
                <ChatMessages />
              </Box>
              <ChatSender />
            </>
        ) : (
            <>
              {/* Listen-Header */}
              <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    bgcolor: "background.paper",
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    p: 2,
                  }}
              >
                <strong>Letzte Chats</strong>
              </Box>
              {/* Liste füllt den Rest */}
              <Box sx={{ flex: 1, minHeight: 0, display: "flex", width: "100%" }}>
                <ChatsList onItemClick={() => setThreadOpen(true)} />
              </Box>
            </>
        )}
      </Box>
  );
};

export default ChatPage;
