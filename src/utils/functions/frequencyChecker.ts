const frequencyChecker = (lastDate: Date, frequency: string): boolean => {
    if (frequency === 'disabled') return false;
    
    const now = new Date();
    const lastActionDate = new Date(lastDate);
    const timeDiff = now.getTime() - lastActionDate.getTime();
    
    switch (frequency) {
        case 'daily':
            return timeDiff >= 24 * 60 * 60 * 1000;
        case 'weekly':
            return timeDiff >= 7 * 24 * 60 * 60 * 1000;
        case 'biweekly':
            return timeDiff >= 14 * 24 * 60 * 60 * 1000;
        case 'monthly':
            const nextMonth = new Date(lastActionDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return now >= nextMonth;
        default:
            return false;
    }
};

export default frequencyChecker;