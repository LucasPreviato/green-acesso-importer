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
  }
  
  export type Result<L, R> = Left<L> | Right<R>;
  
  export const left = <L>(l: L): Result<L, never> => new Left(l);
  export const right = <R>(r: R): Result<never, R> => new Right(r);
  