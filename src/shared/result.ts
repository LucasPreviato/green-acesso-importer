export class Left<L> {
    readonly value: L;
  
    constructor(value: L) {
      this.value = value;
    }
  
    isLeft(): this is Left<L> {
      return true;
    }
  
    isRight(): this is Right<any> {
      return false;
    }
  }
  
  export class Right<R> {
    readonly value: R;
  
    constructor(value: R) {
      this.value = value;
    }
  
    isLeft(): this is Left<any> {
      return false;
    }
  
    isRight(): this is Right<R> {
      return true;
    }
  
    map<T>(fn: (value: R) => T): Result<any, T> {
      return right(fn(this.value));
    }
  
    flatMap<L, T>(fn: (value: R) => Result<L, T>): Result<L, T> {
      return fn(this.value);
    }
  }
  
  export type Result<L, R> = Left<L> | Right<R>;
  
  export const left = <L>(l: L): Result<L, never> => new Left(l);
  export const right = <R>(r: R): Result<never, R> => new Right(r);
  
  export namespace Result {
    export function combine<L, R>(results: Result<L, R>[]): Result<L, R[]> {
      const values: R[] = [];
  
      for (const result of results) {
        if (result instanceof Left) {
          return left(result.value as L);
        }
        values.push(result.value as R);
      }
  
      return right(values);
    }
  }
  