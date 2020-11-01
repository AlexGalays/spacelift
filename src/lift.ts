import { ArrayWrapper } from './array'
import { MapWrapper } from './map'
import { ObjectWrapper } from './object'
import { SetWrapper } from './set'
import * as is from './is'

export type Lifted<T> = T extends Wrapper<infer W> ? LiftedValue<W> : LiftedValue<T>

type AtomicObject = Function | Promise<any> | Date | RegExp | Boolean | Number | String

type LiftedValue<T> = T extends AtomicObject
  ? T
  : T extends ReadonlyArray<infer E>
  ? ArrayWrapper<E>
  : T extends ReadonlyMap<infer K, infer V>
  ? MapWrapper<K, V>
  : T extends ReadonlySet<infer E>
  ? SetWrapper<E>
  : T extends Date
  ? Wrapper<Date>
  : T extends string
  ? Wrapper<string>
  : T extends number
  ? Wrapper<number>
  : T extends boolean
  ? Wrapper<boolean>
  : T extends object
  ? ObjectWrapper<T>
  : never

/** Wraps an Object, Array, Map or Set to provide a richer API. Unwrap with .value() **/
type Lift = <T>(obj: T) => Lifted<T>

const lift: Lift = function (obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (isWrapper(obj)) return obj
  if (is.object(obj)) return new ObjectWrapper(obj)
  if (obj instanceof Array) return new ArrayWrapper(obj)
  if (obj instanceof Map) return new MapWrapper(obj)
  if (obj instanceof Set) return new SetWrapper(obj)
  return obj
}

export default lift

export function getValue<A>(input: A | Wrapper<A>): A {
  return isWrapper(input) ? input.value() : input
}

function isWrapper<A>(obj: A | Wrapper<A>): obj is Wrapper<A> {
  return obj && (obj as any)['_isLiftWrapper']
}

export interface Wrapper<T> {
  value(): T
}

export function pipe<T, R>(this: Wrapper<T>, func: (object: T) => R): Lifted<R> {
  return lift(func(this.value()))
}
