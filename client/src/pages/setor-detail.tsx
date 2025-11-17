import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  User,
  ExternalLink,
  ArrowLeft,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Setor } from "@shared/schema";

export default function SetorDetail() {
  const [, params] = useRoute("/setor/:slug");
  const slug = params?.slug;

  const { data: setor, isLoading } = useQuery<Setor>({
    queryKey: ["/api/setores", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!setor) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-2xl font-bold mb-4">Setor não encontrado</h1>
          <Button asChild>
            <Link href="/setores">Voltar para setores</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6"
          data-testid="button-back"
        >
          <Link href="/setores">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para setores
          </Link>
        </Button>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start gap-3 mb-2">
                  <Badge variant="secondary" className="font-mono" data-testid="badge-sigla">
                    {setor.sigla}
                  </Badge>
                  {setor.bloco && (
                    <Badge variant="outline">{setor.bloco}</Badge>
                  )}
                  {setor.andar && (
                    <Badge variant="outline">{setor.andar}</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl" data-testid="text-nome">
                  {setor.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Info Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {setor.bloco && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bloco</p>
                        <p className="font-medium">{setor.bloco}</p>
                      </div>
                    </div>
                  )}

                  {setor.andar && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Andar</p>
                        <p className="font-medium">{setor.andar}</p>
                      </div>
                    </div>
                  )}

                  {setor.email && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">E-mail</p>
                        <a
                          href={`mailto:${setor.email}`}
                          className="font-medium text-primary hover:underline truncate block"
                          data-testid="link-email"
                        >
                          {setor.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {setor.ramal_principal && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ramal Principal</p>
                        <p className="font-medium">{setor.ramal_principal}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Observações */}
                {setor.observacoes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Observações</h3>
                      <p className="text-muted-foreground">{setor.observacoes}</p>
                    </div>
                  </>
                )}

                {/* Última Atualização */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Atualizado em:{" "}
                    {new Date(setor.ultima_atualizacao).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Responsáveis Card */}
            {setor.responsaveis && setor.responsaveis.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Responsáveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {setor.responsaveis.map((resp, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(resp.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium" data-testid={`text-responsavel-${idx}`}>
                          {resp.nome}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Contatos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Phone Numbers */}
                {setor.telefones && setor.telefones.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Telefones</p>
                    {setor.telefones.map((tel, idx) => (
                      <Button
                        key={idx}
                        asChild
                        variant="outline"
                        className="w-full justify-start"
                        data-testid={`button-telefone-${idx}`}
                      >
                        <a href={tel.link}>
                          <Phone className="mr-2 h-4 w-4" />
                          {tel.numero}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}

                {/* WhatsApp */}
                {setor.whatsapp && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start text-green-600 hover:text-green-700"
                        data-testid="button-whatsapp"
                      >
                        <a href={setor.whatsapp} target="_blank" rel="noopener noreferrer">
                          <SiWhatsapp className="mr-2 h-4 w-4" />
                          Abrir WhatsApp
                          <ExternalLink className="ml-auto h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </>
                )}

                {/* Celular */}
                {setor.celular && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Celular</p>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start"
                        data-testid="button-celular"
                      >
                        <a href={`tel:${setor.celular}`}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {setor.celular}
                        </a>
                      </Button>
                    </div>
                  </>
                )}

                {/* External Phones */}
                {setor.telefones_externos && setor.telefones_externos.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        Telefones Externos
                      </p>
                      {setor.telefones_externos.map((tel, idx) => (
                        <Button
                          key={idx}
                          asChild
                          variant="outline"
                          className="w-full justify-start"
                          data-testid={`button-telefone-externo-${idx}`}
                        >
                          <a href={tel.link}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {tel.numero}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
