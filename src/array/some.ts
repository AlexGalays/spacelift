import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    some: typeof some
  }
}

/**
 * Returns whether at least one item satisfies the predicate.
 */
export function some<A>(this: ArrayOps<A>, predicate: (item: A, index: number) => boolean): boolean {
  const arr = this.value()

  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) return true
  }

  return false
}


ArrayOps.prototype.some = some
