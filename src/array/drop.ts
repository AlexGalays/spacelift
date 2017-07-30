import { ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ArrayOps<A> {
    drop: typeof drop
  }
}

/**
 * Drops the first 'count' items from this Array.
 */
export function drop<A>(this: ArrayOps<A>, count: number): ArrayOps<A> {
  return new ArrayOps(this.value().slice(count))
}


ArrayOps.prototype.drop = drop
