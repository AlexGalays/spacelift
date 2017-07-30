import { ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ArrayOps<A> {
    dropRight: typeof dropRight
  }
}

/**
 * Drops the last 'count' items from this Array.
 */
export function dropRight<A>(this: ArrayOps<A>, count: number): ArrayOps<A> {
  return new ArrayOps(this.value().slice(0, -count))
}


ArrayOps.prototype.dropRight = dropRight
