import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/setores - Get all setores or search with filters
  app.get("/api/setores", async (req, res) => {
    try {
      const { query, bloco, andar } = req.query;
      
      if (query || bloco || andar) {
        // Search with filters
        const results = await storage.searchSetores(
          query as string,
          bloco as string,
          andar as string
        );
        return res.json(results);
      }

      // Get all setores
      const setores = await storage.getAllSetores();
      res.json(setores);
    } catch (error) {
      console.error("Error fetching setores:", error);
      res.status(500).json({ error: "Failed to fetch setores" });
    }
  });

  // GET /api/setores/:slug - Get setor by slug
  app.get("/api/setores/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const setor = await storage.getSetorBySlug(slug);
      
      if (!setor) {
        return res.status(404).json({ error: "Setor not found" });
      }

      res.json(setor);
    } catch (error) {
      console.error("Error fetching setor:", error);
      res.status(500).json({ error: "Failed to fetch setor" });
    }
  });

  // GET /api/statistics - Get statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
