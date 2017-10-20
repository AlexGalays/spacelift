import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    isEmpty: typeof isEmpty
  }
}

/**
 * Returns whether this object contains no keys.
 */
export function isEmpty<A, K extends keyof A>(this: ObjectOps<{}>): boolean {
  return Object.keys(this.value()).length === 0
}

ObjectOps.prototype.isEmpty = isEmpty
