import { Option } from '../option'
import { ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ArrayOps<A> {
    flatten: typeof flatten
  }
}

/**
 * Flattens this Array of Arrays/Options.
 */
export function flatten<A, B>(this: ArrayOps<A[] | Option<A>>): ArrayOps<A> {
  const arr = this.value(), result: A[] = []

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    if (Option.isOption(item))
      item.isDefined() && result.push(item.get())
    else
      result.push.apply(result, item)
  }

  return new ArrayOps(result)
}

ArrayOps.prototype.flatten = flatten
