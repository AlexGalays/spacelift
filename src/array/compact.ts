import { ArrayOps } from '../'
import { filter } from './filter'

declare module '../' {
  interface ArrayOps<A> {
    compact: typeof compact
  }
}

/**
 * Filters all the falsy elements out of this Array.
 * All occurences of false, null, undefined, 0, "" will be removed.
 */
export function compact<A>(this: ArrayOps<A | false | null | undefined | 0 | ''>): ArrayOps<A> {
  return this.filter(x => !!x) as ArrayOps<A>
}


ArrayOps.prototype.compact = compact
