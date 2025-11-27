import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { ArrowUpDown, Star, Filter, BarChart3, Copy, Phone, Mail, Building2 } from "lucide-react";
import { DirectoryEntry, SortField, SortDirection } from "@/hooks/use-phone-directory";
import { toast } from "@/hooks/use-toast";

interface DirectoryTableProps {
    entries: DirectoryEntry[];
    totalEntries: number;
    page: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
    favoritesFirst: boolean;
    onFavoritesFirstChange: (value: boolean) => void;
    favoritesOnly: boolean;
    onFavoritesOnlyChange: (value: boolean) => void;
    accessFirst: boolean;
    onAccessFirstChange: (value: boolean) => void;
    searchQuery: string;
    onToggleFavorite: (slug: string, numero: string, isFav: boolean) => void;
    onEdit?: (slug: string, ramal: string, setorNome: string, telefone: string) => void;
    onRemove?: (slug: string, ramal: string) => void;
    adminOpen: boolean;
}

export function DirectoryTable({
    entries,
    totalEntries,
    page,
    pageSize,
    totalPages,
    onPageChange,
    onPageSizeChange,
    sortField,
    sortDirection,
    onSort,
    favoritesFirst,
    onFavoritesFirstChange,
    favoritesOnly,
    onFavoritesOnlyChange,
    accessFirst,
    onAccessFirstChange,
    searchQuery,
    onToggleFavorite,
    onEdit,
    onRemove,
    adminOpen
}: DirectoryTableProps) {
    const useVirtual = totalEntries > 400;
    const rowHeight = 64;
    const viewportHeight = 560;
    const [virtualScrollTop, setVirtualScrollTop] = useState(0);
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + 4;
    const startIndex = useVirtual ? Math.max(0, Math.floor(virtualScrollTop / rowHeight) - 2) : 0;
    const endIndex = useVirtual ? Math.min(entries.length, startIndex + visibleCount) : entries.length;

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
        return <ArrowUpDown className="ml-2 h-4 w-4" />;
    };

    const highlight = (text: string) => {
        const q = searchQuery.trim();
        if (!q) return text;
        const idx = text.toLowerCase().indexOf(q.toLowerCase());
        if (idx === -1) return text;
        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + q.length);
        const after = text.slice(idx + q.length);
        return (
            <span>
                {before}
                <span className="bg-yellow-200">{match}</span>
                {after}
            </span>
        );
    };

    const visibleEntries = useVirtual ? entries.slice(startIndex, endIndex) : entries;

    return (
        <>
            <div className="flex items-center justify-between mb-2 gap-2">
                {useVirtual ? (
                    <div className="text-sm text-muted-foreground">Modo virtualizado</div>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Itens por página</span>
                            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground">
                                Página {page} de {totalPages}
                            </div>
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Ant</Button>
                                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Próx</Button>
                            </div>
                            <ToggleGroup
                                type="multiple"
                                variant="outline"
                                size="sm"
                                value={[favoritesFirst ? "favFirst" : null, favoritesOnly ? "favOnly" : null, accessFirst ? "accFirst" : null].filter(Boolean) as string[]}
                                onValueChange={(vals) => {
                                    onFavoritesFirstChange(vals.includes("favFirst"));
                                    onFavoritesOnlyChange(vals.includes("favOnly"));
                                    onAccessFirstChange(vals.includes("accFirst"));
                                }}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <ToggleGroupItem value="favFirst" data-testid="toggle-favoritos-primeiro">
                                                <Star className="h-4 w-4" />
                                                Favoritos
                                            </ToggleGroupItem>
                                        </TooltipTrigger>
                                        <TooltipContent>Favoritos primeiro</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <ToggleGroupItem value="favOnly" data-testid="toggle-somente-favoritos">
                                                <Filter className="h-4 w-4" />
                                                Somente
                                            </ToggleGroupItem>
                                        </TooltipTrigger>
                                        <TooltipContent>Somente favoritos</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <ToggleGroupItem value="accFirst" data-testid="toggle-acessos-primeiro">
                                                <BarChart3 className="h-4 w-4" />
                                                Acessos
                                            </ToggleGroupItem>
                                        </TooltipTrigger>
                                        <TooltipContent>Acessos primeiro</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </ToggleGroup>
                        </div>
                    </>
                )}
            </div>
            <div
                onScroll={useVirtual ? (e) => setVirtualScrollTop((e.target as HTMLDivElement).scrollTop) : undefined}
                style={useVirtual ? { maxHeight: `${viewportHeight}px`, overflowY: 'auto' } : undefined}
                className="rounded-md border"
            >
                <Table>
                    <TableHeader className="border-b bg-muted/20">
                        <TableRow>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onSort("setor")}
                                    className="flex items-center"
                                    data-testid="button-sort-setor"
                                >
                                    Setor
                                    {getSortIcon("setor")}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onSort("bloco")}
                                    className="flex items-center"
                                    data-testid="button-sort-bloco"
                                >
                                    Local
                                    {getSortIcon("bloco")}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onSort("ramal")}
                                    className="flex items-center"
                                    data-testid="button-sort-ramal"
                                >
                                    Ramal
                                    {getSortIcon("ramal")}
                                </Button>
                            </TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>E-mail</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                        {useVirtual && startIndex > 0 && (
                            <TableRow style={{ height: startIndex * rowHeight }} />
                        )}
                        {visibleEntries.map(entry => (
                            <TableRow
                                key={entry.id}
                                data-testid={`row-entry-${entry.id}`}
                                className={entry.isFav ? "bg-primary/5 hover:bg-primary/10 transition-colors" : "odd:bg-muted/20 hover:bg-muted/40 transition-colors"}
                                style={{ height: rowHeight }}
                            >
                                <TableCell className="font-medium align-top">
                                    <div className="max-w-[300px] break-words">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                {highlight(entry.sigla)}
                                            </Badge>
                                        </div>
                                        <div className="text-sm">{highlight(entry.setor)}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top">
                                    <div className="text-sm">
                                        <div className="font-medium">{highlight(entry.bloco)}</div>
                                        {entry.andar && (
                                            <div className="text-muted-foreground text-xs">{entry.andar}</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">
                                            {highlight(entry.ramal)}
                                        </Badge>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(entry.ramal);
                                                            toast({ title: "Copiado", description: "Ramal copiado para a área de transferência." });
                                                        }}
                                                        className="h-6 w-6"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Copiar ramal</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {entry.telefone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            {highlight(entry.telefone)}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {entry.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            <a href={`mailto:${entry.email}`} className="hover:underline truncate max-w-[200px] block">
                                                {entry.email}
                                            </a>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onToggleFavorite(entry.slug, entry.ramal, !entry.isFav)}
                                            className={entry.isFav ? "text-yellow-500" : "text-muted-foreground"}
                                        >
                                            <Star className={`h-4 w-4 ${entry.isFav ? "fill-current" : ""}`} />
                                        </Button>
                                        {adminOpen && onEdit && (
                                            <Button variant="ghost" size="sm" onClick={() => onEdit(entry.slug, entry.ramal, entry.setor, entry.telefone)}>
                                                Editar
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {useVirtual && endIndex < entries.length && (
                            <TableRow style={{ height: (entries.length - endIndex) * rowHeight }} />
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
