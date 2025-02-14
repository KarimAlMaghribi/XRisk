import { RootState } from "../../store";

export const selectAgreementById = (state: RootState, id: string) => {
    return state.myRiskAgreements.riskAgreements.find(riskAgreement => riskAgreement.id === id) || null;
};

export const selectAgreementByChatId = (state: RootState, chatId: string | undefined) => {
    return state.myRiskAgreements.riskAgreements.find((agreement) => agreement.chatId === chatId);
};