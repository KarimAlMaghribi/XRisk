import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import { Label, Title } from "@mui/icons-material";

export const Contact = () => {
    return ( 
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-2xl" id="contact">
        <br />
        <br />
            <Typography variant="h4" component="h1" className="text-gray-800 mb-4">
                Kontakt
            </Typography>
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
            </div>
    )
}

