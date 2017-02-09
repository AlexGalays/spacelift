import { ObjectOps } from '../'

declare module '../' {
  interface ObjectOps<A> {
    Set: typeof Set
  }
}

/**
 * Creates a Set-like object (string keys, true values) from a list of keys
 */
export default function Set<K extends string>(...keys: K[]): ObjectOps<Record<K, boolean>> {
  const result = {} as Record<K, boolean>
  keys.forEach(key => result[key] = true)
  return new ObjectOps(result)
}

ObjectOps.prototype.Set = Set
