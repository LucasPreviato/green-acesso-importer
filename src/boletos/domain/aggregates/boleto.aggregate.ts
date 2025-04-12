import { Nome } from '../value-objects/nome.vo';
import { Valor } from '../value-objects/valor.vo';
import { LinhaDigitavel } from '../value-objects/linha-digitavel.vo';
import { Status } from '../value-objects/status.vo';
import { Lote } from '../value-objects/lote.vo';
import { Result, right } from '../../../shared/result';

export class BoletoAggregate {
  private constructor(
    public readonly nomeSacado: Nome,
    public readonly lote: Lote,
    public readonly valor: Valor,
    public readonly linhaDigitavel: LinhaDigitavel,
    public readonly status: Status,
  ) {}

  static create(
    nome: Nome,
    lote: Lote,
    valor: Valor,
    linhaDigitavel: LinhaDigitavel,
    status: Status,
  ): Result<Error, BoletoAggregate> {

    return right(new BoletoAggregate(nome, lote, valor, linhaDigitavel, status));
  }
}
