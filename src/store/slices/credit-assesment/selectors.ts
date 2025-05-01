import {RootState} from "../../store";

export const selectAssessmentById = (state: RootState, uid: string) => {
    return state.assesments.list.find(assesment => assesment.id === uid) || null;
};

export const selectAssesments = (uid: string | undefined) => (state: RootState) => {
    return state.assesments.list.filter(notification =>
        notification.id === uid
    );
};

export const selectLatestAcquisitionLimit = (state: RootState): number => {
    const list = state.assesments.list;
    if (!list || list.length === 0) return 0;

    const latest = list.reduce((prev, curr) => {
        const prevTime = (() => {
            if (prev.updatedAt) return new Date(prev.updatedAt).getTime();
            if (prev.createdAt) return new Date(prev.createdAt).getTime();
            return Number.NEGATIVE_INFINITY;
        })();
        const currTime = (() => {
            if (curr.updatedAt) return new Date(curr.updatedAt).getTime();
            if (curr.createdAt) return new Date(curr.createdAt).getTime();
            return Number.NEGATIVE_INFINITY;
        })();

        return currTime > prevTime ? curr : prev;
    });

    // Wenn das gefundene Element gar keine Datumsfelder hat,
    // gib den niedrigsten acquisitionLimit aller Einträge zurück.
    if (!latest.updatedAt && !latest.createdAt) {
        return Math.min(...list.map(a => a.acquisitionLimit));
    }

    return latest.acquisitionLimit;
};

