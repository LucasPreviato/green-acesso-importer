import { Result, left, right } from '../../../shared/result';

export enum StatusBoleto {
  ATIVO = 'ATIVO',
  DESATIVADO = 'DESATIVADO',
  PAGO = 'PAGO',
  CANCELADO = 'CANCELADO',
}

export class Status {
  private constructor(private readonly _value: StatusBoleto) {
    Object.freeze(this);
  }

  static create(value: StatusBoleto): Result<Error, Status> {
    if (!Object.values(StatusBoleto).includes(value)) {
      return left(new Error('Status inválido'));
    }
    return right(new Status(value));
  }

  get value(): StatusBoleto {
    return this._value;
  }

  podeDesativar(): boolean {
    return this._value === StatusBoleto.ATIVO;
  }

  podePagar(): boolean {
    return this._value === StatusBoleto.ATIVO;
  }

  equals(other: Status): boolean {
    return this._value === other._value;
  }
}
