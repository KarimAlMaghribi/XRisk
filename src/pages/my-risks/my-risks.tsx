import React from "react";
import Grid from "@mui/material/Grid2";
import {Card, CardActions, CardContent, Typography} from "@mui/material";
import {Risk} from "../../models/Risk";
import {useDispatch, useSelector} from "react-redux";
import {deleteRisk, selectMyRisks} from "../../store/slices/my-risks";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {RiskCreationDialog} from "../../components/risk/risk-creation-dialog";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import UndoIcon from '@mui/icons-material/Undo';
import {RiskStatusEnum} from "../../enums/RiskStatus.enum";
import {AppDispatch} from "../../store/store";

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
        •
    </Box>
);

export const MyRisks = () => {
    const dispatch: AppDispatch = useDispatch();
    const myRisks: Risk[] = useSelector(selectMyRisks);
    const [openRiskCreationDialog, setOpenRiskCreationDialog] = React.useState(false);

    const handleCloseDialog = () => {
        setOpenRiskCreationDialog(false);
    }

    return (
        <React.Fragment>
            <Grid container>
                <Grid size={2} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: "10px"}}>
                    <Button
                        onClick={() => setOpenRiskCreationDialog(true)}
                        style={{borderRadius: "4px"}}
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}>
                        Risiko erstellen
                    </Button>
                </Grid>
                <Grid size={10}>
                    <Typography>Filtern und Sortieren</Typography>
                </Grid>
                {
                    myRisks && myRisks.map((risk: Risk) => (
                        <Grid size={{xs: 12, sm: 6, md: 3, lg: 2, xl: 2}} spacing={4} margin="10px">
                            <Card elevation={2}>
                                <CardContent>
                                    <Grid container>
                                        <Grid size={7}>
                                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                {risk.createdAt}
                                            </Typography>
                                        </Grid>
                                        <Grid size={5}>
                                            {   // TODO: Enhance correct status check and button display
                                                risk.status === RiskStatusEnum.PUBLISHED ? (
                                                    <Button
                                                        style={{borderRadius: "4px"}}
                                                        variant="outlined"
                                                        size="small"
                                                        color="warning"
                                                        startIcon={<UndoIcon />}>
                                                        Zurückziehen
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        style={{borderRadius: "4px"}}
                                                        variant="outlined"
                                                        size="small"
                                                        color="success"
                                                        startIcon={<SendIcon />}>
                                                        Veröffentlichen
                                                    </Button>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h5" component="div">
                                        {risk.name}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                        {risk.value} €
                                    </Typography>
                                    <Typography variant="body2">
                                        {risk.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        startIcon={<EditIcon />}>
                                        Bearbeiten
                                    </Button>
                                    <Button
                                        onClick={() => dispatch(deleteRisk(risk.id))}
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}>
                                        Löschen
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
            <RiskCreationDialog
                open={openRiskCreationDialog}
                handleClose={handleCloseDialog}
            />
        </React.Fragment>


    );
}
