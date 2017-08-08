import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    append: typeof append
  }
}

/**
 * Appends one item at the end of the Array.
 */
export function append<A>(this: ArrayOps<A>, item: A): ArrayOps<A> {
  return new ArrayOps(this.value().concat(item))
}

ArrayOps.prototype.append = append
