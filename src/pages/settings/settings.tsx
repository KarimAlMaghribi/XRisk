import React, { useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

interface NotificationSettings {
    email: boolean;
    push: boolean;
    sms: boolean;
    productUpdates: boolean;
}

interface PreferenceSettings {
    language: string;
    theme: "light" | "dark";
    timezone: string;
}

interface SecuritySettings {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    dataSharing: boolean;
}

export const Settings = () => {
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        email: true,
        push: true,
        sms: false,
        productUpdates: true,
    });

    const [preferenceSettings, setPreferenceSettings] = useState<PreferenceSettings>({
        language: "de",
        theme: "light",
        timezone: "Europe/Berlin",
    });

    const [profileDetails, setProfileDetails] = useState({
        fullName: "Alexandra Meyer",
        email: "alexandra.meyer@example.com",
        organization: "XRisk GmbH",
    });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        twoFactorAuth: true,
        loginAlerts: true,
        dataSharing: false,
    });

    const isDarkTheme = preferenceSettings.theme === "dark";

    const activeAccent = useMemo(
        () => (isDarkTheme ? "#1f1f1f" : "#f6f6f6"),
        [isDarkTheme],
    );

    const handleNotificationChange = (key: keyof NotificationSettings) => (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNotificationSettings((prev) => ({ ...prev, [key]: event.target.checked }));
    };

    const handleSecurityChange = (key: keyof SecuritySettings) => (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSecuritySettings((prev) => ({ ...prev, [key]: event.target.checked }));
    };

    const handlePreferencesChange = <K extends keyof PreferenceSettings>(
        key: K,
        value: PreferenceSettings[K],
    ) => {
        setPreferenceSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <Box sx={{ backgroundColor: "#f1f3f5", minHeight: "100vh", py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <SettingsOutlinedIcon color="primary" />
                    <Box>
                        <Typography variant="h4" fontWeight="bold">Einstellungen</Typography>
                        <Typography color="text.secondary">
                            Passe dein Nutzerprofil und deine Sicherheitseinstellungen an die Figma-Vorlage an.
                        </Typography>
                    </Box>
                </Stack>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3, backgroundColor: "#ffffff" }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <LanguageOutlinedIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Profil &amp; Kommunikation</Typography>
                            </Stack>
                            <Typography color="text.secondary" mb={3}>
                                Grundlegende Angaben zu deinem Konto und bevorzugten Kontaktkanälen.
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Vollständiger Name"
                                        value={profileDetails.fullName}
                                        onChange={(event) => setProfileDetails({ ...profileDetails, fullName: event.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="E-Mail"
                                        type="email"
                                        value={profileDetails.email}
                                        onChange={(event) => setProfileDetails({ ...profileDetails, email: event.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Organisation"
                                        value={profileDetails.organization}
                                        onChange={(event) => setProfileDetails({ ...profileDetails, organization: event.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="language-select-label">Sprache</InputLabel>
                                        <Select
                                            labelId="language-select-label"
                                            value={preferenceSettings.language}
                                            label="Sprache"
                                            onChange={(event: SelectChangeEvent<string>) => handlePreferencesChange("language", event.target.value)}>
                                            <MenuItem value="de">Deutsch</MenuItem>
                                            <MenuItem value="en">English</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 3 }} />
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <NotificationsNoneIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Benachrichtigungen</Typography>
                            </Stack>
                            <Typography color="text.secondary" mb={2}>
                                Lege fest, wie wir dich über neue Risiken, Gebote oder Statusupdates informieren sollen.
                            </Typography>
                            <Stack spacing={1}>
                                <FormControlLabel
                                    control={<Switch checked={notificationSettings.email} onChange={handleNotificationChange("email")} />}
                                    label="E-Mail-Benachrichtigungen"
                                />
                                <FormControlLabel
                                    control={<Switch checked={notificationSettings.push} onChange={handleNotificationChange("push")} />}
                                    label="Push-Benachrichtigungen"
                                />
                                <FormControlLabel
                                    control={<Switch checked={notificationSettings.sms} onChange={handleNotificationChange("sms")} />}
                                    label="SMS-Updates"
                                />
                                <FormControlLabel
                                    control={<Switch checked={notificationSettings.productUpdates} onChange={handleNotificationChange("productUpdates")} />}
                                    label="Produkt- und Feature-Updates"
                                />
                            </Stack>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, md: 3 },
                                borderRadius: 3,
                                backgroundColor: activeAccent,
                                color: isDarkTheme ? "#f5f5f5" : "inherit",
                                border: isDarkTheme ? "1px solid #2a2f35" : undefined,
                            }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <SecurityOutlinedIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Sicherheit</Typography>
                            </Stack>
                            <Typography
                                color={isDarkTheme ? undefined : "text.secondary"}
                                sx={{ color: isDarkTheme ? "#cfd4dc" : undefined }}
                                mb={2}>
                                Halte dein Konto mit modernen Sicherheitsfeatures geschützt.
                            </Typography>
                            <Stack spacing={1}>
                                <FormControlLabel
                                    control={<Switch checked={securitySettings.twoFactorAuth} onChange={handleSecurityChange("twoFactorAuth")} />}
                                    label="Zwei-Faktor-Authentifizierung"
                                />
                                <FormControlLabel
                                    control={<Switch checked={securitySettings.loginAlerts} onChange={handleSecurityChange("loginAlerts")} />}
                                    label="Login-Warnungen per E-Mail"
                                />
                                <FormControlLabel
                                    control={<Switch checked={securitySettings.dataSharing} onChange={handleSecurityChange("dataSharing")} />}
                                    label="Anonymisierte Daten für Produktverbesserung teilen"
                                />
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3}>
                                <Button variant="contained" color="primary">Änderungen speichern</Button>
                                <Button variant="outlined" color="primary">Einstellungen zurücksetzen</Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <PaletteOutlinedIcon color="primary" />
                                <Typography variant="h6" fontWeight="bold">Darstellung</Typography>
                            </Stack>
                            <Typography color="text.secondary" mb={2}>
                                Passe das Erscheinungsbild und die Zeitzone an deine Arbeitsweise an.
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="theme-select-label">Theme</InputLabel>
                                <Select
                                    labelId="theme-select-label"
                                    value={preferenceSettings.theme}
                                    label="Theme"
                                    onChange={(event: SelectChangeEvent<string>) => handlePreferencesChange(
                                        "theme",
                                        event.target.value as PreferenceSettings["theme"],
                                    )}>
                                    <MenuItem value="light">Hell</MenuItem>
                                    <MenuItem value="dark">Dunkel</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="timezone-select-label">Zeitzone</InputLabel>
                                <Select
                                    labelId="timezone-select-label"
                                    value={preferenceSettings.timezone}
                                    label="Zeitzone"
                                    onChange={(event: SelectChangeEvent<string>) => handlePreferencesChange("timezone", event.target.value)}>
                                    <MenuItem value="Europe/Berlin">Europe/Berlin</MenuItem>
                                    <MenuItem value="Europe/Vienna">Europe/Vienna</MenuItem>
                                    <MenuItem value="America/New_York">America/New_York</MenuItem>
                                </Select>
                            </FormControl>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" color="text.secondary" mb={1}>Schnellzugriff</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip label="Profil" variant="outlined" />
                                <Chip label="Zahlungen" variant="outlined" />
                                <Chip label="Sicherheit" variant="outlined" color="primary" />
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                            <Typography variant="h6" fontWeight="bold" mb={1}>Letzte Kontoaktivität</Typography>
                            <Typography color="text.secondary" mb={2}>
                                Überblicke neue Logins und Änderungen, damit du Unstimmigkeiten direkt erkennst.
                            </Typography>
                            <Stack spacing={2}>
                                {["Neue Anmeldung aus Berlin", "Passwort vor 7 Tagen geändert", "Gerät " + "Pixel 8" + " verbunden"].map((entry) => (
                                    <Paper key={entry} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                        <Typography fontWeight="bold">{entry}</Typography>
                                        <Typography color="text.secondary" variant="body2">Vor wenigen Minuten</Typography>
                                    </Paper>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
