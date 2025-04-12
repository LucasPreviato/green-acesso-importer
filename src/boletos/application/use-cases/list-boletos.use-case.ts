import { Inject, Injectable } from '@nestjs/common';
import {
  BoletoRepository,
  ListBoletosFilters,
} from '../../domain/repositories/boleto.repository';
import { Result, left, right } from '../../../shared/result';
import { logger } from '../../../shared/logger';


@Injectable()
export class ListBoletosUseCase {
  constructor(
    @Inject('BoletoRepository')
    private readonly boletoRepo: BoletoRepository,
  ) {}

  async execute(
    filters: ListBoletosFilters,
  ): Promise<Result<string, Awaited<ReturnType<BoletoRepository['findMany']>>>> {
    try {
        logger.info({ filters }, 'Buscando boletos com filtros');

      const boletos = await this.boletoRepo.findMany(filters);
      logger.info(`Foram encontrados ${boletos.length} boletos`);
      return right(boletos);
    } catch (error) {
      logger.error({ err: error }, 'Erro ao buscar boletos');
      return left('Erro ao buscar boletos');
    }
  }
}
