// styles.ts
import { SxProps } from "@mui/material";

export const STYLES: {
    ACCORDION_SX: SxProps;
    ACCORDION_SUMMARY_SX: SxProps;
    CARD_SX: SxProps;
    STATUS_TOOLTIP_SX: SxProps;
    TYPE_CHIP_SX: SxProps;
    RISK_DESCRIPTION_TYPOGRAPHY_SX: SxProps;
    EDIT_BUTTON_SX: SxProps;
    CONTACT_BUTTON_SX: SxProps;
    CANCEL_REPORT_BUTTON_SX: SxProps;
    ICON_BUTTON_SX: SxProps;
    GRID_CHIP_SX: SxProps;
    GRID_SIZE_VALUE_SX: SxProps;
} = {
    ACCORDION_SX: {
        width: "95%",
        boxSizing: "border-box",
        border: "1px solid",
        borderColor: "grey.200",
        paddingRight: "20px",
        "&:before": { display: "none" },
    },
    ACCORDION_SUMMARY_SX: {
        minHeight: 0,
        marginRight: "5%",
        width: "100%",
        padding: 0,
        "& .MuiAccordionSummary-content": { margin: 0 },
    },
    CARD_SX: {
        marginRight: "5%",
        width: "100%",
        cursor: "pointer",
        boxSizing: "border-box",
        padding: "30px 40px",
    },
    STATUS_TOOLTIP_SX: { cursor: "pointer" },
    TYPE_CHIP_SX: {
        backgroundColor: "#f3f3f3",
        color: "#343434",
        marginRight: "4px",
        border: "1px solid",
        borderColor: "#d7d7d7",
    },
    RISK_DESCRIPTION_TYPOGRAPHY_SX: {
        marginRight: "5px",
        maxHeight: "23px",  // Höhe auf 3 Zeilen begrenzen
        overflowY: "hidden",  // Bei Bedarf scrollen
        textOverflow: "ellipsis",
    },
    // RISK_DESCRIPTION_TYPOGRAPHY_SX: {
    //     marginRight: "5px",
    //     wordWrap: "break-word",
    //     // whiteSpace: "nowrap",
    //     overflow: "hidden",
    //     textOverflow: "ellipsis",
    //     maxWidth: "100%",
    // },
    EDIT_BUTTON_SX: { marginLeft: "10px" },
    CONTACT_BUTTON_SX: { marginLeft: "10px" },
    CANCEL_REPORT_BUTTON_SX: { marginLeft: "5px" },
    ICON_BUTTON_SX: { marginLeft: "10px" },
    GRID_CHIP_SX: { display: { xs: "none", lg: "block", xl: "block" } },
    GRID_SIZE_VALUE_SX: { display: { xs: "none", lg: "none", xl: "block" } },
};
