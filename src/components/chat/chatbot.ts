import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {Risk} from "../../models/Risk";
import {ChatMessage} from "../../store/slices/my-bids/types";
import {OpenAI} from "openai";
import {z} from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { 
    basePromptFiltered,
    basePromptForClassification, 
    mediationPrompt, 
    informationPrompt, 
    controllPrompt, 
    miscPrompt 
} from "../../constants/prompts";

export class Chatbot {
    public chosenPrompt: string = "";
    public messages: ChatCompletionMessageParam[];
    openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
    classificationResult: string = "";

    constructor(risk: Risk | undefined, chatMessages: ChatMessage[]) {
        this.messages = [];
        this.classificationResult = "";

        this.performClassification(chatMessages).then(category => {
            this.chosenPrompt = this.assignPrompt(category);
            this.chosenPrompt = basePromptFiltered + this.chosenPrompt;
            this.messages.push({ role: "system", content: this.chosenPrompt });
            
            this.enrichMessagesWithRiskInformation(risk);
            this.enrichMessagesWithRiskNegotiation(chatMessages);
        });
    }

    /**
     * Performs classification with the help of the classification prompt on the entire 
     * conversation context and classifies the text to one of the four categories 
     * ('Vermittlung', 'Information', 'Prüfung', 'Diverses').
     * @param chatMessages 
     * @returns Promise<string>
     */
    private async performClassification(chatMessages: ChatMessage[] = []): Promise<string> {
        const classificationMessages: ChatCompletionMessageParam[] = [
            { role: "system", content: basePromptForClassification },
            ...chatMessages.map((msg: ChatMessage) => ({
                role: msg.uid === "XRiskChatbot" ? "assistant" : "user",
                content: msg.content
            }) as ChatCompletionMessageParam) // Explicitly typecast to avoid type mismatch
        ];
    
        const DataSchema = z.object({
            category : z.enum([
                'Vermittlung', 
                'Information', 
                'Prüfung',
                'Diverses'
            ]),
        })
        try {
            const response = await this.openai.beta.chat.completions.parse({
                model: "gpt-4o-mini",
                messages: classificationMessages,
                response_format: zodResponseFormat(DataSchema, "conversationData"),
                max_tokens: 200,
                temperature: 0.5,
                top_p: 0.4,
                presence_penalty: 0.4,
                frequency_penalty: 0.0
            });
    
            const category = response.choices[0]?.message?.content?.trim() || "Diverses";
            return this.getClassificationResult(category);
        } catch (error) {
            console.error("Error in classification:", error);
            return "Diverses"; // Default category
        }
    }
 
    public getPrompt(): string {
        return this.chosenPrompt;
    }

    public getClassificationResult(result: string): string {
        if ([
            'Vermittlung', 
            'Information', 
            'Prüfung',
            'Diverses'
        ].includes(result)){
            return result;
        }
        else{
            return 'Diverses';
        }

    }

    public assignPrompt(category: string){
        if (category==='Vermittlung'){
            return mediationPrompt;
        }
        else if (category==='Information'){
            return informationPrompt;
        }
        else if (category==='Prüfung'){
            return controllPrompt;
        }
        else if (category==='Diverses'){
            return miscPrompt;
        }
        else 
            return miscPrompt;
    }

    public getMessages(): ChatCompletionMessageParam[] {
            return this.messages;
        }

    private enrichMessagesWithRiskInformation = (risk: Risk | undefined): void => {
        if (!risk) {
            const content = "Es wird über das folgende Risikoinserat verhandelt: {Keine Informationen zum Risiko gefunden}";
            this.messages.push({ role: "system", content: content });
            return;
        }
        else {
            const content = "Es wird über das folgende Risikoinserat verhandelt: {" +
                "Name: " + risk.name + ", " +
                "Beschreibung: " + risk.description + ", " +
                "Typ: " + risk.type + ", " +
                "Versicherungssumme: " + risk.value + ", " +
                "Veröffentlicher: " + risk.publisher?.name + "}; "
            this.messages.push({ role: "system", content: content });
        }
    }
    
    private enrichMessagesWithRiskNegotiation = (chatMessages: ChatMessage[]): void => {
        // sort by time of creation in ascending order
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
 
