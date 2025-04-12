import { CreateBoletoInput } from "../use-cases/create-boleto.input";

export interface BoletoRepository {
    create(data: CreateBoletoInput): Promise<number>; 
}

  
