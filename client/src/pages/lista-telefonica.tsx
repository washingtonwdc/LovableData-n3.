import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, Building2, ArrowUpDown } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Setor } from "@shared/schema";

type SortField = "setor" | "bloco" | "ramal";
type SortDirection = "asc" | "desc";

export default function ListaTelefonica() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("setor");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { data: setores, isLoading } = useQuery<Setor[]>({
    queryKey: ["/api/setores"],
  });

  // Create phone directory entries
  const phoneEntries = useMemo(() => {
    if (!setores) return [];

    const entries: Array<{
      id: number;
      setor: string;
      sigla: string;
      slug: string;
      bloco: string;
      andar: string;
      ramal: string;
      telefone: string;
      email: string;
    }> = [];

    setores.forEach(setor => {
      // Add entry for main ramal if exists
      if (setor.ramal_principal) {
        const mainTel = setor.telefones?.find(t => t.ramal_original === setor.ramal_principal);
        entries.push({
          id: setor.id,
          setor: setor.nome,
          sigla: setor.sigla,
          slug: setor.slug,
          bloco: setor.bloco,
          andar: setor.andar,
          ramal: setor.ramal_principal,
          telefone: mainTel?.numero || "",
          email: setor.email,
        });
      }

      // Add entries for other ramais
      setor.ramais?.forEach((ramal, idx) => {
        if (ramal !== setor.ramal_principal) {
          const tel = setor.telefones?.find(t => t.ramal_original === ramal);
          entries.push({
            id: setor.id * 1000 + idx,
            setor: setor.nome,
            sigla: setor.sigla,
            slug: setor.slug,
            bloco: setor.bloco,
            andar: setor.andar,
            ramal: ramal,
            telefone: tel?.numero || "",
            email: setor.email,
          });
        }
      });
    });

    return entries;
  }, [setores]);

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = phoneEntries.filter(entry => {
      const searchLower = searchQuery.toLowerCase();
      return (
        entry.setor.toLowerCase().includes(searchLower) ||
        entry.sigla.toLowerCase().includes(searchLower) ||
        entry.bloco.toLowerCase().includes(searchLower) ||
        entry.ramal.includes(searchQuery) ||
        entry.telefone.includes(searchQuery)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "setor":
          comparison = a.setor.localeCompare(b.setor);
          break;
        case "bloco":
          comparison = a.bloco.localeCompare(b.bloco);
          break;
        case "ramal":
          comparison = a.ramal.localeCompare(b.ramal);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [phoneEntries, searchQuery, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Lista Telefônica
          </h1>
          <p className="text-muted-foreground">
            Todos os ramais e telefones organizados por setor
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por setor, sigla, bloco ou ramal..."
          />
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Diretório de Ramais
              </CardTitle>
              {filteredAndSortedEntries.length > 0 && (
                <Badge variant="secondary" data-testid="badge-total-entries">
                  {filteredAndSortedEntries.length} {filteredAndSortedEntries.length === 1 ? 'ramal' : 'ramais'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredAndSortedEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSort("setor")}
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
                          onClick={() => toggleSort("bloco")}
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
                          onClick={() => toggleSort("ramal")}
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
                  <TableBody>
                    {filteredAndSortedEntries.map(entry => (
                      <TableRow key={entry.id} data-testid={`row-entry-${entry.id}`}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="font-mono text-xs">
                                {entry.sigla}
                              </Badge>
                            </div>
                            <div className="text-sm">{entry.setor}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{entry.bloco}</div>
                            {entry.andar && (
                              <div className="text-muted-foreground text-xs">{entry.andar}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {entry.ramal}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {entry.telefone && (
                            <a
                              href={`tel:${entry.telefone.replace(/\D/g, "")}`}
                              className="text-primary hover:underline flex items-center gap-1"
                              data-testid={`link-telefone-${entry.id}`}
                            >
                              <Phone className="h-3 w-3" />
                              {entry.telefone}
                            </a>
                          )}
                        </TableCell>
                        <TableCell>
                          {entry.email && (
                            <a
                              href={`mailto:${entry.email}`}
                              className="text-primary hover:underline flex items-center gap-1 text-xs truncate max-w-xs"
                              data-testid={`link-email-${entry.id}`}
                            >
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{entry.email}</span>
                            </a>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            data-testid={`button-ver-setor-${entry.id}`}
                          >
                            <Link href={`/setor/${entry.slug}`}>
                              <Building2 className="mr-1 h-3 w-3" />
                              Ver setor
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState
                icon="search"
                title="Nenhum ramal encontrado"
                description="Tente buscar por outros termos."
                actionLabel={searchQuery ? "Limpar busca" : undefined}
                onAction={searchQuery ? () => setSearchQuery("") : undefined}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
