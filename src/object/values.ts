import { ObjectOps, ArrayOps } from '../wrapper'

declare module '../wrapper' {
  interface ObjectOps<A> {
    values: typeof values
  }
}

/**
 * Creates an Array of all this object's values.
 */
export function values<K extends string, V, W>(this: ObjectOps<Record<K, V>>): ArrayOps<V> {
  const obj = this.value(), result = [] as V[]

  Object.keys(obj).forEach((key: K) => {
    result.push(obj[key])
  })

  return new ArrayOps(result)
}

ObjectOps.prototype.values = values
