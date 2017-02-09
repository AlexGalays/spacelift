import { ArrayOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    reverse: typeof reverse
  }
}

/**
 * Reverses the Array.
 */
export function reverse<A>(this: ArrayOps<A>): ArrayOps<A> {
  return new ArrayOps(this.value().reverse())
}


ArrayOps.prototype.reverse = reverse
