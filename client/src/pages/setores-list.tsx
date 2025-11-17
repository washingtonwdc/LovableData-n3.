import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { SetorCard } from "@/components/setor-card";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Setor } from "@shared/schema";

export default function SetoresList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloco, setSelectedBloco] = useState<string>("all");
  const [selectedAndar, setSelectedAndar] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch ALL setores (no filters) - used ONLY for building filter options
  const { data: allSetores } = useQuery<Setor[]>({
    queryKey: ["/api/setores", "base"],
  });

  // Build query parameters for backend search
  const hasFilters = searchQuery || selectedBloco !== "all" || selectedAndar !== "all";
  
  const queryParams = useMemo(() => {
    if (!hasFilters) return undefined;
    
    const params: Record<string, string> = {};
    if (searchQuery) params.query = searchQuery;
    if (selectedBloco !== "all") params.bloco = selectedBloco;
    if (selectedAndar !== "all") params.andar = selectedAndar;
    return params;
  }, [searchQuery, selectedBloco, selectedAndar, hasFilters]);

  // Fetch filtered or all setores from backend (different query key)
  const { data: displaySetores, isLoading } = useQuery<Setor[]>({
    queryKey: hasFilters 
      ? ["/api/setores", queryParams] 
      : ["/api/setores"],
  });

  // Extract unique blocos and andares from ALL setores (not filtered)
  const { blocos, andares } = useMemo(() => {
    if (!allSetores) return { blocos: [], andares: [] };
    
    const blocosSet = new Set(
      allSetores
        .map(s => s.bloco)
        .filter(b => b && b.trim() !== "")
    );
    const andaresSet = new Set(
      allSetores
        .map(s => s.andar)
        .filter(a => a && a.trim() !== "")
    );
    
    return {
      blocos: Array.from(blocosSet).sort(),
      andares: Array.from(andaresSet).sort(),
    };
  }, [allSetores]);

  const activeFiltersCount = [
    selectedBloco !== "all",
    selectedAndar !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBloco("all");
    setSelectedAndar("all");
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Buscar Setores</h1>
          <p className="text-muted-foreground">
            Encontre setores por nome, sigla, bloco, andar ou responsável
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                Limpar filtros
              </Button>
            )}
          </div>

          {showFilters && (
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bloco</label>
                    <Select value={selectedBloco} onValueChange={setSelectedBloco}>
                      <SelectTrigger data-testid="select-bloco">
                        <SelectValue placeholder="Todos os blocos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os blocos</SelectItem>
                        {blocos.map(bloco => (
                          <SelectItem key={bloco} value={bloco}>
                            {bloco}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Andar</label>
                    <Select value={selectedAndar} onValueChange={setSelectedAndar}>
                      <SelectTrigger data-testid="select-andar">
                        <SelectValue placeholder="Todos os andares" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os andares</SelectItem>
                        {andares.map(andar => (
                          <SelectItem key={andar} value={andar}>
                            {andar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingState />
        ) : displaySetores && displaySetores.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                {displaySetores.length} {displaySetores.length === 1 ? 'setor encontrado' : 'setores encontrados'}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displaySetores.map(setor => (
                <SetorCard key={setor.id} setor={setor} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon="search"
            title="Nenhum setor encontrado"
            description="Tente ajustar os filtros ou buscar por outros termos."
            actionLabel={activeFiltersCount > 0 || searchQuery ? "Limpar filtros" : undefined}
            onAction={activeFiltersCount > 0 || searchQuery ? clearFilters : undefined}
          />
        )}
      </div>
    </div>
  );
}
