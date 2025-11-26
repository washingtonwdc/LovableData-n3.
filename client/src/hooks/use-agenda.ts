import { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

export type AgendaItem = {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  hora?: string; // HH:mm
  notas?: string;
  criadoEm: string;
  concluido?: boolean;
  duracao?: number; // minutes
  categoria?: string; // e.g. "Reunião", "Visita", "Interno", "Outro"
};

const STORAGE_KEY = "agenda-events";

export function useAgenda() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [search, setSearch] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("__all__");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");
  const [showWeekFromSelected, setShowWeekFromSelected] = useState<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aKey = `${a.data} ${a.hora || "00:00"}`;
      const bKey = `${b.data} ${b.hora || "00:00"}`;
      return aKey.localeCompare(bKey);
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    let base = hideCompleted ? sortedItems.filter((i) => !i.concluido) : sortedItems;
    if (categoriaFiltro && categoriaFiltro !== "__all__") {
      base = base.filter((i) => (i.categoria || "") === categoriaFiltro);
    }
    let byFilter: AgendaItem[] = [];
    if (selectedDateFilter) {
      const d = new Date(`${selectedDateFilter}T00:00:00`);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      if (showWeekFromSelected) {
        end.setDate(end.getDate() + 7);
      }
      byFilter = base.filter((i) => {
        const dt = new Date(`${i.data}T${i.hora || "00:00"}:00`);
        return dt >= start && dt <= end;
      });
    } else {
      byFilter = base.filter((i) => {
        const dt = new Date(`${i.data}T${i.hora || "00:00"}:00`);
        switch (filter) {
          case "today":
            return dt >= startOfToday && dt <= endOfToday;
          case "week":
            return dt >= startOfToday && dt <= endOfWeek;
          case "month":
            return dt >= startOfMonth && dt <= endOfMonth;
          default:
            return true;
        }
      });
    }

    const q = search.trim().toLowerCase();
    if (!q) return byFilter;
    return byFilter.filter((i) =>
      i.titulo.toLowerCase().includes(q) || (i.notas || "").toLowerCase().includes(q)
    );
  }, [sortedItems, filter, search, hideCompleted, categoriaFiltro, selectedDateFilter, showWeekFromSelected]);

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, AgendaItem[]>();
    for (const item of filteredItems) {
      const arr = groups.get(item.data) || [];
      arr.push(item);
      groups.set(item.data, arr);
    }
    const entries = Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return entries.map(([date, items]) => ({
      date,
      items: items.sort((a, b) => (a.hora || "00:00").localeCompare(b.hora || "00:00")),
    }));
  }, [filteredItems]);

  const addItem = (item: AgendaItem) => {
    setItems((prev) => [...prev, item]);
    toast({ title: "Compromisso adicionado", description: `${item.titulo} em ${item.data}${item.hora ? ` às ${item.hora}` : ""}` });
  };

  const updateItem = (updated: AgendaItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    toast({ title: "Compromisso atualizado", description: updated.titulo });
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({
      title: "Compromisso removido",
      description: item.titulo,
      // Note: Undo action logic would need to be handled in the component or passed back
    });
    return item; // Return for potential undo handling
  };

  const toggleCompleted = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, concluido: !i.concluido } : i)));
  };

  const importItems = (newItems: AgendaItem[]) => {
    const existing = new Set(items.map((i) => i.id));
    const toImport = newItems.filter(i => !existing.has(i.id));
    if (toImport.length === 0) return 0;
    setItems(prev => [...prev, ...toImport]);
    return toImport.length;
  };

  return {
    items,
    filteredItems,
    groupedByDate,
    filter,
    setFilter,
    search,
    setSearch,
    hideCompleted,
    setHideCompleted,
    categoriaFiltro,
    setCategoriaFiltro,
    selectedDateFilter,
    setSelectedDateFilter,
    showWeekFromSelected,
    setShowWeekFromSelected,
    addItem,
    updateItem,
    removeItem,
    toggleCompleted,
    importItems,
    setItems // Exposed for undo functionality or bulk set
  };
}
