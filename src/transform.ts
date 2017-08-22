import lift, { ArrayOps, ObjectOps, NumberOps, StringOps, DateOps, BoolOps, Wrapper, getValue } from './lift'

declare module '../wrapper' {
  interface ArrayOps<A> {
    transform: typeof transform
  }
}

declare module '../wrapper' {
  interface ObjectOps<A> {
    transform: typeof transform
  }
}

declare module '../wrapper' {
  interface NumberOps {
    transform: typeof transform
  }
}

declare module '../wrapper' {
  interface StringOps {
    transform: typeof transform
  }
}

declare module '../wrapper' {
  interface DateOps {
    transform: typeof transform
  }
}

declare module '../wrapper' {
  interface BoolOps {
    transform: typeof transform
  }
}

/**
 * Runs an arbitrary function to transform this wrapper into a Number wrapper
 */
export function transform<A>(this: Wrapper<A>, func: (source: A) => number): NumberOps
/**
 * Runs an arbitrary function to transform this wrapper into a number wrapper
 */
export function transform<A>(this: Wrapper<A>, func: (source: A) => NumberOps): NumberOps

/**
 * Runs an arbitrary function to transform this wrapper into a string wrapper
 */
export function transform<A>(this: Wrapper<A>, func: (source: A) => string): StringOps
/**
 * Runs an arbitrary function to transform this wrapper into a string wrapper
 */
export function transform<A>(this: Wrapper<A>, func: (source: A) => StringOps): StringOps

/**
 * Runs an arbitrary function to transform this wrapper into a boolean wrapper
 */
export function transform<A>(this: Wrapper<A>, func: (source: A) => boolean): BoolOps
/**
 * Runs an arbitrary function to transform this wrapper into a boolean wrapper
 */
export function transform<A>(this: Wrapper<A>, func: (source: A) => BoolOps): BoolOps

/**
 * Runs an arbitrary function to transform this wrapper into a date wrapper
 */
export function transform<A>(this: Wrapper<A>, func: (source: A) => Date): DateOps
/**
 * Runs an arbitrary function to transform this wrapper into a date wrapper
 */
export function transform<A>(this: Wrapper<A>, func: (source: A) => DateOps): DateOps

/**
 * Runs an arbitrary function to transform this wrapper into a array wrapper
 */
export function transform<A, B>(this: Wrapper<A>, func: (source: A) => B[]): ArrayOps<B>
/**
 * Runs an arbitrary function to transform this wrapper into a array wrapper
 */
export function transform<A, B>(this: Wrapper<A>, func: (source: A) => ArrayOps<B>): ArrayOps<B>

/**
 * Runs an arbitrary function to transform this wrapper into an object wrapper
 */
export function transform<A, B>(this: Wrapper<A>, func: (source: A) => B): ObjectOps<B>
/**
 * Runs an arbitrary function to transform this wrapper into an object wrapper
 */
export function transform<A, B>(this: Wrapper<A>, func: (source: A) => ObjectOps<B>): ObjectOps<B>


export function transform<A>(this: Wrapper<A>, func: (source: any) => any): any {
  return lift(getValue(func(this.value())))
}

NumberOps.prototype.transform = transform
StringOps.prototype.transform = transform
BoolOps.prototype.transform = transform
ArrayOps.prototype.transform = transform
ObjectOps.prototype.transform = transform
DateOps.prototype.transform = transform