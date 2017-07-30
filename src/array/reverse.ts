import { ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ArrayOps<A> {
    reverse: typeof reverse
  }
}

/**
 * Reverses the Array.
 */
export function reverse<A>(this: ArrayOps<A>): ArrayOps<A> {
  return new ArrayOps(this.value().slice().reverse())
}


ArrayOps.prototype.reverse = reverse
