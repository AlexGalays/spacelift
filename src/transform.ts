import lift, { ArrayOps, ObjectOps, NumberOps, StringOps, BoolOps, Wrapper } from './wrapper'

declare module './wrapper' {
  interface ArrayOps<A> {
    transform: typeof transform
  }
}

declare module './wrapper' {
  interface ObjectOps<A> {
    transform: typeof transform
  }
}

declare module './wrapper' {
  interface NumberOps {
    transform: typeof transform
  }
}

declare module './wrapper' {
  interface StringOps {
    transform: typeof transform
  }
}

declare module './wrapper' {
  interface BoolOps {
    transform: typeof transform
  }
}


export function transform<A>(this: Wrapper<A>, func: (source: A) => number): NumberOps
export function transform<A>(this: Wrapper<A>, func: (source: A) => string): StringOps
export function transform<A>(this: Wrapper<A>, func: (source: A) => boolean): BoolOps
export function transform<A, B>(this: Wrapper<A>, func: (source: A) => B[]): ArrayOps<B>
export function transform<A, B>(this: Wrapper<A>, func: (source: A) => B): ObjectOps<B>

/**
 * Runs an arbitrary transformation.
 */
export function transform<A>(this: Wrapper<A>, func: (source: any) => any): any {
  return lift(func(this.value()))
}

NumberOps.prototype.transform = transform
StringOps.prototype.transform = transform
BoolOps.prototype.transform = transform
ArrayOps.prototype.transform = transform
ObjectOps.prototype.transform = transform
