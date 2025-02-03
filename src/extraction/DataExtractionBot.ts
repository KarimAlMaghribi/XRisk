import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {Risk} from "../models/Risk";
import {ChatMessage} from "../store/slices/my-bids/types";

export class DataExtractionBot {
    public basePrompt: string;
    public messages: ChatCompletionMessageParam[];

    constructor(risk: Risk | undefined, chatMessages: ChatMessage[]) {
        this.basePrompt = "\"\"\"\n" +
            "Szenario:\n" +
            "Du bekommst einen Gesprächsausschnitt der bisherigen Verhandlung zwischen einem Risikogeber und einem Risikonehmer.\n" +
            "Der Risikogeber bietet das folgende Risiko an und möchte, dass der Risikonehmer das Risiko versichert:\\s\n"+
            `Titel des Risikos: ${risk?.name ? risk.name : "keine Information"}\n`+
            `Art des Risikos: ${risk?.type ? risk.type : "keine Information"}\n`+
            `Beschreibung: ${risk?.description ? risk.description : "keine Information"}\n`+
            `Höhe der Versicherungssumme: ${risk?.value ? risk.value : "keine Information"}\n`+
            "Deine Aufgabe:\n" +
            "Sammle alle relevanten Informationen, auf die sich beide Parteien geeinigt haben.\\s\n" +
            "Die folgenden Informationen müssen gespeichert werden:\\s\n" +
            "insuranceSum : Die Höhe der Versicherungssumme, die der Risikonehmer dem Risikogeber im Schadenfall auszahlen muss.\n"+
            "costs : Die Kosten, die der Risikogeber dem Risikonehmer zahlt, damit dieser das Risiko versichert.\n"+                   
            "timeframe : Der Zeitraum der Versicherung.\n"+
            "evidence : Die Beweise, die der Risikogeber im Schadenfall vorlegen muss.\n"+
            "details : Weitere Details, auf die sich beide Parteien geeinigt haben, die relevant zur Erstellung eines genauen Vertrags sind.\\s\n" +
            "Die extrahierten Informationen müssen präzise, formell und für einen Vertrag geeignet formuliert sein."
        this.messages = [{role: "system", content: this.basePrompt}];
        this.enrichMessagesWithRiskNegotiation(chatMessages)
    }

    public getPrompt(): string {
        return this.basePrompt;
    }

    public getMessages(): ChatCompletionMessageParam[] {
        return this.messages;
    }

    private enrichMessagesWithRiskNegotiation = (chatMessages: ChatMessage[]): void => {
        const sortedMessages = [...chatMessages].sort(
            (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
          );
        sortedMessages.forEach((chatMessage) => {
            if (chatMessage.uid === 'xRiskChatbot'){
                const content = "Absender: xRiskChatbot, Nachricht: " + chatMessage.content
                this.messages.push({ role: "assistant", content: content });
            }
            else{
                const content = "Absender: " + chatMessage.name + ", Nachricht: " + chatMessage.content
                this.messages.push({ role: "user", content: content });
            }
        });
    }

}
