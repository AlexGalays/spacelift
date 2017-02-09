import { Option, None } from 'option.ts'
import { ArrayOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    find: typeof find
  }
}

/**
 * Finds the first item in this Array satisfying a predicate.
 */
export function find<A>(this: ArrayOps<A>, predicate: (item: A, index: number) => boolean): Option<A> {
  const arr = this.value()

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (predicate(item, i)) return Option(item)
  }

  return None
}


ArrayOps.prototype.find = find
