import { Option, None } from '../option'
import lift, { ArrayOps, ObjectOps, NumberOps, StringOps, BoolOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    fold: typeof fold
  }
}

// All these overloads are here so that we return the proper Wrapper and can continue to chain.
export function fold<A>(this: ArrayOps<A>, startValue: number, func: (acc: number, value: A, index: number) => number): NumberOps
export function fold<A>(this: ArrayOps<A>, startValue: string, func: (acc: string, value: A, index: number) => string): StringOps
export function fold<A>(this: ArrayOps<A>, startValue: boolean, func: (acc: boolean, value: A, index: number) => boolean): BoolOps
export function fold<A, B>(this: ArrayOps<A>, startValue: B[], func: (acc: B[], value: A, index: number) => B[]): ArrayOps<B>
export function fold<A, B>(this: ArrayOps<A>, startValue: B, func: (acc: B, value: A, index: number) => B): ObjectOps<B>

/**
 * Folds this Array into a single value, using a starting value.
 */
export function fold<A>(this: ArrayOps<A>, startValue: any, func: (acc: any, value: A, index: number) => any): any {
  let arr = this.value(), result = startValue

  for (let i = 0; i < arr.length; i++) {
    result = func(result, arr[i], i)
  }

  return lift(result)
}

ArrayOps.prototype.fold = fold
