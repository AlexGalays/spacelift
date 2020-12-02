import { ObjectWrapper } from './object'
import { Draft, update } from './immupdate'
import type { Pipe } from './lift'

/** A Map wrapper providing extra functionalities and more chaining opportunities */
export class MapWrapper<K, V, M extends ReadonlyMap<K, V>> {
  constructor(private _value: M) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }

  clone(): MapWrapper<K, V, M> {
    return new MapWrapper(this._clone()) as any
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
   * Clears the map.
   */
  clear() {
    const result = this._clone()
    result.clear()
    return new MapWrapper(result)
  }

  /**
   * Maps this Map's keys and values, unless void or undefined is returned, in which case the entry is filtered.
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
   * Maps this map's values.
   */
  mapValues<VV>(mapFunction: (value: V) => VV): MapWrapper<K, VV, MapOf<M, K, VV>> {
    return this.collect((key, value) => [key, mapFunction(value)])
  }

  /**
   * Make mutable modifications to a draft then return a new Map.
   */
  update(updateFunction: (draft: Draft<ReadonlyMap<K, V>>) => void) {
    return this.pipe(o => update(o, updateFunction))
  }

  pipe = pipe

  toArray() {
    return this.pipe(m => [...m])
  }

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
