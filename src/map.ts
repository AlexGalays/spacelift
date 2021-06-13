import { ObjectWrapper } from './object'
import type { Pipe } from './lift'
import { Draft, NoReturn, AtomicObject, update } from './immupdate'

/** A Map wrapper providing extra functionalities and more chaining opportunities */
export class MapWrapper<K, V, M extends ReadonlyMap<K, V>> {
  constructor(private _value: M) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }

  private _clone() {
    return new Map(this._value)
  }

  /**
   * Sets a new key/value.
   */
  set(key: K, value: V) {
    return new MapWrapper(this._clone().set(key, value))
  }

  /**
   * Deletes a key/value.
   */
  delete(key: K) {
    const result = this._clone()
    result.delete(key)
    return new MapWrapper(result)
  }

  /**
   * Maps this Map's keys and values, unless void or undefined is returned, in which case the entry is filtered.
   * This is effectively a filter + map combined in one.
   */
  collect<KK, VV>(
    iterator: (key: K, value: V) => [KK, VV] | undefined | void
  ): MapWrapper<KK, VV, MapOf<M, KK, VV>> {
    const result = new Map<KK, VV>()

    this._value.forEach((value, key) => {
      const res = iterator(key, value)
      if (res !== undefined) result.set(res[0], res[1])
    })
    return new MapWrapper(result) as any
  }

  /**
   * Filters this Map's keys and values by aplying a predicate to all values and refine its type.
   */
  filter<VV extends V>(predicate: (key: K, value: V) => value is VV): MapWrapper<K, VV, MapOf<M, K, VV>>
  /**
   * Filters this Map's keys and values.
   */
  filter(predicate: (key: K, value: V) => boolean): this
  filter(predicate: (key: K, value: V) => boolean): MapWrapper<K, any, any> {
    return this.collect((key, value) => (predicate(key, value) ? [key, value] : undefined))
  }

  /**
   * Returns the first element in this Map or undefined.
   */
  first(): V | undefined {
    return Array.from(this._value.values())[0]
  }

  /**
   * Returns the last element in this Map or undefined.
   */
  last(): V | undefined {
    return Array.from(this._value.values()).pop()
  }

  /**
   * Maps this map's values.
   */
  mapValues<VV>(mapFunction: (value: V) => VV): MapWrapper<K, VV, MapOf<M, K, VV>> {
    return this.collect((key, value) => [key, mapFunction(value)])
  }

  /**
   * Pipes this Map with an arbitrary transformation function.
   */
  pipe = pipe

  /**
   * If this key is missing, set a default value.
   */
  setDefaultValue(key: K, value: V): MapWrapper<K, V, M> {
    if (this._value.has(key)) return this
    return this.set(key, value) as any
  }

  /**
   * If the key is found, run the drafted value through an update function.
   * For primitives, the update function must return a new value whereas for objects, the drafted value can be modified directly.
   */
  updateValue(
    key: K,
    updater: (value: Draft<V>) => V extends AtomicObject ? V : NoReturn
  ): MapWrapper<K, V, M> {
    return this.pipe(m => update(m, draft => draft.updateValue(key, updater))) as any
  }

  /**
   * Transforms this Map into an Array of [key, value] tuples.
   */
  toArray() {
    return this.pipe(m => [...m])
  }

  /**
   * Transforms this Map into an Object.
   * Only available if this Map's keys are a subtype of string or number.
   */
  toObject<KK extends string | number>(
    this: MapWrapper<KK, V, any>
  ): ObjectWrapper<Record<KK, V | undefined>> {
    return this.pipe(m =>
      [...m].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
      }, {} as any)
    )
  }
}

let pipe: Pipe
export function setMapPipe(_pipe: Pipe) {
  pipe = _pipe
}

type MapOf<T extends ReadonlyMap<unknown, unknown>, K, V> = T extends Map<any, any>
  ? Map<K, V>
  : ReadonlyMap<K, V>
