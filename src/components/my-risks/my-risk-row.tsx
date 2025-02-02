import {Risk} from "../../models/Risk";
import React from "react";
import {Box, Card, Chip, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {MyRiskEditDialog} from "./edit-dialog/my-risk-edit-dialog";
import Button from "@mui/material/Button";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {deleteMyRisk} from "../../store/slices/my-risks/thunks";
import {deleteRisk} from "../../store/slices/risks/thunks";
import {AppDispatch} from "../../store/store";
import {useDispatch} from "react-redux";
import {useSnackbarContext} from "../snackbar/custom-snackbar";
import {formatDate} from "../../utils/dateFormatter";
import IconButton from "@mui/material/IconButton";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DraftsIcon from '@mui/icons-material/Drafts';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import UndoIcon from "@mui/icons-material/Undo";

export interface MyRiskRowProps {
    risk: Risk;
    onEdit?: (risk: Risk) => void;
    onDelete?: (risk: Risk) => void;
}

export const MyRiskRow = (props: MyRiskRowProps) => {
    const dispatch: AppDispatch = useDispatch();
    const {showSnackbar} = useSnackbarContext();
    const [openRiskEditDialog, setOpenRiskEditDialog] = React.useState(false);

    const handleDelete = (): void => {
        if (props.risk.status === RiskStatusEnum.PUBLISHED || props.risk.status === RiskStatusEnum.AGREEMENT || RiskStatusEnum.DEAL) {
            showSnackbar("Risiko kann nicht gelöscht werden!", "Ein veröffentlichtes Risiko kann nicht gelöscht werden.", {vertical: "top", horizontal: "center"}, "error");
            return;
        }

        dispatch(deleteMyRisk(props.risk.id))
        dispatch(deleteRisk(props.risk.id))
    }

    const mapStatus = (status: RiskStatusEnum | undefined) => {
        if (!status) return ("Unbekannter Status");

        switch(status) {
            case RiskStatusEnum.DRAFT:
                return "Entwurf";
            case RiskStatusEnum.PUBLISHED:
                return "Veröffentlicht";
            case RiskStatusEnum.AGREEMENT:
                return "Geeignigt";
            case RiskStatusEnum.DEAL:
                return "In Verhandlung";
            case RiskStatusEnum.WITHDRAWN:
                return "Zurückgezogen";
        }
    }

    const mapStatusIcon = (status: RiskStatusEnum | undefined) => {
        if (!status) return <QuestionMarkIcon />;

        switch(status) {
            case RiskStatusEnum.DRAFT:
                return <DraftsIcon />;
            case RiskStatusEnum.PUBLISHED:
                return <GroupsIcon />;
            case RiskStatusEnum.AGREEMENT:
                return <HandshakeIcon />;
            case RiskStatusEnum.DEAL:
                return <SportsKabaddiIcon />;
            case RiskStatusEnum.WITHDRAWN:
                return <UndoIcon />;
        }
    }

    return (
        <>
            <Card elevation={0} sx={{
                border: "1px solid",
                borderColor: "grey.200",
                margin: "0 5% 0 0",
                padding: "30px 40px 30px 40px"
            }}>
                <Grid container>
                    <Grid size={1}>
                        {/*TODO: MAP Colors based on Status of the chip*/}
                        <Chip icon={mapStatusIcon(props.risk.status)} label={mapStatus(props.risk.status)} variant="filled" onClick={() => {}}/>
                    </Grid>
                    <Grid size={2}>
                        <Typography variant="body1" fontWeight="bolder">
                            {props.risk.name}
                        </Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography variant="body1" fontWeight="bolder">
                            {props.risk.description}
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        {
                            props.risk.type.map((element, idx) => (
                                <Chip key={idx} label={element} clickable sx={{
                                    backgroundColor: '#f3f3f3',
                                    color: '#343434',
                                    marginRight: '4px',
                                    border: '1px solid',
                                    borderColor: "#d7d7d7",
                                }}/>
                            ))
                        }
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body1">
                            {`${props.risk.value.toLocaleString()},00 €`}
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="body1">
                            {formatDate(new Date(props.risk.declinationDate))}
                        </Typography>
                    </Grid>
                    <Grid size={2}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                disabled={props.risk.status === RiskStatusEnum.PUBLISHED}
                                onClick={() => setOpenRiskEditDialog(true)}
                                size="small"
                                startIcon={<EditIcon/>}>
                                Bearbeiten
                            </Button>
                            <IconButton
                                size="small"
                                disabled={props.risk.status === RiskStatusEnum.PUBLISHED}
                                onClick={handleDelete}
                                sx={{marginLeft: "10px"}}>
                                <DeleteIcon color="warning"/>
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
            <MyRiskEditDialog
                open={openRiskEditDialog}
                setOpen={setOpenRiskEditDialog}
                risk={props.risk}
            />
        </>


    )
}
