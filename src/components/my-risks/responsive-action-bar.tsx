import * as React from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";

export type Density = "dense" | "roomy";

export type ActionItem = {
  key: string;
  label: string;
  icon: React.ReactElement;
  onClick: (ev?: React.SyntheticEvent) => void;
  priority: number;            // 0 = primary
  disabled?: boolean;
  visible?: boolean;
};

type Props = {
  actions: ActionItem[];
  density: Density;
  moreLabel?: string;
};

export default function ResponsiveActionBar({ actions, density, moreLabel = "Mehr" }: Props) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  // Sichtbarkeitslogik
  let textBtnCount = 0;
  let iconCount = 3;

  if (mdUp && !lgUp) {
    if (density === "roomy") { textBtnCount = 1; iconCount = 2; }   // TAKEN @md
    else { textBtnCount = 0; iconCount = 3; }                       // OFFERED @md
  } else if (lgUp) {
    if (density === "roomy") { textBtnCount = 2; iconCount = 2; }   // TAKEN @lg+
    else { textBtnCount = 1; iconCount = 2; }                       // OFFERED @lg+
  }
  // XS/SM: textBtnCount=0, iconCount=3

  const sorted = React.useMemo(
      () => actions.filter(a => a.visible !== false).sort((a, b) => a.priority - b.priority),
      [actions]
  );
  const asText = sorted.slice(0, textBtnCount);
  const asIcons = sorted.slice(textBtnCount, textBtnCount + iconCount);
  const overflow = sorted.slice(textBtnCount + iconCount);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  // Signatur kompatibel zu MUI Menu.onClose **und** manuellen Aufrufen
  const closeMenu = (_event?: {}, _reason?: "backdropClick" | "escapeKeyDown") => {
    setAnchorEl(null);
  };

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
      <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          rowGap={0.5}
          columnGap={1}
          alignItems="center"
      >
        {asText.map(a => (
            <Tooltip key={`txt-${a.key}`} title={a.label} disableInteractive>
          <span onMouseDown={stop}>
            <Button
                size="small"
                startIcon={a.icon}
                onClick={(e) => { stop(e); a.onClick(e); }}
                disabled={a.disabled}
                sx={{ whiteSpace: "nowrap" }}
            >
              {a.label}
            </Button>
          </span>
            </Tooltip>
        ))}

        {asIcons.map(a => (
            <Tooltip key={`ic-${a.key}`} title={a.label} disableInteractive>
          <span onMouseDown={stop}>
            <IconButton
                size="small"
                aria-label={a.label}
                onClick={(e) => { stop(e); a.onClick(e); }}
                disabled={a.disabled}
                sx={{ width: 40, height: 40 }}
            >
              {a.icon}
            </IconButton>
          </span>
            </Tooltip>
        ))}

        {overflow.length > 0 && (
            <>
              <Tooltip title={moreLabel} disableInteractive>
            <span onMouseDown={stop}>
              <IconButton
                  size="small"
                  aria-label={moreLabel}
                  onClick={openMenu}
                  sx={{ width: 40, height: 40 }}
              >
                <MoreVertIcon />
              </IconButton>
            </span>
              </Tooltip>

              <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                  keepMounted
                  PaperProps={{ sx: { minWidth: 220 } }}   // stabil für MUI v5
                  onClick={stop}
              >
                {overflow.map(a => (
                    <MenuItem
                        key={`ov-${a.key}`}
                        onClick={(e) => { stop(e); closeMenu(e); a.onClick(e); }}
                        disabled={a.disabled}
                    >
                      <ListItemIcon>{a.icon}</ListItemIcon>
                      <ListItemText>{a.label}</ListItemText>
                    </MenuItem>
                ))}
              </Menu>
            </>
        )}
      </Stack>
  );
}
