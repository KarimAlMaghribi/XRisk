import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Box, styled, SxProps } from "@mui/material";

const SimpleBarStyle = styled(SimpleBar)(() => ({ maxHeight: "100%", width: "100%" }));

interface PropsType {
    children: React.ReactElement | React.ReactNode;
    sx: SxProps;
}

/**
 * Feature-Detection statt UA-Sniffing.
 * Touch → nativ scrollen, Desktop → SimpleBar
 * **Wichtig:** width:100% sichert volle Breite (fix für schmalen Alert/Button)
 */
const Scrollbar = (props: PropsType) => {
    const { children, sx, ...other } = props;

    const isCoarse =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches;

    if (isCoarse) {
        return (
            <Box sx={{ overflowY: "auto", WebkitOverflowScrolling: "touch", width: "100%", ...sx }}>
                {children}
            </Box>
        );
    }

    return (
        <SimpleBarStyle sx={{ width: "100%", ...sx }} {...other}>
            {children}
        </SimpleBarStyle>
    );
};

export default Scrollbar;
