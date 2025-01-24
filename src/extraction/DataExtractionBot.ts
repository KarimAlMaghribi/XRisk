import {Risk} from "../models/Risk";
import {ChatMessage} from "../store/slices/my-bids/types";

export class DataExtractionBot {
    public basePrompt: string;

    constructor(risk: Risk | undefined, messages: ChatMessage[]) {
        this.basePrompt = "\"\"\"\n" +
            "           Szenario:\n" +
            "           Du bekommst einen Gesprächsausschnitt der bisherigen Verhandlung zwischen einem Risikogeber und einem Risikonehmer.\n" +
            "           Deine Aufgabe:\n" +
            "           Sammle alle relevanten Informationen.\\s\n" +
            "           Die folgenden Informationen müssen gespeichert werden:\n" +
            "               Höhe der Versicherungssumme\n" +
            "               Kosten/ Gebühren\n" +
            "               Zeitraum der Versicherung\n" +
            "               Beweise im Schadensfall\n" +
            "               Weitere Details als Freitext\n" +
            "           \\s\n" +
            "            \"\"\n"
        this.enrichPromptWithRisk(risk);
        this.enrichPromptWithRiskNegotiation(messages);
    }

    public getPrompt(): string {
        return this.basePrompt;
    }

    private enrichPromptWithRisk = (risk: Risk | undefined): void => {
        if (!risk) {
            this.basePrompt += "Risiko: {Kein Informationen zum Risiko gefunden}; ";
            return;
        }

        this.basePrompt += "Risiko: {" +
            "Name: " + risk.name + ", " +
            "Beschreibung: " + risk.description + ", " +
            "Typ: " + risk.type + ", " +
            "Wert: " + risk.value + ", " +
            "Veröffentlichungsdatum: " + risk.publishedAt + ", " +
            "Veröffentlicher: " + risk.publisher + ", " +
            "Ablaufdatum: " + risk.declinationDate + ", " +
            "Erstellt am: " + risk.createdAt + ", " +
            "Aktualisiert am: " + risk.updatedAt + "}; "
    }

    private enrichPromptWithRiskNegotiation = (messages: ChatMessage[]): void => {
        if (!messages) {
            this.basePrompt += "Bisherige Unterhaltung: {Keine Unterhaltung gefunden}; ";
            return;
        }

        messages.forEach((message) => {
            this.basePrompt += "Bisherige Unterhaltung: {" +
                "Absender: " + message.uid + ", " +
                "Nachricht: " + message.content + ", " +
                "Erstellt am: " + message.created + "}; "
        });
    }

}
