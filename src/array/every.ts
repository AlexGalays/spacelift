import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    every: typeof every
  }
}

/**
 * Returns whether all items satisfies the predicate.
 */
export function every<A>(this: ArrayOps<A>, predicate: (item: A, index: number) => boolean): boolean {
  const arr = this.value()

  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i)) return false
  }

  return true
}


ArrayOps.prototype.every = every
