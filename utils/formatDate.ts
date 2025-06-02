export function formatDate(currentDate: Date): string {
    const now = new Date();
    const date = new Date(currentDate);
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const oneYearInMs = 365 * oneDayInMs;

    const diffInMs = now.getTime() - date.getTime();
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

    if (diffInMs < oneDayInMs && now.getDate() === date.getDate()) {
        return date.toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (diffInMs < oneYearInMs) {
        return date.toLocaleDateString('es-ES', options);
    } else {
        return date.toLocaleDateString('es-ES', { ...options, year: 'numeric' });
    }
}