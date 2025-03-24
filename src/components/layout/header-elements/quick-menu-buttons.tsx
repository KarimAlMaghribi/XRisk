import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { signOutUser } from "../../../firebase/firebase-service";
import West from "@mui/icons-material/West";
import Grid from "@mui/material/Grid2";
import { ROUTES } from "../../../routing/routes";
import East from "@mui/icons-material/East";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Divider, Fade, ListItemIcon } from "@mui/material";
import { auth } from "../../../firebase_config";
import {
  selectImagePath,
  selectName,
} from "../../../store/slices/user-profile/selectors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import { useSelector } from "react-redux";
import { ProfileDialog } from "../../profile/profile-dialog";
import { Trans } from "react-i18next";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase_config";
import { NotificationStatusEnum } from "../../../enums/Notifications.enum";
import { useState } from "react";
import { Notification } from "../../../models/Notification";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { selectActiveChatId } from "../../../store/slices/my-bids/selectors";
import { setActiveChat } from "../../../store/slices/my-bids/reducers";
import { CreditScoreDialog } from "../../credit_score/credit_score_dialog";

export interface AuthenticationButtonsProps {
  isLoggedIn: boolean;
  anchorElUser: HTMLElement | null;
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  setAnchorElUser: () => void;
}

export const QuickMenuButtons = (props: AuthenticationButtonsProps) => {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userName: string = useSelector(selectName);
  const imagePath: string | undefined = useSelector(selectImagePath);
  const [showProfileDialog, setShowProfileDialog] =
    React.useState<boolean>(false);
  const [showCreditScoreDialog, setShowCreditScoreDialog] =
    React.useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // const [notifications, setNotifications] = useState([]); // Store notifications
  const activeChatId: string | null = useSelector(selectActiveChatId);

  const handleSelectChat = (chatId: string) => {
    if (chatId === activeChatId) {
      return;
    }

    dispatch(setActiveChat(chatId));
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openNotification = Boolean(anchorEl);

  const userId = auth.currentUser?.uid; // Get the logged-in user's ID

  useEffect(() => {
    if (!userId) return;

    // Reference to the notifications subcollection
    const notificationsRef = collection(
      db,
      `notifications/${userId}/notifications`
    );

    // Create a query to order by time (assuming 'timestamp' field exists)
    const orderedQuery = query(notificationsRef, orderBy("createdAt", "desc")); // "desc" for newest first

    // Real-time listener with ordering
    const unsubscribe = onSnapshot(orderedQuery, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      setNotifications(newNotifications);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [userId]);

  const openProfileDialog = () => {
    setShowProfileDialog(true);
    props.setAnchorElUser();
  };

  const openCreditScoreDialog = () => {
    setShowCreditScoreDialog(true);
    props.setAnchorElUser();
  };

  const openNotificationDialog = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeNotificationDialog = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notificationId: string) => {
    const notificationsRef = doc(
      db,
      `notifications/${userId}/notifications/${notificationId}`
    );
    await updateDoc(notificationsRef, { status: NotificationStatusEnum.READ });

    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId
          ? { ...notif, status: NotificationStatusEnum.READ }
          : notif
      )
    );
  };

  return (
    <>
      {props.isLoggedIn ? (
        <Box sx={{ flexGrow: 0 }}>
          <IconButton
            color="primary"
            onClick={openNotificationDialog}
            sx={{ p: 0, width: 50, height: 50 }}
          >
            <Badge
              badgeContent={
                notifications.filter(
                  (n) => n.status === NotificationStatusEnum.UNREAD
                ).length
              }
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {/* Notification Menu */}
          {/* Notification Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openNotification}
            onClose={closeNotificationDialog}
            PaperProps={{
              style: {
                maxHeight: 500,
                width: "450px",
                padding: "8px",
                overflowX: "auto",
              },
            }}
          >
            {/* Header */}
            <MenuItem
              disabled
              sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
            >
              <Typography variant="subtitle1" sx={{ color: "black" }}>
                Benachrichtigungen
              </Typography>
            </MenuItem>

            {/* No Notifications Case */}
            {notifications.length === 0 ? (
              <MenuItem
                onClick={closeNotificationDialog}
                sx={{ textAlign: "center" }}
              >
                <Typography variant="body2" color="textSecondary">
                  Neue Benachrichtigungen
                </Typography>
              </MenuItem>
            ) : (
              notifications.map((notif) => (
                <MenuItem
                  key={notif.id}
                  onClick={() => {
                    navigate(ROUTES.CHAT);
                    markAsRead(notif.id);
                    closeNotificationDialog();
                    handleSelectChat(notif.chatroomId);
                  }}
                  sx={{
                    backgroundColor:
                      notif.status === NotificationStatusEnum.UNREAD
                        ? "#f9f9f9"
                        : "white",
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "12px 16px",
                    gap: 0.5,
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  {/* Notification Message */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight:
                        notif.status === NotificationStatusEnum.UNREAD
                          ? "bold"
                          : "normal",
                    }}
                    whiteSpace={"normal"}
                  >
                    {notif.message}
                  </Typography>

                  {/* Timestamp */}
                  <Typography
                    variant="caption"
                    sx={{ color: "gray", alignSelf: "flex-end" }}
                  >
                    {notif.createdAt instanceof Timestamp
                      ? formatDistanceToNow(notif.createdAt.toDate(), {
                          addSuffix: true,
                        })
                      : typeof notif.createdAt === "string"
                      ? formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true,
                        })
                      : "Time unknown"}
                  </Typography>
                </MenuItem>
              ))
            )}
          </Menu>
          <IconButton onClick={props.handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar src={imagePath} sx={{ width: 42, height: 42 }} />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={props.anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(props.anchorElUser)}
            TransitionComponent={Fade}
            onClose={props.setAnchorElUser}
          >
            {[
              <Box sx={{ px: 2, py: 1 }} key="first_box">
                <Typography variant="body1" fontWeight="bold">
                  {userName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {auth.currentUser?.email}
                </Typography>
              </Box>,
              <Divider key="divider" />,
              <MenuItem key="second-box" onClick={openProfileDialog}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <Typography sx={{ textAlign: "center" }}>
                  <Trans i18nKey="header.profile"></Trans>
                </Typography>
              </MenuItem>,
              <MenuItem key="second-box" onClick={openCreditScoreDialog}>
                <ListItemIcon>
                  <AssuredWorkloadIcon />
                </ListItemIcon>
                <Typography sx={{ textAlign: "center" }}>
                  <Trans i18nKey="header.credit_score"></Trans>
                </Typography>
              </MenuItem>,
            ]}
          </Menu>
          <Button
            onClick={() => signOutUser()}
            variant="outlined"
            style={{ color: "white", borderColor: "white", marginLeft: "20px" }}
            startIcon={<West />}
          >
            <Trans i18nKey="header.sign_out"></Trans>
          </Button>
        </Box>
      ) : (
        <Grid container>
          <Grid size={6}>
            <Button
              onClick={() => navigate(ROUTES.SIGN_IN)}
              variant="outlined"
              style={{
                color: "white",
                borderColor: "white",
                minWidth: "100px",
                visibility:
                  location.pathname === `/${ROUTES.SIGN_IN}`
                    ? "hidden"
                    : "visible",
              }}
              endIcon={<East />}
            >
              <Trans i18nKey="header.sign_in"></Trans>
            </Button>
          </Grid>
          <Grid size={6}>
            <Button
              onClick={() => navigate(ROUTES.SIGN_UP)}
              variant="contained"
              style={{
                minWidth: "100px",
                visibility:
                  location.pathname === `/${ROUTES.SIGN_UP}`
                    ? "hidden"
                    : "visible",
              }}
              endIcon={<East />}
            >
              <Trans i18nKey="header.register"></Trans>
            </Button>
          </Grid>
        </Grid>
      )}
      <ProfileDialog
        show={showProfileDialog}
        handleClose={() => setShowProfileDialog(false)}
      />
      <CreditScoreDialog
        show={showCreditScoreDialog}
        handleClose={() => setShowCreditScoreDialog(false)}
      />
    </>
  );
};
