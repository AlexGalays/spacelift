import { Option } from '../option'
import { ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ObjectOps<A> {
    get: typeof get
  }
}

/**
 * Returns the value found at the provided key, as an Option.
 * Usage 1: read a value from a "Map" object
 * Usage 2: read an optional value from a domain object
 */
export function get<A, K extends keyof A>(this: ObjectOps<OptionalMap<A>>, key: K): Option<A[K]> {
  return Option(this.value()[key])
}

/* This type is used to remove all null/undefined values from the passed Object's values,
   as an Option type parameter doesn't deal with these values since they were filtered out by the Option constructor. */
export type OptionalMap<T> = {
  [P in keyof T]: T[P] | undefined | null
}

ObjectOps.prototype.get = get
