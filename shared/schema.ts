import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Setor (Department) schema with all fields from JSON data
export const setores = pgTable("setores", {
  id: integer("id").primaryKey(),
  sigla: text("sigla").notNull(),
  nome: text("nome").notNull(),
  bloco: text("bloco").notNull(),
  andar: text("andar").notNull(),
  observacoes: text("observacoes").default(""),
  email: text("email").notNull(),
  slug: text("slug").notNull().unique(),
  ramal_principal: text("ramal_principal").default(""),
  ramais: text("ramais").array().default([]),
  telefones: json("telefones").$type<Telefone[]>().default([]),
  telefones_externos: json("telefones_externos").$type<Telefone[]>().default([]),
  responsaveis: json("responsaveis").$type<Responsavel[]>().default([]),
  celular: text("celular").default(""),
  whatsapp: text("whatsapp").default(""),
  outros_contatos: json("outros_contatos").$type<string[]>().default([]),
  ultima_atualizacao: text("ultima_atualizacao").notNull(),
});

// TypeScript interfaces for nested data structures
export interface Telefone {
  numero: string;
  link: string;
  ramal_original: string;
}

export interface Responsavel {
  nome: string;
}

export interface Setor {
  id: number;
  sigla: string;
  nome: string;
  bloco: string;
  andar: string;
  observacoes: string;
  email: string;
  slug: string;
  ramal_principal: string;
  ramais: string[];
  telefones: Telefone[];
  telefones_externos: Telefone[];
  responsaveis: Responsavel[];
  celular: string;
  whatsapp: string;
  outros_contatos: string[];
  favoritos_ramais?: string[];
  acessos_ramais?: Record<string, number>;
  ultima_atualizacao: string;
}

export const insertSetorSchema = createInsertSchema(setores);
export type InsertSetor = z.infer<typeof insertSetorSchema>;
export type SelectSetor = typeof setores.$inferSelect;

// Search and filter types
export interface SearchFilters {
  query?: string;
  bloco?: string;
  andar?: string;
  responsavel?: string;
}

// Statistics type
export interface Statistics {
  totalSetores: number;
  totalBlocos: number;
  totalAndares: number;
  totalRamais: number;
}
