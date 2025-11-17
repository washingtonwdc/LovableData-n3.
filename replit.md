# SEEPE - Sistema de Localização de Setores da SEE-PE

## Overview
Sistema web completo para localização e acesso a informações dos setores da Secretaria de Educação de Pernambuco (SEE-PE). O aplicativo permite busca avançada, visualização de detalhes, lista telefônica e navegação intuitiva pelos 185 setores cadastrados.

## Recent Changes
- **2025-11-17**: Implementação completa do sistema SEEPE
  - Frontend completo com React, TypeScript, Tailwind CSS e Shadcn UI
  - Backend com Express.js e armazenamento em memória
  - Carregamento de 185 setores do arquivo JSON fornecido
  - Sistema de busca avançada com filtros por bloco e andar
  - Páginas: Home, Buscar Setores, Detalhes do Setor, Lista Telefônica, Sobre
  - Dark mode completo
  - Design responsivo seguindo design_guidelines.md

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 com Vite
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: React Query (TanStack Query)
- **Routing**: Wouter
- **Features**:
  - Sidebar navigation com AppSidebar
  - Dark mode com ThemeProvider
  - Busca avançada com filtros
  - Estados de loading, error e empty
  - Design responsivo e acessível

### Backend (Express.js)
- **Framework**: Express.js com TypeScript
- **Storage**: MemStorage (in-memory)
- **Data Source**: `attached_assets/dados estruturados normalizado_1763396739562.json`
- **API Endpoints**:
  - `GET /api/setores` - Lista todos os setores (com filtros opcionais: query, bloco, andar)
  - `GET /api/setores/:slug` - Detalhes de um setor específico
  - `GET /api/statistics` - Estatísticas gerais (total setores, blocos, andares, ramais)

### Data Model
**Setor** (Department):
- id, sigla, nome, slug
- bloco, andar, observacoes
- email, ramal_principal, ramais[], telefones[]
- responsaveis[], celular, whatsapp
- ultima_atualizacao

## User Preferences
- Fonte principal: Inter (Google Fonts)
- Cores: Sistema baseado em azul (primary: 210 85% 32%)
- Layout: Sidebar fixa com navegação
- Design: Material Design inspired, clean e acessível

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter, React Query
- **Backend**: Node.js, Express, TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS com design system customizado
- **Icons**: Lucide React, React Icons (para logos)

## Database
- **Type**: In-memory storage (MemStorage)
- **Data**: 185 setores carregados do JSON fornecido
- **Statistics**: 15 blocos, múltiplos andares, ramais telefônicos

## Key Features
1. **Página Inicial**: Hero section com estatísticas e CTAs
2. **Busca Avançada**: Filtros por nome, sigla, bloco, andar, responsável
3. **Lista de Setores**: Cards elegantes com informações resumidas
4. **Detalhes do Setor**: Informações completas incluindo localização, contatos, responsáveis
5. **Lista Telefônica**: Tabela organizada com todos os ramais e telefones
6. **Dark Mode**: Tema escuro completo com toggle
7. **Responsivo**: Design adaptativo para mobile, tablet e desktop

## Important Files
- `shared/schema.ts`: TypeScript types e Zod schemas
- `server/storage.ts`: MemStorage implementation com dados carregados
- `server/routes.ts`: API endpoints
- `client/src/App.tsx`: App principal com routing e layout
- `client/src/lib/queryClient.ts`: React Query configuration
- `client/src/components/`: Componentes reutilizáveis
- `client/src/pages/`: Páginas principais
- `design_guidelines.md`: Guia completo de design

## Running the Project
- Workflow: "Start application" runs `npm run dev`
- Frontend: Vite dev server
- Backend: Express server on port 5000
- All changes auto-reload via HMR

## Data Source
- File: `attached_assets/dados estruturados normalizado_1763396739562.json`
- 185 setores com informações completas
- Dados carregados automaticamente no MemStorage ao iniciar servidor
