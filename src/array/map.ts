import { ArrayOps, Wrapper, getValue } from '../wrapper'


declare module '../wrapper' {
  interface ArrayOps<A> {
    map: typeof map
  }
}


export function map<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => B | Wrapper<B>): ArrayOps<B>
export function map<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => B): ArrayOps<B>

/**
 * Maps this Array using a mapper function.
 */
export function map<A, B>(this: ArrayOps<A>, fun: (item: A, index: number) => B | Wrapper<B>): ArrayOps<B> {
  const arr = this.value(), result = []

  for (let i = 0; i < arr.length; i++) {
    result[i] = getValue(fun(arr[i], i))
  }

  return new ArrayOps(result)
}

ArrayOps.prototype.map = map
