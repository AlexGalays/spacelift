import { Option } from '../option'
import { ArrayOps, getValue } from '../lift'


declare module '../../wrapper' {
  interface ArrayOps<A> {
    flatMap: typeof flatMap
  }
}

/**
 * Maps this Array to an Array of Array | Option | ArrayOps using a mapper function then flattens it.
 */
export function flatMap<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => B[]): ArrayOps<B>

/**
 * Maps this Array to an Array of Array | Option | ArrayOps using a mapper function then flattens it.
 */
export function flatMap<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => ArrayOps<B>): ArrayOps<B>

/**
 * Maps this Array to an Array of Array | Option | ArrayOps using a mapper function then flattens it.
 */
export function flatMap<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => Option<B>): ArrayOps<B>

/**
 * Maps this Array to an Array of Array | Option | ArrayOps using a mapper function then flattens it.
 */
export function flatMap<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => B[] | Option<B> | ArrayOps<B>): ArrayOps<B> {
  const arr = this.value(), result = []

  for (let i = 0; i < arr.length; i++) {
    const item = fun(arr[i], i)

    if (Option.isOption(item))
      item.isDefined() && result.push(item.get())
    else
      result.push.apply(result, getValue(item))
  }

  return new ArrayOps(result)
}

ArrayOps.prototype.flatMap = flatMap
