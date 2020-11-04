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
  ? MapWrapper<K, V>
  : T extends ReadonlySet<infer E>
  ? SetWrapper<E>
  : T extends object
  ? ObjectWrapper<T>
  : never

interface Lift {
  <T>(obj: ArrayWrapper<ReadonlyArray<T>>): ArrayWrapper<ReadonlyArray<T>>
  <T extends object>(obj: ObjectWrapper<T>): ObjectWrapper<T>
  <K, V>(obj: MapWrapper<K, V>): MapWrapper<K, V>
  <T>(obj: SetWrapper<T>): SetWrapper<T>

  /** lift won't wrap primitives */
  <T extends AtomicObject>(obj: T): T

  /** Wraps an Array to provide a richer API. Unwrap with .value() **/
  <T>(obj: T[]): ArrayWrapper<T[]>
  <T>(obj: ReadonlyArray<T>): ArrayWrapper<ReadonlyArray<T>>

  /** Wraps a Set to provide a richer API. Unwrap with .value() **/
  <T>(obj: ReadonlySet<T>): SetWrapper<T>

  /** Wraps a Map to provide a richer API. Unwrap with .value() **/
  <K, V>(obj: ReadonlyMap<K, V>): MapWrapper<K, V>

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
