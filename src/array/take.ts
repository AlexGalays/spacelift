import { ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ArrayOps<A> {
    take: typeof take
  }
}

/**
 * Takes the first 'count' items from this Array.
 */
export function take<A>(this: ArrayOps<A>, count: number): ArrayOps<A> {
  return new ArrayOps(this.value().slice(0, count))
}


ArrayOps.prototype.take = take
