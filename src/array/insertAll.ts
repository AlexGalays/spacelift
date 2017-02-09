import { ArrayOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    insertAll: typeof insertAll
  }
}

/**
 * Insert an Array of items at a specified index.
 */
export function insertAll<A>(this: ArrayOps<A>, index: number, items: A[]): ArrayOps<A> {
  const result = this.value().slice()
  result.splice(index, 0, ...items)
  return new ArrayOps(result)
}

ArrayOps.prototype.insertAll = insertAll
