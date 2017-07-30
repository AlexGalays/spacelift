import { Option, None } from '../option'
import { ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ArrayOps<A> {
    findIndex: typeof findIndex
  }
}

/**
 * Finds the first item index in this Array satisfying a predicate.
 */
export function findIndex<A>(this: ArrayOps<A>, predicate: (item: A, index: number) => boolean): Option<number> {
  const arr = this.value()

  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) return Option(i)
  }

  return None
}


ArrayOps.prototype.findIndex = findIndex
