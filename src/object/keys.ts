import { ObjectOps, ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    keys: typeof keys
  }
}

/**
 * Creates an Array of all this object's keys, in no particular order.
 */
export function keys<K extends string, V, W>(this: ObjectOps<Record<K, V>>): ArrayOps<K> {
  return new ArrayOps(Object.keys(this.value()) as K[])
}

ObjectOps.prototype.keys = keys
