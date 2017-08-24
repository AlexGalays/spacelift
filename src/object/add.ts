import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    add: typeof add
  }
}

/**
 * Adds a key/value to this heterogeneous object.
 * To add a (nullable) key to an object while preserving its type, use "update()" instead.
 * To add a key to a homogeneous key/value object, use "assoc" instead.
 */
export function add<A, K extends string, V>(this: ObjectOps<A>, key: K, value: V): ObjectOps<A & { [P in K]: V }> {
  const obj = this.value(), result: any = {}
  Object.keys(obj).forEach(key => { result[key] = obj[key] })
  result[key] = value
  return new ObjectOps(result)
}

ObjectOps.prototype.add = add



//export function add<A, K extends string, V>(this: ObjectOps<A>, key: K, value: V): ObjectOps<A & Record<K, V>> {