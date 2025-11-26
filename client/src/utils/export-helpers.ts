/**
 * Export utilities for CSV and JSON
 * Provides consistent formatting across the application
 */

export interface ExportOptions {
    filename?: string;
    dateFormat?: 'iso' | 'br';
}

/**
 * Download JSON data as file
 */
export function downloadJSON<T>(data: T, options: ExportOptions = {}): void {
    const { filename = `export-${new Date().toISOString().slice(0, 10)}.json` } = options;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Download CSV data as file
 */
export function downloadCSV(
    headers: string[],
    rows: (string | number | boolean | null | undefined)[][],
    options: ExportOptions = {}
): void {
    const { filename = `export-${new Date().toISOString().slice(0, 10)}.csv` } = options;

    // Escape CSV values
    const escapeCsvValue = (value: string | number | boolean | null | undefined): string => {
        const str = String(value ?? "");
        // Double quotes need to be escaped
        return `"${str.replace(/"/g, '""')}"`;
    };

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(escapeCsvValue).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        return false;
    }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
