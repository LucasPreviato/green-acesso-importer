import { Result, left, right } from '../../../shared/result';

export class Lote {
  private constructor(
    public readonly id: number,
    public readonly nome: string,
  ) {
    Object.freeze(this);
  }

  static create(id: number, nome: string): Result<Error, Lote> {
    if (!id || id <= 0) return left(new Error('ID de lote inválido'));
    if (!nome || nome.trim().length < 2) return left(new Error('Nome de lote inválido'));

    return right(new Lote(id, nome.trim()));
  }

  equals(other: Lote): boolean {
    return this.id === other.id;
  }
}
