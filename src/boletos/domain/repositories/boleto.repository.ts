import { CreateBoletoInput } from "../use-cases/create-boleto.input";

export interface BoletoRepository {
    create(data: CreateBoletoInput): Promise<number>; 
    findMany(filters: ListBoletosFilters): Promise<
    Array<{
      id: number;
      nomeSacado: string;
      idLote: number;
      valor: number;
      linhaDigitavel: string;
      criadoEm: Date;
    }>
  >;
}

  
export interface ListBoletosFilters {
    nome?: string;
    id_lote?: number;
    valor_inicial?: number;
    valor_final?: number;
  }

  