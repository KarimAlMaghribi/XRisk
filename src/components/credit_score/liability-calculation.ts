export const computeLiabilityLimit = (
    liquidity: number | null,
    netIncome: number | null,
    existingCredits: number | null,
    monthlyFixCosts: number | null,
    otherAssets: number | null
) => {
    var ranking = 0;

    if (liquidity != null) {
        if (liquidity >= 5000 && liquidity < 25000) {
            ranking += 2;
        } else if (liquidity >= 25000 && liquidity < 100000) {
            ranking += 4;
        } else if (liquidity >= 100000 && liquidity < 500000) {
            ranking += 6;
        } else if (liquidity >= 500000) {
            ranking += 8;
        }
    }

    if (existingCredits != null) {
        if (existingCredits === 0) {
            ranking += 5;
        } else if (existingCredits < 50000) {
            ranking += 2;
        } else if (existingCredits < 200000) {
            ranking += 0;
        } else if (existingCredits >= 200000) {
            ranking += -3;
        }
    } else {
        ranking += -3;
    }

    if (otherAssets != null) {
        if (otherAssets > 0 && otherAssets < 100000) {
            ranking += 2;
        } else if (otherAssets >= 100000 && otherAssets < 500000) {
            ranking += 4;
        } else if (otherAssets >= 500000) {
            ranking += 6;
        }
    }

    if (netIncome != null && monthlyFixCosts != null) {
        if (monthlyFixCosts === 0) {
            ranking += 10;
        } else {
            const incomeFixcostsQuota = netIncome / monthlyFixCosts;

            if (incomeFixcostsQuota >= 1 && incomeFixcostsQuota < 1.5) {
                ranking += 2;
            } else if (incomeFixcostsQuota >= 1.5 && incomeFixcostsQuota < 2) {
                ranking += 4;
            } else if (incomeFixcostsQuota >= 2 && incomeFixcostsQuota < 3) {
                ranking += 6;
            } else if (incomeFixcostsQuota >= 3 && incomeFixcostsQuota < 5) {
                ranking += 8;
            } else if (incomeFixcostsQuota >= 5) {
                ranking += 10;
            }
        }
    }


    console.log(ranking);

    if (ranking <= 5) {
        return 5000;
    } else if (ranking <= 10) {
        return 10000;
    } else if (ranking <= 15) {
        return 25000;
    } else if (ranking <= 20) {
        return 50000;
    } else if (ranking <= 25) {
        return 100000;
    } else {
        return 500000;
    }
};
