import { ArrayOps, BoolOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    some: typeof some
  }
}

/**
 * Returns whether at least one item satisfies the predicate.
 */
export function some<A>(this: ArrayOps<A>, predicate: (item: A, index: number) => boolean): BoolOps {
  const arr = this.value()

  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) return new BoolOps(true)
  }

  return new BoolOps(false)
}


ArrayOps.prototype.some = some
