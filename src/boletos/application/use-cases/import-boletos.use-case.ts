import { Inject, Injectable } from '@nestjs/common';
import { BoletoRepository } from '../../domain/repositories/boleto.repository';
import { LoteRepository } from '../../domain/repositories/lote.repository';
import { CreateBoletoDto } from '../dto/create-boleto.dto';
import { Result, left, right } from '../../../shared/result';
import { logger } from '../../../shared/logger';

@Injectable()
export class ImportBoletosUseCase {
  constructor(
    @Inject('BoletoRepository')
    private readonly boletoRepo: BoletoRepository,

    @Inject('LoteRepository')
    private readonly loteRepo: LoteRepository,
  ) {}

  async execute(data: CreateBoletoDto[]): Promise<Result<string, { total: number }>> {
    logger.info(`Iniciando importação de ${data.length} boletos`);

    let count = 0;

    for (const boleto of data) {
      const loteNome = `00${boleto.unidade.toString().padStart(2, '0')}`;
      const lote = await this.loteRepo.findByNome(loteNome);

      if (!lote) {
        logger.warn(`Lote '${loteNome}' não encontrado para sacado '${boleto.nome}'`);
        return left(`Lote ${loteNome} não encontrado`);
      }

      await this.boletoRepo.create({
        nomeSacado: boleto.nome,
        idLote: lote.id,
        valor: boleto.valor,
        linhaDigitavel: boleto.linha_digitavel,
      });

      logger.debug(`Boleto criado para ${boleto.nome} no lote ${loteNome}`);

      count++;
    }
    logger.info({ total: count }, 'Importação de boletos finalizada com sucesso');
    return right({ total: count });
  }
}
