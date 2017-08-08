import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    appendAll: typeof appendAll
  }
}

/**
 * Appends an Array of items at the end of the Array.
 */
export function appendAll<A>(this: ArrayOps<A>, items: A[]): ArrayOps<A> {
  return new ArrayOps(this.value().concat(items))
}


ArrayOps.prototype.appendAll = appendAll
