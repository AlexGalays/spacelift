import { Option } from '../option'
import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    first: typeof first
  }
}

/**
 * Returns the first item of this Array, as an Option.
 */
export function first<A>(this: ArrayOps<A>): Option<A> {
  return Option(this.value()[0])
}


ArrayOps.prototype.first = first
