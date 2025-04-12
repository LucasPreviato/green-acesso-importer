import { Inject, Injectable } from '@nestjs/common';
import { BoletoRepository } from '../../domain/repositories/boleto.repository';
import { LoteRepository } from '../../domain/repositories/lote.repository';
import { CreateBoletoDto } from '../dto/create-boleto.dto';
import { Nome } from '../../domain/value-objects/nome.vo';
import { Valor } from '../../domain/value-objects/valor.vo';
import { LinhaDigitavel } from '../../domain/value-objects/linha-digitavel.vo';
import { Status, StatusBoleto } from '../../domain/value-objects/status.vo';
import { Lote } from '../../domain/value-objects/lote.vo';
import { BoletoAggregate } from '../../domain/aggregates/boleto.aggregate';
import { Result, Right, left, right } from '../../../shared/result';
import { logger } from '../../../shared/logger';

@Injectable()
export class ImportBoletosUseCase {
  constructor(
    @Inject('BoletoRepository')
    private readonly boletoRepo: BoletoRepository,

    @Inject('LoteRepository')
    private readonly loteRepo: LoteRepository,
  ) {}

  async execute(
    data: CreateBoletoDto[],
  ): Promise<Result<string, { total: number }>> {
    logger.info(`Iniciando importação de ${data.length} boletos`);

    let count = 0;

    for (const boleto of data) {
      const boletoResult: Result<Error, BoletoAggregate> =
        await this.validateAndCreateBoleto(boleto);

      if (boletoResult.isLeft()) {
        logger.warn(`Erro ao validar boleto para ${boleto.nome}`);
        const err = boletoResult.value;
        return left(
            err instanceof Error ? err.message : 'Erro desconhecido ao validar boleto',
          );
      }

      const boletoAggregate : BoletoAggregate = (boletoResult as Right<BoletoAggregate>).value;

      await this.boletoRepo.create({
        nomeSacado: boletoAggregate.nomeSacado.value,
        idLote: boletoAggregate.lote.id,
        valor: boletoAggregate.valor.toNumber(),
        linhaDigitavel: boletoAggregate.linhaDigitavel.toString(),
        status: boletoAggregate.status.value,
      });

      logger.debug(
        {
          nome: boletoAggregate.nomeSacado.value,
          lote: boletoAggregate.lote.nome,
        },
        'Boleto criado com sucesso',
      );

      count++;
    }

    logger.info(
      { total: count },
      'Importação de boletos finalizada com sucesso',
    );
    return right({ total: count });
  }

  private async validateAndCreateBoleto(
    dto: CreateBoletoDto,
  ): Promise<Result<Error, BoletoAggregate>> {
    const nomeResult: Result<Error, Nome> = Nome.create(dto.nome);
    if (nomeResult.isLeft()) {
      const err = nomeResult.value;
      return left(err instanceof Error ? err : new Error('Erro ao criar Nome'));
    }
    const nome: Nome = (nomeResult as Right<Nome>).value;

    const linhaDigitavelResult: Result<Error, LinhaDigitavel> =
      LinhaDigitavel.create(dto.linha_digitavel);
    if (linhaDigitavelResult.isLeft()) {
      const err = linhaDigitavelResult.value;
      return left(
        err instanceof Error ? err : new Error('Erro ao criar Linha Digitável'),
      );
    }
    const linhaDigitavel: LinhaDigitavel = (
      linhaDigitavelResult as Right<LinhaDigitavel>
    ).value;

    const valorResult: Result<Error, Valor> = Valor.create(dto.valor);

    if (valorResult.isLeft()) {
      const err = valorResult.value;
      return left(
        err instanceof Error ? err : new Error('Erro ao criar Valor'),
      );
    }
    const valor: Valor = (valorResult as Right<Valor>).value;

    const statusResult: Result<Error, Status> = Status.create(
      StatusBoleto.ATIVO,
    );

    if (statusResult.isLeft()) {
      const err = statusResult.value;
      return left(
        err instanceof Error ? err : new Error('Erro ao criar Status'),
      );
    }

    const status: Status = (statusResult as Right<Status>).value;

    const loteNome = `00${dto.unidade.toString().padStart(2, '0')}`;
    const lote = await this.loteRepo.findByNome(loteNome);
    if (!lote) {
      return left(new Error(`Lote ${loteNome} não encontrado`));
    }

    const loteResult: Result<Error, Lote> = Lote.create(lote.id, lote.nome);

    if (loteResult.isLeft()) {
      const err = loteResult.value;
      return left(err instanceof Error ? err : new Error('Erro ao criar Lote'));
    }

    const loteVO: Lote = (loteResult as Right<Lote>).value;

    const aggregateResult: Result<Error, BoletoAggregate> =
      BoletoAggregate.create(nome, loteVO, valor, linhaDigitavel, status);

    return aggregateResult;
  }
}
