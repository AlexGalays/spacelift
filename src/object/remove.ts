import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    remove: typeof remove
  }
}

export type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
export type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] }

/**
 * Removes a key/value from this heterogeneous object.
 * To remove a (nullable) key from an object while preserving its type, use "update()" instead.
 * To remove a key from a homogeneous key/value object, use "dissoc" instead.
 */
export function remove<A, K extends keyof A, V>(this: ObjectOps<A>, keyToRemove: K): ObjectOps<Omit<A, K>> {
  const obj = this.value()
  const keyToRemoveStr = keyToRemove.toString()
  const result = {}
  Object.keys(obj).forEach(key => { if (key !== keyToRemoveStr) result[key] = obj[key] })
  return new ObjectOps(result) as any
}

ObjectOps.prototype.remove = remove
