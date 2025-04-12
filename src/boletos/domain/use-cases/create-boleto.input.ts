import { StatusBoleto } from "../value-objects/status.vo";

export interface CreateBoletoInput {
    nomeSacado: string;
    idLote: number;
    valor: number;
    linhaDigitavel: string;
    status: StatusBoleto;
  }