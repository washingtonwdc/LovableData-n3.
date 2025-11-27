import { AgendaItem } from "@/hooks/use-agenda";

export function parseDateTime(dateStr: string, timeStr?: string) {
    if (!dateStr) return null;
    const t = timeStr || "00:00";
    return new Date(`${dateStr}T${t}:00`);
}

export function addMinutes(date: Date, minutes: number) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + minutes);
    return d;
}

export function endDateTime(item: AgendaItem) {
    const start = parseDateTime(item.data, item.hora);
    if (!start) return null;
    const dur = item.duracao ?? 60;
    return addMinutes(start, dur);
}

export function formatEndTime(item: AgendaItem) {
    const end = endDateTime(item);
    if (!end) return "";
    const hh = String(end.getHours()).padStart(2, "0");
    const mm = String(end.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
}

export function categoriaBadgeClass(cat?: string) {
    switch (cat) {
        case "Reunião":
            return "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
        case "Visita":
            return "bg-green-100 border-green-300 text-green-800 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
        case "Interno":
            return "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
        case "Urgente":
            return "bg-red-100 border-red-300 text-red-800 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
        case "Pessoal":
            return "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
        default:
            return "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
}

export function computeConflicts(items: AgendaItem[]) {
    const result = new Map<string, boolean>();
    const intervals = items
        .map((i) => {
            const s = parseDateTime(i.data, i.hora);
            const e = i.hora ? endDateTime(i) : null;
            return { id: i.id, s, e };
        })
        .filter((x) => x.s && x.e) as { id: string; s: Date; e: Date }[];
    for (let i = 0; i < intervals.length; i++) {
        for (let j = i + 1; j < intervals.length; j++) {
            const a = intervals[i];
            const b = intervals[j];
            if (a.s < b.e && b.s < a.e) {
                result.set(a.id, true);
                result.set(b.id, true);
            }
        }
    }
    return result;
}

export function formatFriendlyDate(dateStr: string) {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Format date with short weekday
 */
export function formatShortDate(dateStr: string) {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Check if date is today
 */
export function isToday(dateStr: string): boolean {
    const today = new Date();
    const date = new Date(`${dateStr}T00:00:00`);
    return today.toDateString() === date.toDateString();
}

/**
 * Check if date is in the past
 */
export function isPast(dateStr: string): boolean {
    const today = new Date();
    const date = new Date(`${dateStr}T00:00:00`);
    today.setHours(0, 0, 0, 0);
    return date < today;
}

/**
 * Get relative date description (Hoje, Amanhã, etc.)
 */
export function getRelativeDate(dateStr: string): string {
    const today = new Date();
    const date = new Date(`${dateStr}T00:00:00`);
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    if (diffDays === -1) return "Ontem";
    if (diffDays > 0 && diffDays <= 7) return `Em ${diffDays} dias`;
    if (diffDays < 0 && diffDays >= -7) return `Há ${Math.abs(diffDays)} dias`;

    return formatFriendlyDate(dateStr);
}
