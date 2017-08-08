import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    remove: typeof remove
  }
}

/**
 * Returns an Object where the given keys are removed.
 * To delete a nullable key from an object while preserving its type, use "update()"
 */
export function remove<K extends string, V>(this: ObjectOps<Record<K, V>>, ...keys: K[]): ObjectOps<Record<K, V>> {
  const obj = this.value(), result = {} as Record<K, V>
  Object.keys(obj).forEach((key: K) => { if (keys.indexOf(key) === -1) result[key] = obj[key] })
  return new ObjectOps(result)
}

ObjectOps.prototype.remove = remove
