import { Option } from 'option.ts'
import { ArrayOps } from '../'

declare module '../' {
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
