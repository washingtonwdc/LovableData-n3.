import { useQuery } from "@tanstack/react-query";
import { Building2, Phone, MapPin, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/stats-card";
import { LoadingStats } from "@/components/loading-state";
import type { Statistics } from "@shared/schema";

export default function Home() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background dark:from-background/95 dark:via-background/70 dark:to-background pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Secretaria de Educação de Pernambuco</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6" data-testid="text-hero-title">
              Sistema de Localização
              <span className="block text-primary mt-2">de Setores SEE-PE</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8" data-testid="text-hero-description">
              Encontre e entre em contato com os setores oficiais da Secretaria de Educação de Pernambuco. 
              Busca rápida por nome, sigla, bloco, andar ou responsável.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" data-testid="button-hero-search">
                <Link href="/setores">
                  <Building2 className="mr-2 h-5 w-5" />
                  Buscar Setores
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" data-testid="button-hero-phone">
                <Link href="/lista-telefonica">
                  <Phone className="mr-2 h-5 w-5" />
                  Lista Telefônica
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Visão Geral</h2>
            <p className="text-muted-foreground">Estatísticas do sistema de setores</p>
          </div>
          
          {isLoading ? (
            <LoadingStats />
          ) : stats ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total de Setores"
                value={stats.totalSetores}
                icon={Building2}
                description="Setores cadastrados"
                testId="stat-total-setores"
              />
              <StatsCard
                title="Blocos"
                value={stats.totalBlocos}
                icon={MapPin}
                description="Blocos diferentes"
                testId="stat-total-blocos"
              />
              <StatsCard
                title="Andares"
                value={stats.totalAndares}
                icon={MapPin}
                description="Andares ocupados"
                testId="stat-total-andares"
              />
              <StatsCard
                title="Ramais"
                value={stats.totalRamais}
                icon={Phone}
                description="Ramais telefônicos"
                testId="stat-total-ramais"
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Acesso Rápido e Organizado</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sistema completo para localizar e acessar informações de todos os setores da SEE-PE
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Busca Avançada</h3>
              <p className="text-muted-foreground">
                Encontre setores por nome, código, bloco, andar ou responsável de forma rápida e eficiente
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Informações Completas</h3>
              <p className="text-muted-foreground">
                Acesse dados de contato, responsáveis, ramais e localização de cada setor
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cobertura Completa</h3>
              <p className="text-muted-foreground">
                Todos os setores distribuídos pelos blocos e andares da secretaria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Acesse agora o sistema e encontre o setor que você precisa
          </p>
          <Button asChild size="lg" data-testid="button-cta-explore">
            <Link href="/setores">
              Explorar Setores
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
