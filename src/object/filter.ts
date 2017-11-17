import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    filter: typeof filter
  }
}

/**
 * Filter keys/values of a "Map" object
 */
export function filter<K extends string, V>(this: ObjectOps<Record<K, V>>, predicate: (key: K, value: V) => boolean): ObjectOps<Record<K, V>> {
  const obj = this.value(), result = {} as Record<K, V>

  (Object.keys(obj) as K[]).forEach(key => {
    const value = obj[key]
    if (predicate(key, value)) result[key] = value
  })

  return new ObjectOps(result)
}

ObjectOps.prototype.filter = filter
