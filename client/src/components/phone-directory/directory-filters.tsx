import { SearchBar } from "@/components/search-bar";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DirectoryFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    blocos: string[] | undefined;
    andares: string[] | undefined;
    responsaveis: string[];
    emails: string[];
    selectedBloco: string;
    onSelectedBlocoChange: (value: string) => void;
    selectedAndar: string;
    onSelectedAndarChange: (value: string) => void;
    selectedResponsavel: string;
    onSelectedResponsavelChange: (value: string) => void;
    selectedEmail: string;
    onSelectedEmailChange: (value: string) => void;
}

export function DirectoryFilters({
    searchQuery,
    onSearchChange,
    blocos,
    andares,
    responsaveis,
    emails,
    selectedBloco,
    onSelectedBlocoChange,
    selectedAndar,
    onSelectedAndarChange,
    selectedResponsavel,
    onSelectedResponsavelChange,
    selectedEmail,
    onSelectedEmailChange,
}: DirectoryFiltersProps) {
    return (
        <div className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex-1">
                    <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder="Buscar por setor, sigla, bloco ou ramal..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-40">
                        <Select value={selectedBloco} onValueChange={onSelectedBlocoChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Bloco" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os blocos</SelectItem>
                                {(blocos || []).map((b) => (
                                    <SelectItem key={b} value={b}>{b}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-40">
                        <Select value={selectedAndar} onValueChange={onSelectedAndarChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Andar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os andares</SelectItem>
                                {(andares || []).map((a) => (
                                    <SelectItem key={a} value={a}>{a}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-52">
                        <Select value={selectedResponsavel} onValueChange={onSelectedResponsavelChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Responsável" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os responsáveis</SelectItem>
                                {(responsaveis || []).map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-60">
                        <Select value={selectedEmail} onValueChange={onSelectedEmailChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="E-mail" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os e-mails</SelectItem>
                                {(emails || []).map((e) => (
                                    <SelectItem key={e} value={e}>{e}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {selectedBloco !== "all" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            Bloco: {selectedBloco}
                            <Button variant="ghost" size="sm" onClick={() => onSelectedBlocoChange("all")} className="h-6 px-1">
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {selectedAndar !== "all" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            Andar: {selectedAndar}
                            <Button variant="ghost" size="sm" onClick={() => onSelectedAndarChange("all")} className="h-6 px-1">
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {selectedResponsavel !== "all" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            Resp.: {selectedResponsavel}
                            <Button variant="ghost" size="sm" onClick={() => onSelectedResponsavelChange("all")} className="h-6 px-1">
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {selectedEmail !== "all" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            E-mail: {selectedEmail}
                            <Button variant="ghost" size="sm" onClick={() => onSelectedEmailChange("all")} className="h-6 px-1">
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {(selectedBloco !== "all" || selectedAndar !== "all" || selectedResponsavel !== "all" || selectedEmail !== "all") && (
                        <Button variant="outline" size="sm" onClick={() => { onSelectedBlocoChange("all"); onSelectedAndarChange("all"); onSelectedResponsavelChange("all"); onSelectedEmailChange("all"); }}>
                            Limpar filtros
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
