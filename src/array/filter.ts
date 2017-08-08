import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    filter: typeof filter
  }
}

/**
 * Filters this array by aplying a predicate to all items.
 */
export function filter<A>(this: ArrayOps<A>, predicate: (item: A, index: number) => boolean): ArrayOps<A> {
  const arr = this.value(), result = []

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (predicate(item, i)) result.push(item)
  }

  return new ArrayOps(result)
}


ArrayOps.prototype.filter = filter
