import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Button, Popper, Paper, CircularProgress, InputBase, Popover, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from "@mui/icons-material/Send";
import Picker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { MessageTypeEnum } from "../../enums/MessageTypeEnum";
import { auth } from "../../firebase_config";
import AssistantIcon from "@mui/icons-material/Assistant";
import OpenAI from "openai";
import { Chatbot } from "./chatbot";
import { Risk } from "../../models/Risk";
import { CHATBOT_UID } from "../../constants/chatbot";
import { ChatMessage } from "../../store/slices/my-bids/types";
import {
  selectActiveChatId,
  selectActiveMessages,
  selectRiskId,
} from "../../store/slices/my-bids/selectors";
import {
  sendMessage,
  updateLastMessage,
} from "../../store/slices/my-bids/thunks";
import { selectRisks } from "../../store/slices/risks/selectors";
import { ProfileInformation } from "../../store/slices/user-profile/types";
import { selectProfileInformation } from "../../store/slices/user-profile/selectors";
import { v4 as uuid } from "uuid";
import i18next from "i18next";
import { Trans } from "react-i18next";
import {useSnackbarContext} from "../snackbar/custom-snackbar";

export const ChatSender = () => {
  const dispatch: AppDispatch = useDispatch();
  const activeChatId: string | null = useSelector(selectActiveChatId);
  const activeMessages: ChatMessage[] = useSelector(selectActiveMessages);
  const riskId = useSelector(selectRiskId);
  const risks = useSelector(selectRisks);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [chosenEmoji, setChosenEmoji] = React.useState<any>();
  const [msg, setMsg] = React.useState<any>("");
  const [aiLoading, setAILoading] = React.useState<boolean>(false);
  const {showSnackbar} = useSnackbarContext();
  const [msgType, setMsgType] = React.useState<MessageTypeEnum>(
    MessageTypeEnum.TEXT
  );
  const profile: ProfileInformation | null = useSelector(
    selectProfileInformation
  );
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [open, setOpen] = useState(true); // Bubble visible by default
  const buttonRef = useRef(null);

  const handleClosePopper = () => setOpen(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onEmojiClick = (emojiObject: any) => {
    setChosenEmoji(emojiObject);
    setMsg((prevMsg: string) => prevMsg + emojiObject.emoji);
  };

  const handleChatMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const onChatMsgSubmit = (e: any) => {
    const uid = auth?.currentUser?.uid;

    if (!activeChatId) {
      console.error("No active chat found:", activeChatId);
      return;
    }

    if (!uid) {
      console.error("User not authenticated or UID missing:", auth.currentUser);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const newMessage: ChatMessage = {
      id: "1",
      created: new Date().toISOString(),
      type: msgType,
      uid: uid,
      name: profile?.name || auth?.currentUser?.displayName || "Unbekannt",
      content: msg,
      read: false,
    };

    dispatch(sendMessage({ chatId: activeChatId, message: newMessage }));
    dispatch(updateLastMessage({ chatId: activeChatId, lastMessage: msg }));
    setMsg("");
  };

  const onAIChatMsgSubmit = async (e: any) => {
    onChatMsgSubmit(e);
    setAILoading(true);
    setOpen(true)

    const risk: Risk | undefined = risks.find((risk) => risk.id === riskId);
    const lastMessage: ChatMessage = {
      id: uuid(),
      created: new Date().toISOString(),
      type: MessageTypeEnum.TEXT,
      uid: auth.currentUser?.uid || "",
      name: profile.name,
      content: msg,
      read: false,
    };

    const updatedActiveMessages = [lastMessage, ...activeMessages];
    const chatbot = new Chatbot(risk, updatedActiveMessages);

    // Wait for classification to complete
    setTimeout(async () => {
      const promptMessages = chatbot.getMessages();
      let response: any;

      try {
        response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: promptMessages,
          temperature: 0.5,
          top_p: 0.4,
          presence_penalty: 0.4,
          frequency_penalty: 0.0,
        });
      } catch (e: any) {
        showSnackbar(
            "Fehler im Chatbot!",
            "Es liegt eine Störung des LLM-Anbieters vor. Versuchen Sie es später erneut.",
            {vertical: "top", horizontal: "center"},
            "error"
        );
        if (e.status === 429) {
             console.error("OpenAI-Fehler 429: Quota überschritten", e);
         } else {
            console.error("OpenAI-Fehler:", e);
          }
        setAILoading(false);
        return;
       }

      const xRiskChatbotResponse: string = (response.choices[0]?.message?.content) || "";

      if (!xRiskChatbotResponse) {
        console.error("No response from OpenAI:", response);
        return;
      }

      const newMessage: ChatMessage = {
        id: CHATBOT_UID,
        created: new Date().toISOString(),
        type: MessageTypeEnum.TEXT,
        uid: CHATBOT_UID,
        name: "xRisk Chatbot",
        content: xRiskChatbotResponse,
        read: false,
      };

      if (!activeChatId) {
        console.error("No active chat found:", activeChatId);
        return;
      }

      dispatch(sendMessage({ chatId: activeChatId, message: newMessage }));
      dispatch(
        updateLastMessage({
          chatId: activeChatId,
          lastMessage: newMessage.content,
        })
      );
      setAILoading(false);
    }, 2000); // Small delay to allow classification to complete
  };
  return (
    <Box p={2}>
      <form
        onSubmit={onChatMsgSubmit}
        style={{ display: "flex", gap: "10px", alignItems: "center" }}
      >
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls="long-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <SentimentSatisfiedAltIcon />
        </IconButton>
        <Popover
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Picker onEmojiClick={onEmojiClick} />
          <Box p={2}>Selected: {chosenEmoji ? chosenEmoji.emoji : ""}</Box>
        </Popover>
        <InputBase
          id="msg-sent"
          fullWidth
          value={msg}
          placeholder={`${i18next.t("chat.chat_sender.placeholder")}`}
          size="small"
          type="text"
          inputProps={{ "aria-label": "Type a Message" }}
          onChange={handleChatMsgChange.bind(null)}
        />
        <IconButton onClick={onChatMsgSubmit} disabled={!msg} color="primary">
          <SendIcon />
        </IconButton>
      <IconButton
          ref={buttonRef}
          color="secondary"
          onClick={onAIChatMsgSubmit}
          disabled={!msg || aiLoading}
        >
          {aiLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <AssistantIcon />
          )}
        </IconButton>
      {open && buttonRef.current && (
      <Popper
        open={open}
        anchorEl={buttonRef.current}
        placement="top"
        style={{ zIndex: 1200 }}
      >
      
        <Paper
          elevation={3}
          sx={{
            p: 2,
            pt: 4,
            bgcolor: 'background.paper',
            position: 'relative',
            maxWidth: 250,
            borderRadius: 2,
            mt: 1,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              borderWidth: '10px 10px 0 10px',
              borderStyle: 'solid',
              borderColor: (theme) => `${theme.palette.background.paper} transparent transparent transparent`,
            },
          }}
        >
          <IconButton
            size="small"
            onClick={handleClosePopper}
            sx={{ position: 'absolute', top: 6, right: 6 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2">
          <Trans i18nKey={"chat.chat_sender.popper_text"}></Trans>
          </Typography>
        </Paper>
      </Popper>
      )}
      </form>
    </Box>
  );
};
