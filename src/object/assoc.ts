import { ObjectOps } from '../lift'
import { add } from './add'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    assoc: typeof assoc
  }
}

// Fake function body just to get TSDoc on augmented interface :(
/**
 * Adds a key/value to this homogeneous key/value object.
 * To add a (nullable) key to an object while preserving its type, use "update()" instead.
 * To add a key to an object and create a new type, use "add()"
 */
export function assoc<K extends string, V>(this: ObjectOps<Record<K, V>>, key: K, value: V): ObjectOps<Record<K, V>> {
  return {} as any
}


ObjectOps.prototype.assoc = add as any