import { ObjectOps, ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ObjectOps<A> {
    toArray: typeof toArray
  }
}

/**
 * Converts this object to an Array of tuples.
 */
export function toArray<K extends string, V>(this: ObjectOps<Record<K, V>>): ArrayOps<[K, V]> {
  const obj = this.value(), result = [] as [K, V][]

  Object.keys(obj).forEach((key: K) => {
    result.push([key, obj[key]])
  })

  return new ArrayOps(result)
}

ObjectOps.prototype.toArray = toArray
