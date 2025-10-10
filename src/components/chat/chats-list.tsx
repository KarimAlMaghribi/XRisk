import React, { useEffect, useMemo, useState } from "react";
import {
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Alert,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { selectActiveChatId, selectChatsToDisplay } from "../../store/slices/my-bids/selectors";
import { setActiveChat, setChatSort } from "../../store/slices/my-bids/reducers";
import { auth } from "../../firebase_config";
import { formatLastActivity } from "./utils";
import Scrollbar from "./scrollbar";
import { chatsUnsubscribe, subscribeToChats } from "../../store/slices/my-bids/thunks";
import { Chat } from "../../store/slices/my-bids/types";
import { Trans } from "react-i18next";

export enum ChatSort {
  LATEST = "LATEST",
  OLDEST = "OLDEST",
}

type Props = {
  onItemClick?: () => void; // Mobile: Liste -> Thread Toggle
};

export const ChatsList: React.FC<Props> = ({ onItemClick }) => {
  const dispatch: AppDispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const activeChatId: string | null = useSelector(selectActiveChatId);
  const chats: Chat[] = useSelector(selectChatsToDisplay);
  const uid: string | undefined = auth.currentUser?.uid;

  useEffect(() => {
    dispatch(subscribeToChats());
    return () => { if (chatsUnsubscribe) chatsUnsubscribe(); };
  }, [dispatch]);

  const isMenuOpen = Boolean(anchorEl);
  const handleSelectChat = (chatId: string) => {
    if (chatId !== activeChatId) dispatch(setActiveChat(chatId));
    onItemClick?.();
  };
  const handleSetChatSort = (sort: ChatSort) => dispatch(setChatSort(sort));
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

  // **Mobil-Fix:** Wenn UID noch nicht verfügbar, zeige alle gelieferten Chats (statt leerer Liste).
  const visibleChats = useMemo(() => {
    if (!Array.isArray(chats) || !chats.length) return [];
    if (!uid) return chats;
    return chats.filter((c) => c.riskProvider.uid === uid || c.riskTaker.uid === uid);
  }, [chats, uid]);

  return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
        <Box px={2.5} pb={1} flexShrink={0}>
          <Button
              id="basic-button"
              aria-controls={isMenuOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? "true" : undefined}
              onClick={handleClick}
              color="inherit"
          >
            <Trans i18nKey={"chat.chats_list.last_chats"} /> <ExpandMoreIcon />
          </Button>
          <Menu id="basic-menu" anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose} MenuListProps={{ "aria-labelledby": "basic-button" }}>
            <MenuItem onClick={() => handleSetChatSort(ChatSort.LATEST)}>
              <Trans i18nKey={"chat.chats_list.new_chats"} />
            </MenuItem>
            <MenuItem onClick={() => handleSetChatSort(ChatSort.OLDEST)}>
              <Trans i18nKey={"chat.chats_list.oldest_chats"} />
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, width: "100%", display: "flex" }}>
          <Scrollbar sx={{ height: "100%", width: "100%" }}>
            {visibleChats.length ? (
                <List sx={{ px: 0 }}>
                  {visibleChats.map((chat) => {
                    const avatarSrc =
                        uid
                            ? (chat.riskTaker.uid === uid ? chat.riskProvider.imagePath : chat.riskTaker.imagePath)
                            : (chat.riskTaker.imagePath || chat.riskProvider.imagePath);
                    return (
                        <ListItemButton
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            sx={{ mb: 0.5, py: 2, px: 3, alignItems: "start" }}
                            selected={activeChatId === chat.id}
                        >
                          <ListItemAvatar>
                            <Avatar src={avatarSrc} sx={{ width: 42, height: 42 }} />
                          </ListItemAvatar>
                          <ListItemText
                              primary={
                                <Typography variant="subtitle2" fontWeight={600} mb={0.5} noWrap title={chat.topic}>
                                  {chat.topic}
                                </Typography>
                              }
                              secondary={chat.lastMessage || ""}
                              secondaryTypographyProps={{ noWrap: true }}
                              sx={{ my: 0 }}
                          />
                          <Box sx={{ flexShrink: 0 }} mt={0.5}>
                            <Typography variant="body2">{formatLastActivity(chat?.lastActivity) || ""}</Typography>
                          </Box>
                        </ListItemButton>
                    );
                  })}
                </List>
            ) : (
                <Box sx={{ m: 2, width: "auto" }}>
                  <Alert severity="info" variant="outlined">
                    <Trans i18nKey={"chat.chats_list.no_chats_found"} defaults="Keine Chats gefunden." />
                  </Alert>
                </Box>
            )}
          </Scrollbar>
        </Box>
      </Box>
  );
};
