/**
 * Email validation utility
 * Validates email format using a standard regex pattern
 */
export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Phone number validation utility
 * Validates Brazilian phone numbers (8-11 digits)
 */
export function isValidPhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;

    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 11;
}

/**
 * Date validation utility
 * Validates ISO date format (YYYY-MM-DD)
 */
export function isValidDate(dateStr: string): boolean {
    if (!dateStr || typeof dateStr !== 'string') return false;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) return false;

    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

/**
 * Time validation utility
 * Validates HH:MM format
 */
export function isValidTime(timeStr: string): boolean {
    if (!timeStr || typeof timeStr !== 'string') return false;

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeStr);
}

/**
 * Sanitize string input
 * Removes dangerous characters and trims whitespace
 */
export function sanitizeString(str: string): string {
    if (!str || typeof str !== 'string') return '';

    return str
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000); // Limit length
}
