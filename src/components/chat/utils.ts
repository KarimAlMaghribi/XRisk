import i18n from "../../utils/i18n";

export function formatLastActivity(lastActivity: string): string {
    const activityDate = new Date(lastActivity);
    const now = new Date();
    const diffInSeconds = (now.getTime() - activityDate.getTime()) / 1000;

    if (diffInSeconds < 60) {
        if (i18n.language === "de"){
            return "vor kurzem";
        }
        else {
            return "just a moment ago";
        }
         // < 1 Minute
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        if (i18n.language === "de"){
            return `${diffInMinutes} ${diffInMinutes === 1 ? "Minute" : "Minuten"}`;
        }
        else {
            return `${diffInMinutes} ${diffInMinutes === 1 ? "Minute" : "Minutes"}`;
        }
        
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 12) {
        if (i18n.language === "de"){
            return `${diffInHours} ${diffInHours === 1 ? "Stunde" : "Stunden"}`;
        }
        else {
            return `${diffInHours} ${diffInHours === 1 ? "Hour" : "Hours"}`;
        }
        
    }

    if (diffInHours < 24) {
        if (i18n.language === "de"){
            return "halber Tag";
        }
        else {
            return "half day";
        }
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays <= 30) {
        if (i18n.language === "de"){
            return `${diffInDays} ${diffInDays === 1 ? "Tag" : "Tage"}`;
        }
        else {
            return `${diffInDays} ${diffInDays === 1 ? "Day" : "Days"}`;
        }
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInDays <= 30) {
        if (i18n.language === "de"){
            return `${diffInDays} ${diffInDays === 1 ? "Tag" : "Tage"}`;
        }
        else {
            return `${diffInDays} ${diffInDays === 1 ? "Day" : "Days"}`;
        }
    }
    
    return `${diffInMonths} ${diffInMonths === 1 ? "Monat" : "Monate"}`;
}
