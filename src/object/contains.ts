import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    contains: typeof contains
  }
}

/**
 * Returns whether this object contains a specific key.
 */
export function contains<A, K extends keyof A>(this: ObjectOps<{}>, key: string): boolean {
  return this.value().hasOwnProperty(key)
}

ObjectOps.prototype.contains = contains
