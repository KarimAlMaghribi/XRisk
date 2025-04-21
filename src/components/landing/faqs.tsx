import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Trans } from "react-i18next";

export const FAQs = () => {
    const faqs: { question: string, answer: string }[] = [
        {
            question: "Was ist der Zweck dieser Plattform?",
            answer: "xRisk ist ein Demonstrationsprojekt, das die Idee eines digitalen Marktplatzes für die Verteilung und Übernahme von Risiken erfahrbar machen soll. Nutzer können hier in einer simulierten Umgebung Risikoangebote einstellen, übernehmen oder gemeinsam verhandeln – ohne rechtliche oder finanzielle Bindung. Die Plattform dient ausschließlich zu Test- und Präsentationszwecken."
        },
        {
            question: "Wie kann ich diese Plattform nutzen?",
            answer: "Um diese Plattform zu nutzen, müssen Sie sich zunächst registrieren und einloggen. Nach der Registrierung können Sie Ihr Risikoprofil anlegen und die verschiedenen Funktionen zur Risikoverwaltung nutzen."
        },
        {
            question: "Wie kann ich Hilfe erhalten?",
            answer: "Bei Fragen oder Problemen rund um die Plattform stehen wir dir gerne zur Verfügung. Schick uns einfach eine E-Mail an office@xrisk.info – wir melden uns so schnell wie möglich zurück."
        },
        {
            question: "Wie kann ich einen Fehler melden?",
            answer: "Fehler gefunden? Super! Wir freuen uns über jeden Hinweis, der hilft, die Plattform besser zu machen. Bitte sende eine kurze Beschreibung des Fehlers an office@xrisk.info – idealerweise mit Screenshot und Angabe, wo der Fehler aufgetreten ist."
        },
        {
            question: "Welche Arten von Risiken kann ich auf dieser Plattform managen?",
            answer: "Grundsätzlich können alle legalen und simulierten Risiken auf der Plattform dargestellt werden – von kleineren Alltagsrisiken bis zu komplexeren Szenarien. Bitte beachte: Die Plattform ist ein Prototyp und dient ausschließlich der Veranschaulichung. Illegale, anstößige oder gefährliche Inhalte werden nicht toleriert."
        }
    ]

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <div style={{margin: "50px"}}>
            <Typography variant="h3" style={{textAlign: "center", marginBottom: "50px"}}>
                <Trans i18nKey="faq.title"></Trans>
            </Typography>

            {
                faqs.map((faq, index) => (
                    <Accordion
                        key={index}
                        style={{marginTop: "20px"}}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                        elevation={0}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header">
                            <Typography variant="h6" sx={{width: '33%', flexShrink: 0, color: 'text.secondary'}}>
                                <Trans  i18nKey={`faq.question${index+1}`}></Trans>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <Trans  i18nKey={`faq.answer${index+1}`}></Trans>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </div>
    );
}
