import {Card, CardActions, CardContent, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import Button from "@mui/material/Button";
import UndoIcon from "@mui/icons-material/Undo";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import {deleteRisk} from "../../store/slices/my-risks";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {Risk} from "../../models/Risk";
import {AppDispatch} from "../../store/store";
import {useDispatch} from "react-redux";
import {MyRiskEditDialog} from "./my-risk-edit-dialog";

export interface MyRiskElementProps {
    risk: Risk;
}

export const MyRiskElement = (props: MyRiskElementProps) => {
    const dispatch: AppDispatch = useDispatch();
    const [openRiskEditDialog, setOpenRiskEditDialog] = React.useState(false);

    return (
        <Grid size={{xs: 12, sm: 6, md: 3, lg: 2, xl: 2}} margin="10px">
            <Card elevation={2}>
                <CardContent>
                    <Grid container>
                        <Grid size={7}>
                            <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14}}>
                                {props.risk.createdAt && new Date(props.risk.createdAt).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid size={5}>
                            {   // TODO: Enhance correct status check and button display
                                props.risk.status === RiskStatusEnum.PUBLISHED ? (
                                    <Button
                                        style={{borderRadius: "4px"}}
                                        variant="outlined"
                                        size="small"
                                        color="warning"
                                        startIcon={<UndoIcon/>}>
                                        Zurückziehen
                                    </Button>
                                ) : (
                                    <Button
                                        style={{borderRadius: "4px"}}
                                        variant="outlined"
                                        size="small"
                                        color="success"
                                        startIcon={<SendIcon/>}>
                                        Veröffentlichen
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>
                    <Typography variant="h5" component="div">
                        {props.risk.name}
                    </Typography>
                    <Typography sx={{color: 'text.secondary', mb: 1.5}}>
                        {props.risk.value} €
                    </Typography>
                    <Typography variant="body2">
                        {props.risk.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        onClick={() => setOpenRiskEditDialog(true)}
                        size="small"
                        startIcon={<EditIcon/>}>
                        Bearbeiten
                    </Button>
                    <Button
                        onClick={() => dispatch(deleteRisk(props.risk.id))}
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon/>}>
                        Löschen
                    </Button>
                </CardActions>
            </Card>
            <MyRiskEditDialog
                open={openRiskEditDialog}
                setOpen={setOpenRiskEditDialog}
                risk={props.risk}
            />
        </Grid>
    )
}
