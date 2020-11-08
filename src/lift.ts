import { ArrayWrapper } from './array'
import { MapWrapper } from './map'
import { ObjectWrapper } from './object'
import { SetWrapper } from './set'
import { Wrapper, isWrapper } from './wrapper'
import * as is from './is'

export type Lifted<T> = undefined extends T
  ? never
  : null extends T
  ? never
  : T extends Wrapper<infer W>
  ? LiftedValue<W>
  : LiftedValue<T>

type AtomicObject = Function | Promise<any> | Date | RegExp | Boolean | Number | String

type LiftedValue<T> = null extends T
  ? never
  : undefined extends T
  ? never
  : T extends AtomicObject
  ? T
  : T extends ReadonlyArray<any>
  ? ArrayWrapper<T>
  : T extends ReadonlyMap<infer K, infer V>
  ? MapWrapper<K, V, T>
  : T extends ReadonlySet<infer E>
  ? SetWrapper<E, T>
  : T extends object
  ? ObjectWrapper<T>
  : never

interface Lift {
  <T>(obj: ArrayWrapper<ReadonlyArray<T>>): ArrayWrapper<ReadonlyArray<T>>
  <T extends object>(obj: ObjectWrapper<T>): ObjectWrapper<T>
  <K, V, M extends ReadonlyMap<K, V>>(obj: MapWrapper<K, V, M>): MapWrapper<K, V, M>
  <T, S extends ReadonlySet<T>>(obj: SetWrapper<T, S>): SetWrapper<T, S>

  /** lift won't wrap primitives and some other non container-like objects */
  <T extends AtomicObject>(obj: T): T

  /** Wraps an Array to provide a richer API. Unwrap with .value() **/
  <T>(obj: T[]): ArrayWrapper<T[]>
  /** Wraps a readonly Array to provide a richer API. Unwrap with .value() **/
  <T>(obj: ReadonlyArray<T>): ArrayWrapper<ReadonlyArray<T>>

  /** Wraps a Map to provide a richer API. Unwrap with .value() **/
  <K, V>(obj: Map<K, V>): MapWrapper<K, V, Map<K, V>>
  /** Wraps a readonly Map to provide a richer API. Unwrap with .value() **/
  <K, V>(obj: ReadonlyMap<K, V>): MapWrapper<K, V, ReadonlyMap<K, V>>

  /** Wraps a Set to provide a richer API. Unwrap with .value() **/
  <T>(obj: Set<T>): SetWrapper<T, Set<T>>
  /** Wraps a readonly Set to provide a richer API. Unwrap with .value() **/
  <T>(obj: ReadonlySet<T>): SetWrapper<T, ReadonlySet<T>>

  /** Wraps an Object to provide a richer API. Unwrap with .value() **/
  <T extends object>(obj: T): ObjectWrapper<T>
}

export const lift: Lift = function (obj: any): any {
  if (isWrapper(obj)) return obj
  if (is.object(obj)) return new ObjectWrapper(obj)
  if (obj instanceof Array) return new ArrayWrapper(obj)
  if (obj instanceof Map) return new MapWrapper(obj)
  if (obj instanceof Set) return new SetWrapper(obj)
  return obj
}

export type Pipe = typeof pipe

export function pipe<T, R>(this: Wrapper<T>, func: (object: T) => R): Lifted<R> {
  return lift(func(this.value()) as any)
}
