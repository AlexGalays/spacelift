import { pipe } from './lift'
export { lift } from './lift'

export { update } from './immupdate'
export { range } from './array'
export { createUnion, empty } from './union'
export { createEnum } from './enum'
export { identity, noop } from './function'

import * as isType from './is'
export const is = isType

import { setArrayPipe } from './array'
import { setObjectPipe } from './object'
import { setMapPipe } from './map'
import { setSetPipe } from './set'

setArrayPipe(pipe)
setObjectPipe(pipe)
setMapPipe(pipe)
setSetPipe(pipe)

export function immutable<T>(obj: T): Immutable<T> {
  return obj as any
}

export type Immutable<T> = T extends ImmutablePrimitive
  ? T
  : T extends Array<infer U>
  ? ImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? ImmutableMap<K, V>
  : T extends Set<infer M>
  ? ImmutableSet<M>
  : ImmutableObject<T>

type ImmutablePrimitive = undefined | null | boolean | string | number | Function
type ImmutableArray<T> = ReadonlyArray<Immutable<T>>
type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>
type ImmutableSet<T> = ReadonlySet<Immutable<T>>
type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> }
