import * as React from 'react';
import {useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from "../../assests/imgs/logo.png";
import {useNavigate} from "react-router-dom";
import {Page, pages, settings} from "./pages";
import {auth} from "../../firebase_config";
import {signOutUser} from "../../firebase/firebase-service";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

export function Header() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [activePage, setActivePage] = React.useState<string | null>(pages[0].name);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page: Page) => {
        setActivePage(page.name);
        setAnchorElNav(null);
        navigate(page.route);
    };

    const handleCloseUserMenu = (setting: Page) => {
        setAnchorElUser(null);
        navigate(setting.route)
    };

    return (
        <AppBar position="static" elevation={0} sx={{backgroundColor: "#1F271B"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        component="img"
                        sx={{maxWidth: '50px', display: {xs: 'none', md: 'flex'}, mr: 6, cursor: 'pointer'}}
                        src={Logo}/>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit">
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={() => setAnchorElNav(null)}
                            sx={{display: {xs: 'block', md: 'none'}}}>

                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={() => handleCloseNavMenu(page)}>
                                    <Typography sx={{textAlign: 'center'}}>{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handleCloseNavMenu(page)}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    bgcolor: activePage === page.name ? 'primary.main' : 'inherit',
                                }}>
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {isLoggedIn ? (
                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}>
                                {settings.map((setting) => (
                                    <MenuItem key={setting.name} onClick={() => handleCloseUserMenu(setting)}>
                                        <Typography sx={{textAlign: 'center'}}>{setting.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                            <IconButton
                                style={{color: "white", marginLeft: "20px"}}
                                onClick={() => signOutUser()}>
                                <LogoutIcon/>
                            </IconButton>
                        </Box>
                    ) : (
                        <IconButton
                            style={{color: "white"}}
                            onClick={() => navigate("/sign-in")}>
                            <LoginIcon/>
                        </IconButton>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
