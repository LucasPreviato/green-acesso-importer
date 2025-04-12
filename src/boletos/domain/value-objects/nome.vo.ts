import { Result, left, right } from '../../../shared/result';

export class Nome {
  private constructor(private readonly _value: string) {
    Object.freeze(this);
  }

  static create(value: string): Result<Error, Nome> {
    if (!value || value.trim().length === 0) {
      return left(new Error('Nome não pode ser vazio'));
    }

    const trimmed = value.trim();

    if (trimmed.length < 3) {
      return left(new Error('Nome deve ter pelo menos 3 caracteres'));
    }

    if (trimmed.length > 100) {
      return left(new Error('Nome deve ter no máximo 100 caracteres'));
    }

    // if (!/^[A-Za-zÀ-ÿ\s]+$/.test(trimmed)) {
    //   return left(new Error('Nome deve conter apenas letras'));
    // }

    return right(new Nome(trimmed));
  }

  get value(): string {
    return this._value;
  }

  equals(other: Nome): boolean {
    return this._value === other._value;
  }
}
