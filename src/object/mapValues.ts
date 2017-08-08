import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    mapValues: typeof mapValues
  }
}

/**
 * Maps all the values of this object.
 */
export function mapValues<K extends string, V, W>(this: ObjectOps<Record<K, V>>, mapper: (key: K, value: V) => W): ObjectOps<Record<K, W>> {
  const obj = this.value(), result = {} as Record<K, W>

  Object.keys(obj).forEach((key: K) => {
    const value = mapper(key, obj[key])
    result[key] = value
  })

  return new ObjectOps(result)
}

ObjectOps.prototype.mapValues = mapValues
