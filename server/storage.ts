import { readFileSync } from "fs";
import { join } from "path";
import type { Setor, Statistics } from "@shared/schema";

export interface IStorage {
  // Get all setores
  getAllSetores(): Promise<Setor[]>;
  
  // Get setor by ID
  getSetorById(id: number): Promise<Setor | undefined>;
  
  // Get setor by slug
  getSetorBySlug(slug: string): Promise<Setor | undefined>;
  
  // Search setores with filters
  searchSetores(query?: string, bloco?: string, andar?: string): Promise<Setor[]>;
  
  // Get statistics
  getStatistics(): Promise<Statistics>;
}

export class MemStorage implements IStorage {
  private setores: Map<number, Setor>;
  private setoresBySlug: Map<string, Setor>;

  constructor() {
    this.setores = new Map();
    this.setoresBySlug = new Map();
    this.loadData();
  }

  private loadData() {
    try {
      // Load data from JSON file
      const dataPath = join(process.cwd(), "attached_assets", "dados estruturados normalizado_1763396739562.json");
      const rawData = readFileSync(dataPath, "utf-8");
      const jsonData = JSON.parse(rawData);

      // Transform and store data
      jsonData.forEach((item: any) => {
        const setor: Setor = {
          id: item.id,
          sigla: item.setor.sigla,
          nome: item.setor.nome,
          bloco: item.setor.bloco || "",
          andar: item.setor.andar || "",
          observacoes: item.setor.observacoes || "",
          email: item.setor.email,
          slug: item.setor.slug,
          ramal_principal: item.setor.ramal_principal || "",
          ramais: item.setor.ramais || [],
          telefones: item.setor.telefones || [],
          telefones_externos: item.setor.telefones_externos || [],
          responsaveis: item.responsaveis || [],
          celular: item.contatos.celular || "",
          whatsapp: item.contatos.whatsapp || "",
          outros_contatos: item.contatos.outros || [],
          ultima_atualizacao: item.ultima_atualizacao,
        };

        this.setores.set(setor.id, setor);
        this.setoresBySlug.set(setor.slug, setor);
      });

      console.log(`✅ Loaded ${this.setores.size} setores from JSON file`);
    } catch (error) {
      console.error("❌ Error loading data:", error);
    }
  }

  async getAllSetores(): Promise<Setor[]> {
    return Array.from(this.setores.values()).sort((a, b) => 
      a.nome.localeCompare(b.nome)
    );
  }

  async getSetorById(id: number): Promise<Setor | undefined> {
    return this.setores.get(id);
  }

  async getSetorBySlug(slug: string): Promise<Setor | undefined> {
    return this.setoresBySlug.get(slug);
  }

  async searchSetores(query?: string, bloco?: string, andar?: string): Promise<Setor[]> {
    let results = Array.from(this.setores.values());

    // Filter by query
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(setor =>
        setor.nome.toLowerCase().includes(searchLower) ||
        setor.sigla.toLowerCase().includes(searchLower) ||
        (setor.bloco && setor.bloco.toLowerCase().includes(searchLower)) ||
        (setor.andar && setor.andar.toLowerCase().includes(searchLower)) ||
        setor.email.toLowerCase().includes(searchLower) ||
        setor.responsaveis.some(r => r.nome.toLowerCase().includes(searchLower))
      );
    }

    // Filter by bloco (only if bloco is not empty string)
    if (bloco && bloco !== "all" && bloco.trim() !== "") {
      results = results.filter(setor => setor.bloco === bloco);
    }

    // Filter by andar (only if andar is not empty string)
    if (andar && andar !== "all" && andar.trim() !== "") {
      results = results.filter(setor => setor.andar === andar);
    }

    return results.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async getStatistics(): Promise<Statistics> {
    const setores = Array.from(this.setores.values());
    
    // Count unique blocos
    const blocosSet = new Set(setores.map(s => s.bloco).filter(Boolean));
    
    // Count unique andares
    const andaresSet = new Set(setores.map(s => s.andar).filter(Boolean));
    
    // Count total ramais
    const totalRamais = setores.reduce((acc, setor) => {
      return acc + (setor.ramais?.length || 0);
    }, 0);

    return {
      totalSetores: this.setores.size,
      totalBlocos: blocosSet.size,
      totalAndares: andaresSet.size,
      totalRamais,
    };
  }
}

export const storage = new MemStorage();
