import { ObjectOps, ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    toArray: typeof toArray
  }
}

/**
 * Converts this object to an Array of tuples.
 */
export function toArray<K extends string, V>(this: ObjectOps<Record<K, V>>): ArrayOps<[K, V]> {
  const obj = this.value(), result = [] as [K, V][]

  (Object.keys(obj) as K[]).forEach(key => {
    result.push([key, obj[key]])
  })

  return new ArrayOps(result)
}

ObjectOps.prototype.toArray = toArray
