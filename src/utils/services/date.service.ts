const BRASILIA_OFFSET = 0 * 60;

const dateService = {
    now: (): Date => {
        const utcDate = new Date();
        const utcTime = utcDate.getTime();
        const utcOffset = utcDate.getTimezoneOffset();
        const brasiliaTime = utcTime + (utcOffset + BRASILIA_OFFSET) * 60000;
        return new Date(brasiliaTime);
    },

    timestamp: (): number => {
        return dateService.now().getTime();
    },

    create: (year?: number, month?: number, day?: number, hours?: number, minutes?: number, seconds?: number): Date => {
        if (year === undefined) {
            return dateService.now();
        }
        const date = new Date(year, month || 0, day || 1, hours || 0, minutes || 0, seconds || 0);
        const utcTime = date.getTime();
        const utcOffset = date.getTimezoneOffset();
        const brasiliaTime = utcTime + (utcOffset + BRASILIA_OFFSET) * 60000;
        return new Date(brasiliaTime);
    },

    fromTimestamp: (timestamp: number): Date => {
        return new Date(timestamp);
    },

    addDays: (date: Date, days: number): Date => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    addMonths: (date: Date, months: number): Date => {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    },

    addMinutes: (date: Date, minutes: number): Date => {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    },

    addHours: (date: Date, hours: number): Date => {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    },

    formatDate: (date: Date, locale: string = 'pt-BR'): string => {
        return date.toLocaleDateString(locale);
    },

    formatTime: (date: Date, locale: string = 'pt-BR'): string => {
        return date.toLocaleTimeString(locale);
    },

    formatDateTime: (date: Date, locale: string = 'pt-BR'): string => {
        return `${dateService.formatDate(date, locale)} ${dateService.formatTime(date, locale)}`;
    },

    startOfDay: (date: Date): Date => {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    },

    endOfDay: (date: Date): Date => {
        const result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    },

    isBefore: (date1: Date, date2: Date): boolean => {
        return date1.getTime() < date2.getTime();
    },

    isAfter: (date1: Date, date2: Date): boolean => {
        return date1.getTime() > date2.getTime();
    },

    differenceInDays: (date1: Date, date2: Date): number => {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};

export default dateService;