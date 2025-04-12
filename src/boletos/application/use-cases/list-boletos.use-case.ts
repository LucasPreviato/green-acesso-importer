import { Inject, Injectable } from '@nestjs/common';
import {
  BoletoRepository,
  ListBoletosFilters,
} from '../../domain/repositories/boleto.repository';
import { Result, left, right } from '../../../shared/result';

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
      const boletos = await this.boletoRepo.findMany(filters);
      return right(boletos);
    } catch (error) {
      console.error('[ListBoletosUseCase] Erro:', error);
      return left('Erro ao buscar boletos');
    }
  }
}
