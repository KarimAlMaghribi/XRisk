import * as React from 'react';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logo from "../../assests/imgs/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Page, pages } from "./pages";
import { auth } from "../../firebase_config";
import { theme } from "../../theme";
import { QuickMenuButtons } from "./header-elements/quick-menu-buttons";
import { useTranslation, Trans } from "react-i18next";
import i18n from '../../utils/i18n';
import { keyframes } from '@mui/material';
import ReactCountryFlag from "react-country-flag";

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(null);
    const [activePage, setActivePage] = useState<string | null>(pages[0].name);
    const [language, setLanguage] = React.useState<"en" | "de">("de");

    const languages: Record<"en" | "de", { label: string; name: string; countryCode: string }> = {
        en: { label: "EN", name: "English", countryCode: "US" },
        de: { label: "DE", name: "Deutsch", countryCode: "DE" },
    };

    // Define animation
    const scrollLeft = keyframes`
        0% {
            transform: translateX(100vw);
        }
        100% {
            transform: translateX(-100vw);
        }`;

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

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenNavMenu = () => {
        setMobileOpen(true);
    };

    const handleCloseNavMenu = (page: Page) => {
        setActivePage(page.name);
        setMobileOpen(false);
        navigate(page.route);
    };

    const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElLanguage(event.currentTarget);
    };

    const handleLanguageClose = () => {
        setAnchorElLanguage(null);
    };

    const changeLanguage = (lng: string) => {
        setLanguage(lng as "de" | "en");
        i18n.changeLanguage(lng);
    };

    const countryFlagStyle = {
        borderRadius: '0.3125rem',
        width: '1.875rem',
        height: '1.25rem',
        marginRight: '0.5rem',
    } as const;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: "#1F271B",
                top: 0,
                pt: "env(safe-area-inset-top)",
            }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        onClick={() => navigate('/')}
                        component="img"
                        sx={{ maxWidth: '3.125rem', display: { xs: 'none', md: 'flex' }, mr: 6, cursor: 'pointer' }}
                        src={Logo} />
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            onClick={handleOpenNavMenu}
                            color="inherit">
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Drawer
                        anchor="left"
                        open={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                        ModalProps={{ keepMounted: true }}
                        sx={{ display: { xs: 'block', md: 'none' } }}>
                        <Box sx={{ width: '15rem' }} role="presentation">
                            <List>
                                {pages.map((page, index) => (
                                    page.authenticated && !isLoggedIn ? null : (
                                        <ListItem key={index + '_' + page.name} disablePadding>
                                            <ListItemButton onClick={() => handleCloseNavMenu(page)}>
                                                <ListItemText primary={<Trans i18nKey={`header.${page.name}`} />} />
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            page.authenticated && !isLoggedIn ? null :
                                <Button
                                    key={page.name}
                                    onClick={() => handleCloseNavMenu(page)}
                                    sx={{
                                        my: 2,
                                        color: activePage === page.name ? theme.palette.primary.main : 'white',
                                        display: 'block',
                                        textDecoration: 'none',
                                        textDecorationColor: 'white',
                                        fontWeight: activePage === page.name ? 'bold' : 'normal'
                                    }}>
                                    <Trans i18nKey={`header.${page.name}`} />
                                </Button>
                        ))}
                    </Box>
                    <IconButton onClick={handleLanguageClick}>
                        <ReactCountryFlag
                            countryCode={languages[language].countryCode}
                            svg
                            style={{
                                borderRadius: '0.3125rem',
                                width: '1rem',
                                height: '1rem',
                            }}
                            title={languages[language].label}
                        />
                    </IconButton>
                    <Menu
                        id="language-menu"
                        anchorEl={anchorElLanguage}
                        open={Boolean(anchorElLanguage)}
                        onClose={handleLanguageClose}>
                        {Object.entries(languages).map(([lng, details]) => (
                            <MenuItem key={lng} onClick={() => { changeLanguage(lng); handleLanguageClose(); }}>
                                <ReactCountryFlag
                                    countryCode={details.countryCode}
                                    svg
                                    style={countryFlagStyle}
                                    title={details.label}
                                />
                                {details.name}
                            </MenuItem>
                        ))}
                    </Menu>
                    <QuickMenuButtons
                        isLoggedIn={isLoggedIn}
                        anchorElUser={anchorElUser}
                        handleOpenUserMenu={handleOpenUserMenu}
                        setAnchorElUser={() => setAnchorElUser(null)}
                    />
                </Toolbar>
            </Container>
            <Box sx={{ overflow: 'hidden', width: '100%' }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: 'orange',
                        fontWeight: 'bold',
                        animation: `${scrollLeft} 20s linear infinite`,
                        '@media (prefers-reduced-motion: reduce)': {
                            animation: 'none',
                        },
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                    }}>
                    <Trans i18nKey="homepage.rubber_stamp" />
                </Typography>
            </Box>
        </AppBar>
    );
}
