import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Container,
    Typography
} from "@mui/material";
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
            answer: "Sie können Hilfe erhalten, indem Sie unser Support-Team unter koch@informatik.uni-leipzig.de kontaktieren. Unser Team steht Ihnen für alle Fragen zur Verfügung und hilft Ihnen gerne weiter."
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
        <Container sx={{ py: { xs: 4, md: 10 } }}>
            <Typography
                variant="h3"
                sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                <Trans i18nKey="faq.title" />
            </Typography>

            {faqs.map((faq, index) => (
                <Accordion
                    key={index}
                    sx={{ mt: 2 }}
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                    elevation={0}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}bh-content`}
                        id={`panel${index}bh-header`}>
                        <Typography
                            variant="h6"
                            sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0, color: 'text.secondary' }}>
                            <Trans i18nKey={`faq.question${index + 1}`} />
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <Trans i18nKey={`faq.answer${index + 1}`} />
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}
