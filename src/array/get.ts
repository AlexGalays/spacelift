import { Option } from '../option'
import { ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ArrayOps<A> {
    get: typeof get
  }
}

/**
 * Returns the item found at the provided index, as an Option.
 */
export function get<A>(this: ArrayOps<A>, index: number): Option<A> {
  return Option(this.value()[index])
}


ArrayOps.prototype.get = get
