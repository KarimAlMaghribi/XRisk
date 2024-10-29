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
import {useNavigate, useLocation} from "react-router-dom";
import {Page, pages, settings} from "./pages";
import {auth} from "../../firebase_config";
import {signOutUser} from "../../firebase/firebase-service";
import West from '@mui/icons-material/West';
import East from '@mui/icons-material/East';
import Grid from "@mui/material/Grid2";
import { ROUTES } from '../../routing/routes';

export function Header() {
    const location = useLocation();
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

    useEffect(() => {
        if (location.pathname === "/")
            setActivePage(pages[0].name);
        else {
            const currentPage = pages.find(page => location.pathname === `/${page.route}`);
            setActivePage(currentPage ? currentPage.name : null);
        }
    }, [location]);

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
                        onClick={() => navigate('/')}
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
                                    textDecoration: activePage === page.name ? 'underline' : 'none',
                                    textDecorationColor: 'white'
                                }}>
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {isLoggedIn ? (
                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Profilmenü">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar src="https://i.pravatar.cc/150?img=12"/>
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
                            <Button
                                onClick={() => signOutUser()}
                                variant="outlined"
                                style={{color: "white", borderColor: "white", marginLeft: "20px"}}
                                startIcon={<West />}>
                                Log Out
                            </Button>
                        </Box>
                    ) : (
                        <Grid container>
                            <Grid size={6}>
                                <Button
                                    onClick={() => navigate(ROUTES.SIGN_IN)}
                                    variant="outlined"
                                    style={{color: "white", borderColor: "white", minWidth: "100px"}}
                                    endIcon={<East />}>
                                    Log In
                                </Button>
                            </Grid>
                            <Grid size={6}>
                                <Button
                                    onClick={() => navigate(ROUTES.SIGN_UP)}
                                    variant="contained"
                                    style={{minWidth: "100px"}}
                                    endIcon={<East />}>
                                    Registrieren
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
