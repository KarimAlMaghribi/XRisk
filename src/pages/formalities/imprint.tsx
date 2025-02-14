import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import { Label, Title } from "@mui/icons-material";
export const Imprint = () => {
    return (<div id="imprint">
        <br/>
        <br/>
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
                <Typography variant="body1"> Straße: Austraße. 20</Typography>
                <Typography variant="body1"> CH 9050 Bühler</Typography>
                <Typography variant="body1"> Telefon: +41 78 79 99 968</Typography>
                <Typography variant="body1">
                Email:
                <a href="mailto:office@xrisk.info" className="text-blue-500 hover:underline">
                    office@xrisk.info
                </a>
                </Typography>
                <Typography variant="body1">
                Website: 
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