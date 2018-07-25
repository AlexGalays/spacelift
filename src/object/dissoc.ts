import { ObjectOps } from '../lift'
import { remove } from './remove'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    dissoc: typeof dissoc
  }
}

// Fake function body just to get TSDoc on augmented interface :(
/**
 * Removes a key/value from this homogeneous key/value object.
 * To remove a (nullable) key from an object while preserving its type, use "update()" instead.
 * To remove a key from an object and create a new type, use "remove()"
 */
export function dissoc<K extends string | number | symbol, V>(this: ObjectOps<Record<K, V>>, key: K): ObjectOps<Record<K, V>> {
  return {} as any
}


ObjectOps.prototype.dissoc = remove as any