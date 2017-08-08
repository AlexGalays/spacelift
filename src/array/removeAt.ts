import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    removeAt: typeof removeAt
  }
}

/**
 * Removes the item found at the specified index.
 */
export function removeAt<A>(this: ArrayOps<A>, index: number): ArrayOps<A> {
  const result = this.value().slice()
  result.splice(index, 1)
  return new ArrayOps(result)
}

ArrayOps.prototype.removeAt = removeAt
