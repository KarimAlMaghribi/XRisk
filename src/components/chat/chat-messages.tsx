// src/components/chat/chat-messages.tsx
import React, { useEffect, useMemo, useRef } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ListItemAvatar } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { formatLastActivity } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase_config";
import { AppDispatch, RootState } from "../../store/store";
import { MessageTypeEnum } from "../../enums/MessageTypeEnum";
import { CHATBOT_UID } from "../../constants/chatbot";
import Logo from "../../assests/imgs/logo.png";
import { ChatMessage } from "../../store/slices/my-bids/types";
import {
  selectActiveChatId,
  selectActiveMessages,
  selectOpposingImagePath,
  selectOtherChatMemberName,
} from "../../store/slices/my-bids/selectors";
import { messagesUnsubscribe, subscribeToMessages } from "../../store/slices/my-bids/thunks";
import { selectImagePath } from "../../store/slices/user-profile/selectors";
import ReactMarkdown from "react-markdown";
import { Trans } from "react-i18next";

/**
 * Visual: Flex-Layout (Header sticky, Messages flex:1, Composer mobil fixiert).
 * Unten extra Padding, damit die fixe Eingabeleiste nichts überdeckt.
 */
export const ChatMessages = () => {
  const dispatch: AppDispatch = useDispatch();
  const activeChatId: string | null = useSelector(selectActiveChatId);
  const uid: string | undefined = auth.currentUser?.uid;
  const messages: ChatMessage[] = useSelector(selectActiveMessages);
  const userImage: string | undefined = useSelector(selectImagePath);
  const otherChatMemberImagePath: string = useSelector((state: RootState) =>
      selectOpposingImagePath({ myBids: state.myBids }, auth.currentUser?.uid)
  );
  const otherChatMemberName: string = useSelector((state: RootState) => selectOtherChatMemberName(state, uid));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeChatId) dispatch(subscribeToMessages(activeChatId));
    return () => { if (messagesUnsubscribe) messagesUnsubscribe(); };
  }, [activeChatId, dispatch]);

  const ordered = useMemo(() => (messages ? [...messages].reverse() : []), [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ordered]);

  if (!messages) {
    return (
        <Box display="flex" alignItems="center" p={2} pb={1} pt={1}>
          <Typography variant="h4">
            <Trans i18nKey={"chat.chats_list.choose_a_chat"} />
          </Typography>
        </Box>
    );
  }

  return (
      <Box
          sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", width: "100%" }}
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
      >
        <Box
            sx={{
              flex: 1,
              overflow: "auto",
              width: "100%",
              // Platz für die fixe Eingabeleiste (ca. 72px) + Safe-Area auf iOS
              pb: { xs: "calc(env(safe-area-inset-bottom) + 88px)", md: 0 },
            }}
            ref={scrollRef}
        >
          <Box p={2} sx={{ width: "100%" }}>
            {ordered.map((message) => (
                <Box key={message.id + "_" + message.created} sx={{ width: "100%" }}>
                  {message.uid !== uid ? (
                      // Andere
                      <Box display="flex" mb={2}>
                        <ListItemAvatar>
                          <Avatar
                              alt={otherChatMemberName}
                              src={message.uid === CHATBOT_UID ? Logo : otherChatMemberImagePath}
                              sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
                          />
                        </ListItemAvatar>
                        <Box>
                          {message.created ? (
                              <Typography variant="body2" color="grey.600" mb={0.5}>
                                {message.uid === CHATBOT_UID ? "xRisk-Chatbot" : otherChatMemberName},{" "}
                                {formatLastActivity(message.created)} <Trans i18nKey={"chat.chat_messages.ago"} />
                              </Typography>
                          ) : null}

                          {message.type === MessageTypeEnum.TEXT ? (
                              <Box
                                  sx={{
                                    borderRadius: 1,
                                    p: 1,
                                    bgcolor: message.uid === CHATBOT_UID ? "primary.light" : "grey.100",
                                    mr: "auto",
                                    maxWidth: { xs: "82%", md: 480 },
                                    "& p:first-of-type": { mt: 0 },
                                    "& p:last-of-type": { mb: 0 },
                                  }}
                              >
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                              </Box>
                          ) : null}

                          {message.type === MessageTypeEnum.IMAGE ? (
                              <Box mt={0.5} sx={{ overflow: "hidden", lineHeight: 0 }}>
                                <img src={message.content} alt="attach" style={{ width: "100%", maxWidth: "75vw", height: "auto" }} />
                              </Box>
                          ) : null}
                        </Box>
                      </Box>
                  ) : (
                      // Ich
                      <Box mb={2} display="flex" alignItems="flex-end" flexDirection="row-reverse">
                        <Box display="flex">
                          <Box alignItems="flex-end" display="flex" flexDirection={"column"}>
                            {message.created ? (
                                <Typography variant="body2" color="grey.600" mb={0.5} textAlign="right">
                                  <Trans i18nKey={"chat.chat_messages.you_before"} /> {formatLastActivity(message.created)}
                                </Typography>
                            ) : null}

                            {message.type === MessageTypeEnum.TEXT ? (
                                <Box
                                    sx={{
                                      borderRadius: 1,
                                      p: 1,
                                      bgcolor: "grey.200",
                                      ml: "auto",
                                      maxWidth: { xs: "82%", md: 480 },
                                      "& p:first-of-type": { mt: 0 },
                                      "& p:last-of-type": { mb: 0 },
                                    }}
                                >
                                  <ReactMarkdown>{message.content}</ReactMarkdown>
                                </Box>
                            ) : null}

                            {message.type === MessageTypeEnum.IMAGE ? (
                                <Box mt={0.5} sx={{ overflow: "hidden", lineHeight: 0, textAlign: "right" }}>
                                  <img src={message.content} alt="attach" style={{ width: "100%", maxWidth: "75vw", height: "auto" }} />
                                </Box>
                            ) : null}
                          </Box>

                          <ListItemAvatar sx={{ alignSelf: "flex-end", ml: 2, transform: { xs: "translateY(-12px)", md: "translateY(-24px)" } }}>
                            <Avatar alt={otherChatMemberName} src={userImage} sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }} />
                          </ListItemAvatar>
                        </Box>
                      </Box>
                  )}
                </Box>
            ))}
          </Box>
        </Box>
      </Box>
  );
};
