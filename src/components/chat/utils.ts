import i18n from "../../utils/i18n";

/**
 * Relativzeit ohne doppelten Block; einfache i18n-Ausgabe (de/en).
 */
export function formatLastActivity(lastActivity: string): string {
    const activityDate = new Date(lastActivity);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);
    if (!isFinite(diffInSeconds)) return "";

    if (diffInSeconds < 60) return i18n.language === "de" ? "vor kurzem" : "just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
        return i18n.language === "de"
            ? `${diffInMinutes} ${diffInMinutes === 1 ? "Minute" : "Minuten"}`
            : `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
        return i18n.language === "de"
            ? `${diffInHours} ${diffInHours === 1 ? "Stunde" : "Stunden"}`
            : `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays <= 30)
        return i18n.language === "de"
            ? `${diffInDays} ${diffInDays === 1 ? "Tag" : "Tage"}`
            : `${diffInDays} ${diffInDays === 1 ? "day" : "days"}`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12)
        return i18n.language === "de"
            ? `${diffInMonths} ${diffInMonths === 1 ? "Monat" : "Monate"}`
            : `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"}`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return i18n.language === "de"
        ? `${diffInYears} ${diffInYears === 1 ? "Jahr" : "Jahre"}`
        : `${diffInYears} ${diffInYears === 1 ? "year" : "years"}`;
}
