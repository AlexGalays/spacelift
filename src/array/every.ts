import { ArrayOps, BoolOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    every: typeof every
  }
}

/**
 * Returns whether all items satisfies the predicate.
 */
export function every<A>(this: ArrayOps<A>, predicate: (item: A, index: number) => boolean): BoolOps {
  const arr = this.value()

  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i)) return new BoolOps(false)
  }

  return new BoolOps(true)
}


ArrayOps.prototype.every = every
