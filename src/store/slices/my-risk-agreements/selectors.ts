import { RootState } from "../../store";

export const selectAgreementById = (state: RootState, id: string) => {
    return state.myRiskAgreements.riskAgreements.find(riskAgreement => riskAgreement.id === id) || null;
};

export const selectActiveRiskAgreement = (state: RootState) => {
    return state.myRiskAgreements.activeRiskAgreement
};

export const selectRiskAgreements = (state: RootState) => {
    return state.myRiskAgreements.riskAgreements;
};

export const selectRiskAgreementsByRiskId = (state: RootState, riskId: string) => {
    return state.myRiskAgreements.riskAgreements.filter(riskAgreement => riskAgreement.riskId === riskId);
}



export const selectRiskAgreementByChatId = (chatId: string) => (state: RootState) => 
    state.myRiskAgreements.riskAgreements.filter(riskAgreement => riskAgreement.chatId === chatId);
