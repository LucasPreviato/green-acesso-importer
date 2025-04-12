import { left, right, Result } from '../../../shared/result';

export class Valor {
  private constructor(private readonly value: number) {}

  static create(value: number): Result<Error, Valor> {
    if (value <= 0) {
      return left(new Error('Valor do boleto deve ser maior que zero'));
    }

    return right(new Valor(value));
  }

  toNumber(): number {
    return this.value;
  }
}
