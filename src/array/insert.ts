import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    insert: typeof insert
  }
}

/**
 * Insert an item at a specified index.
 */
export function insert<A>(this: ArrayOps<A>, index: number, item: A): ArrayOps<A> {
  const result = this.value().slice()
  result.splice(index, 0, item)
  return new ArrayOps(result)
}

ArrayOps.prototype.insert = insert
