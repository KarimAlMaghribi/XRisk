import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import { Label, Title } from "@mui/icons-material";
export const Imprint = () => {
    return (<div>
        <Typography variant="h4">Impressum</Typography>
            <Typography component={Card}>
                <Typography component={CardHeader}>
            </Typography>
            <Typography component={CardContent}>
                <Typography variant="h6"> Verwaltungsrat </Typography>
                <Typography variant="body1"> Dr. Gottfried Koch (Vorsitz)</Typography>
                <Typography variant="body1"> Dr. Marco Peisker</Typography>
                <Typography variant="body1"> Raphael Koch</Typography>
            </Typography>
            </Typography>
            <br/>
            <br/>
            <Typography component={Card}>
                <Typography component={CardHeader}>
                <Title>Send us a message</Title>
            </Typography>
            <Typography component={CardContent}>
                <Typography variant="h6"> Anschrift </Typography>
                <Typography variant="body2"> Straße: Austraße. 20</Typography>
                <Typography variant="body2"> CH 9050 Bühler</Typography>
                <Typography variant="body2"> Telefon: +41 78 79 99 968</Typography>
                <Typography variant="body2"> Email: office@xrisk.info </Typography>
                <Typography variant="body2"> Webseite: www.xrisk.info</Typography>
            </Typography>
        </Typography>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
    </div>
)
}