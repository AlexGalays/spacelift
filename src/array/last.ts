import { Option } from '../option'
import { ArrayOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    last: typeof last
  }
}

/**
 * Returns the last item of this Array, as an Option.
 */
export function last<A>(this: ArrayOps<A>): Option<A> {
  const arr = this.value()
  return Option(arr[arr.length - 1])
}


ArrayOps.prototype.last = last
