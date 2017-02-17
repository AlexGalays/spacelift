import { Option } from 'option.ts'
import { ArrayOps, Wrapper, getValue } from '../'

declare module '../' {
  interface ArrayOps<A> {
    flatMap: typeof flatMap
  }
}

/**
 * Maps this Array to an Array of Array | Option | Wrapper using a mapper function then flattens it.
 */
export function flatMap<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => B[] | Option<B> | Wrapper<B[]>): ArrayOps<B> {
  const arr = this.value(), result = []

  for (let i = 0; i < arr.length; i++) {
    const item = fun(arr[i], i)

    if (Option.isOption(item))
      item.isDefined() && result.push(item())
    else
      result.push.apply(result, getValue(item))
  }

  return new ArrayOps(result)
}

ArrayOps.prototype.flatMap = flatMap
