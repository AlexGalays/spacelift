import { ArrayWrapper } from './array'
import { MapWrapper } from './map'
import { clone, Draft, NoReturn, update } from './immupdate'
import type { Pipe } from './lift'

export class ObjectWrapper<T extends object> {
  constructor(private _value: T) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }

  private _clone(): T {
    return clone(this._value)
  }

  /**
   * Adds a new key/value to this object. This creates a new type.
   * To add a nullable key to an object while preserving its type, use "update()" instead.
   */
  add<K extends string, V>(key: K, value: V): ObjectWrapper<T & { [P in K]: V }> {
    const result: any = this._clone()
    result[key] = value
    return new ObjectWrapper(result)
  }

  /**
   * Returns whether this object contains no keys.
   */
  isEmpty(): boolean {
    return Object.keys(this.value()).length === 0
  }

  /**
   * Creates an Array of all this object's keys, in no particular order.
   * If the keys are a subtype of string, the Array will be typed with the proper key union type.
   */
  keys(): ArrayWrapper<Array<KeyAsString<keyof T>>> {
    return this.pipe(o => Object.keys(o)) as any
  }

  /**
   * Maps one of this Object values, by key.
   * This is similar to remove('key').add('key', newValue) but is less error prone.
   * This can change the type of the object.
   */
  mapValue<K extends keyof T, V>(
    key: K,
    mapFunction: (value: T[K]) => V
  ): ObjectWrapper<{ [K2 in keyof T]: K2 extends K ? V : T[K] }> {
    return this.pipe(o => ({
      ...o,
      [key]: mapFunction(o[key])
    })) as any
  }

  /**
   * Maps this Object's values.
   * This is mostly useful for objects with a single value type.
   */
  mapValues<V>(mapFunction: (value: T[keyof T]) => V): ObjectWrapper<Record<keyof T, V>> {
    return this.toArray().reduce<any>({}, (result, [key, value]) => {
      result[key] = mapFunction(value)
      return result
    })
  }

  pipe = pipe

  /**
   * Removes a key/value from this object and return a new object (and type)
   * To delete a (nullable) key from an object while preserving its type, use "update()" instead.
   */
  remove<K extends keyof T>(keyToRemove: K): ObjectWrapper<Omit<T, K>> {
    const result: any = this._clone()
    delete result[keyToRemove.toString()]
    return new ObjectWrapper(result) as any
  }

  /**
   * Creates an Array with all these object's values.
   */
  values(): ArrayWrapper<Array<T[keyof T]>> {
    return this.pipe(Object.values)
  }

  /**
   * Converts this Object to an Array of tuples.
   * Similar to Object.entries() but retains the type of keys.
   */
  toArray(): ArrayWrapper<[KeyAsString<keyof T>, T[keyof T]][]> {
    return this.pipe(Object.entries) as any
  }

  /**
   * Transforms this Object to a Map where the keys are the string typed keys of this Object.
   */
  toMap(): MapWrapper<KeyAsString<keyof T>, T[keyof T], Map<KeyAsString<keyof T>, T[keyof T]>> {
    return this.pipe(o => new Map(Object.entries(o))) as any
  }
}

let pipe: Pipe
export function setObjectPipe(_pipe: Pipe) {
  pipe = _pipe
}

type KeyAsString<K> = K extends string ? K : string
