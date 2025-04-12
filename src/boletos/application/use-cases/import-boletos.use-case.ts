import { Inject, Injectable } from '@nestjs/common';
import { BoletoRepository } from '../../domain/repositories/boleto.repository';
import { LoteRepository } from '../../domain/repositories/lote.repository';
import { CreateBoletoDto } from '../dto/create-boleto.dto';
import { LinhaDigitavel } from '../../domain/value-objects/linha-digitavel.vo';
import { Valor } from '../../domain/value-objects/valor.vo';
import { Result, left, right, Left } from '../../../shared/result';
import { logger } from '../../../shared/logger';
import { StatusBoleto, Status } from 'src/boletos/domain/value-objects/status.vo';

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

      const linhaDigitavelResult = LinhaDigitavel.create(boleto.linha_digitavel);
      if (linhaDigitavelResult instanceof Left) {
        const err = linhaDigitavelResult.value;
        logger.warn(`Linha digitável inválida para ${boleto.nome}: ${boleto.linha_digitavel}`);
        return left(err instanceof Error ? err.message : 'Linha digitável inválida');
      }

      const valorResult = Valor.create(boleto.valor);
      if (valorResult instanceof Left) {
        const err = valorResult.value;
        logger.warn(`Valor inválido para ${boleto.nome}: ${boleto.valor}`);
        return left(err instanceof Error ? err.message : 'Valor inválido');
      }

      const statusResult = Status.create(StatusBoleto.ATIVO);
    if (statusResult instanceof Left) {
    return left('Erro ao definir status inicial');
}

      await this.boletoRepo.create({
        nomeSacado: boleto.nome,
        idLote: lote.id,
        valor: valorResult.value.toNumber(),
        linhaDigitavel: linhaDigitavelResult.value.toString(),
        status: statusResult.value.value,
      });

      logger.debug(`Boleto criado para ${boleto.nome} no lote ${loteNome}`);
      count++;
    }

    logger.info({ total: count }, 'Importação de boletos finalizada com sucesso');
    return right({ total: count });
  }
}
