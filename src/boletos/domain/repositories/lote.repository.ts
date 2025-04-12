export interface LoteRepository {
    findByNome(nome: string): Promise<{ id: number } | null>;
  }
  