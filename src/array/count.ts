import { ArrayOps, NumberOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    count: typeof count
  }
}

/**
 * Counts the items satisfying a predicate.
 */
export function count<A>(this: ArrayOps<A>, predicate: (item: A, index: number) => boolean): NumberOps {
  let arr = this.value(), result = 0

  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) result++
  }

  return new NumberOps(result)
}


ArrayOps.prototype.count = count
