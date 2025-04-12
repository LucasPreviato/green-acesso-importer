import { Inject, Injectable } from '@nestjs/common';
import { BoletoRepository } from '../../domain/repositories/boleto.repository';
import { LoteRepository } from '../../domain/repositories/lote.repository';
import { CreateBoletoDto } from '../dto/create-boleto.dto';


@Injectable()
export class ImportBoletosUseCase {
  constructor(
    @Inject('BoletoRepository')
    private readonly boletoRepo: BoletoRepository,

    @Inject('LoteRepository')
    private readonly loteRepo: LoteRepository,
  ) {}

  async execute(data: CreateBoletoDto[]): Promise<void> {
    for (const boleto of data) {
      const loteNome = `00${boleto.unidade.toString().padStart(2, '0')}`;
      const lote = await this.loteRepo.findByNome(loteNome);

      if (!lote) {
        throw new Error(`Lote ${loteNome} não encontrado`);
      }

      await this.boletoRepo.create({
        nomeSacado: boleto.nome,
        idLote: lote.id,
        valor: boleto.valor,
        linhaDigitavel: boleto.linha_digitavel,
      });
    }
  }
}
