import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {signOutUser} from "../../../firebase/firebase-service";
import West from "@mui/icons-material/West";
import Grid from "@mui/material/Grid2";
import {ROUTES} from "../../../routing/routes";
import East from "@mui/icons-material/East";
import * as React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Divider, Fade, ListItemIcon} from "@mui/material";
import {auth} from "../../../firebase_config";
import {selectImagePath, selectName} from "../../../store/slices/user-profile/selectors";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useSelector} from "react-redux";
import { ProfileDialog } from "../../profile/profile-dialog";

export interface AuthenticationButtonsProps {
    isLoggedIn: boolean;
    anchorElUser: HTMLElement | null;
    handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
    setAnchorElUser: () => void;
}

export const QuickMenuButtons = (props: AuthenticationButtonsProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const userName: string = useSelector(selectName);
    const imagePath: string | undefined = useSelector(selectImagePath);
    const [showProfileDialog, setShowProfileDialog] = React.useState<boolean>(false);

    const openProfileDialog = () => {
        setShowProfileDialog(true);
        props.setAnchorElUser();
    }

    return (
        <>
            {
                props.isLoggedIn ? (
                    <Box sx={{flexGrow: 0}}>
                        <IconButton onClick={props.handleOpenUserMenu} sx={{p: 0}}>
                            <Avatar src={imagePath} sx={{width: 42, height: 42}}/>
                        </IconButton>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={props.anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(props.anchorElUser)}
                            TransitionComponent={Fade}
                            onClose={props.setAnchorElUser}>
                            {/* TODO:: beautify profilemenu with header menu profile image, name and mail*/}

                            {[
                                <Box sx={{px: 2, py: 1}}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {userName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {auth.currentUser?.email}
                                    </Typography>
                                </Box>,
                                <Divider key="divider"/>,
                                <MenuItem
                                    onClick={openProfileDialog}>
                                    <ListItemIcon>
                                        <AccountCircleIcon />
                                    </ListItemIcon>
                                    <Typography sx={{textAlign: 'center'}}>
                                        Profil
                                    </Typography>
                                </MenuItem>
                            ]}
                        </Menu>
                        <Button
                            onClick={() => signOutUser()}
                            variant="outlined"
                            style={{color: "white", borderColor: "white", marginLeft: "20px"}}
                            startIcon={<West/>}>
                            Abmelden
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
                                    visibility: location.pathname === `/${ROUTES.SIGN_IN}` ? "hidden" : "visible"
                                }}
                                endIcon={<East/>}>
                                Anmelden
                            </Button>
                        </Grid>
                        <Grid size={6}>
                            <Button
                                onClick={() => navigate(ROUTES.SIGN_UP)}
                                variant="contained"
                                style={{
                                    minWidth: "100px",
                                    visibility: location.pathname === `/${ROUTES.SIGN_UP}` ? "hidden" : "visible"
                                }}
                                endIcon={<East/>}>
                                Registrieren
                            </Button>
                        </Grid>
                    </Grid>
                )
            }
            <ProfileDialog show={showProfileDialog} handleClose={() => setShowProfileDialog(false)}/>
        </>
    )
}
