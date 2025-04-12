export interface BoletoRepository {
    create(data: {
      nomeSacado: string;
      idLote: number;
      valor: number;
      linhaDigitavel: string;
    }): Promise<number>; // ← retorna ID do boleto criado
  }

  
  