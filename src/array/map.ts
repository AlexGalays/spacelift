import { ArrayOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    map: typeof map
  }
}

/**
 * Maps this Array using a mapper function.
 */
export function map<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => B): ArrayOps<B> {
  const arr = this.value(), result = []

  for (let i = 0; i < arr.length; i++) {
    result[i] = fun(arr[i], i)
  }

  return new ArrayOps(result)
}

ArrayOps.prototype.map = map
