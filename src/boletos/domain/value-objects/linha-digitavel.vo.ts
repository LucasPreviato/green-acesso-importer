import { left, right, Result } from '../../../shared/result';

export class LinhaDigitavel {
  private constructor(private readonly value: string) {}

  static create(value: string): Result<Error, LinhaDigitavel> {
    if (!/^\d{18,47}$/.test(value)) {
      return left(new Error('Linha digitável inválida (esperado 47 dígitos)'));
    }

    return right(new LinhaDigitavel(value));
  }

  toString(): string {
    return this.value;
  }
}
