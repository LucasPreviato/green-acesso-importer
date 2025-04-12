import { Result, left, right } from '../../../shared/result';

export class Data {
  private constructor(private readonly _value: Date) {
    Object.freeze(this);
  }

  get value(): Date {
    return new Date(this._value);
  }

  static create(value: Date | string): Result<Error, Data> {
    try {
      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return left(new Error('Data inválida'));
      }

      if (date.getTime() > Date.now()) {
        return left(new Error('Data não pode ser futura'));
      }

      return right(new Data(date));
    } catch {
      return left(new Error('Formato de data inválido'));
    }
  }

  toISOString(): string {
    return this._value.toISOString();
  }

  formatPtBr(): string {
    return this._value.toLocaleDateString('pt-BR');
  }

  equals(other: Data): boolean {
    return this._value.getTime() === other._value.getTime();
  }
}
