import Typography from "@mui/material/Typography";
import {Drawer, InputAdornment, TextField} from "@mui/material";
import React from "react";
import {ChatsList} from "./chats-list";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {searchChats} from "../../store/slices/my-bids/reducers";
import {selectImagePath, selectMail, selectName} from "../../store/slices/user-profile/selectors";
import i18next from "i18next";

const drawerWidth = 320;

export const ChatSidebar = () => {
    const dispatch: AppDispatch = useDispatch();
    const imagePath: string | undefined = useSelector(selectImagePath);
    const username: string = useSelector(selectName);
    const userMail: string = useSelector(selectMail);

    return (
        <Drawer
            open={true}
            variant='permanent'
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {position: 'relative'},
            }}>
            <Box display={'flex'} alignItems="center" gap="10px" p={3}>
                <Avatar src={imagePath} sx={{width: 54, height: 54}}/>
                <Box>
                    <Typography variant="body1" fontWeight={600}>
                        {username}
                    </Typography>
                    <Typography variant="body2">{userMail}</Typography>
                </Box>
            </Box>

            <Box px={3} py={1}>
                <TextField
                    id="outlined-search"
                    placeholder={`${i18next.t("chat.chat_sidebar.search_chats")}`}
                    size="small"
                    type="search"
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    onChange={(e) => dispatch(searchChats(e.target.value))}
                />
            </Box>
            <ChatsList/>
        </Drawer>
    )
}
