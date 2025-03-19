import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import { Label, Title } from "@mui/icons-material";
import { Trans } from "react-i18next";
export const Imprint = () => {
    return (<div id="imprint">
        <br/>
        <br/>
        <Typography variant="h4"><Trans i18nKey={"footer.imprint"}/></Typography>
            <Typography component={Card}>
                <Typography component={CardHeader}>
                </Typography>
            <Typography component={CardContent}>
                <Typography variant="h6"> <Trans i18nKey={"footer.imprint_elements.board_of_directors"}/> </Typography>
                <Typography variant="body1"> Dr. Gottfried Koch (<Trans i18nKey={"footer.imprint_elements.chairman"}/>)</Typography>
                <Typography variant="body1"> Dr. Marco Peisker</Typography>
                <Typography variant="body1"> Raphael Koch</Typography>
            </Typography>
            </Typography>
            <br/>
            <br/>

            <Typography component={Card}>
                <Typography component={CardHeader}>
                <Title> <Trans i18nKey={"footer.contact_elements.send_message"}/> </Title>
                </Typography>
                <Typography component={CardContent}>
                <Typography variant="h6"> <Trans i18nKey={"footer.contact_elements.adress"}/> </Typography>
                <Typography variant="body1"> <Trans i18nKey={"footer.contact_elements.street"}/>: Austraße. 20</Typography>
                <Typography variant="body1"> CH 9050 Bühler</Typography>
                <Typography variant="body1"> <Trans i18nKey={"footer.contact_elements.telephone"}/>: +41 78 79 99 968</Typography>
                <Typography variant="body1">
                <Trans i18nKey={"footer.contact_elements.email"}/>:
                <a href="mailto:office@xrisk.info" className="text-blue-500 hover:underline">
                    office@xrisk.info
                </a>
                </Typography>
                <Typography variant="body1">
                <Trans i18nKey={"footer.contact_elements.website"}/>: 
                <a href="https://xrisk.info" className="text-blue-500 hover:underline">
                www.xrisk.info
                </a>
                </Typography>
            </Typography>
            </Typography>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
    </div>
)
}