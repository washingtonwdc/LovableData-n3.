import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Trash2, Pencil, Check, AlertTriangle } from "lucide-react";
import { AgendaItem } from "@/hooks/use-agenda";
import { formatEndTime, categoriaBadgeClass } from "./utils";

interface AgendaItemCardProps {
    item: AgendaItem;
    hasConflict?: boolean;
    onToggleCompleted: (id: string) => void;
    onEdit: (item: AgendaItem) => void;
    onRemove: (id: string) => void;
}

export function AgendaItemCard({ item, hasConflict, onToggleCompleted, onEdit, onRemove }: AgendaItemCardProps) {
    return (
        <Card className="hover-elevate transition-all duration-200 group">
            <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-semibold text-lg leading-tight ${item.concluido ? "line-through opacity-60" : ""}`}>
                                {item.titulo}
                            </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="flex items-center gap-1.5 px-2.5 py-0.5 font-normal">
                                <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                                {item.data}
                            </Badge>
                            {item.hora && (
                                <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-0.5 font-normal">
                                    <Clock className="h-3.5 w-3.5 opacity-70" />
                                    {item.hora}
                                    {item.duracao ? `– ${formatEndTime(item)}` : ""}
                                </Badge>
                            )}
                            {item.categoria && (
                                <Badge variant="outline" className={`${categoriaBadgeClass(item.categoria)} font-normal`}>{item.categoria}</Badge>
                            )}
                            {item.concluido && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Concluído</Badge>
                            )}
                        </div>
                        {hasConflict && (
                            <div className="flex items-center text-sm text-destructive font-medium gap-1.5 bg-destructive/10 p-2 rounded-md">
                                <AlertTriangle className="h-4 w-4" /> Conflito de horário detectado
                            </div>
                        )}
                        {item.notas && (
                            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md mt-2">{item.notas}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleCompleted(item.id)}
                            aria-label={item.concluido ? "Desmarcar" : "Concluir"}
                            className={`h-8 w-8 ${item.concluido ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "hover:text-green-600 hover:bg-green-50"}`}
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(item)} aria-label="Editar" className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} aria-label="Remover" className="h-8 w-8 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
