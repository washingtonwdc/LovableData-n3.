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
            return "border-blue-200 text-blue-700";
        case "Visita":
            return "border-green-200 text-green-700";
        case "Interno":
            return "border-purple-200 text-purple-700";
        default:
            return "";
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
