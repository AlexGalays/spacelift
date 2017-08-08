import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    add: typeof add
  }
}

/**
 * Adds a key/value to this "Map" object.
 * To update an object while preserving its type, use "update()" instead.
 */
export function add<K extends string, V>(this: ObjectOps<Record<K, V>>, key: K, value: V): ObjectOps<Record<K, V>> {
  const obj = this.value(), result: any = {}
  Object.keys(obj).forEach((key: K) => { result[key] = obj[key] })
  result[key] = value
  return new ObjectOps(result)
}

ObjectOps.prototype.add = add
