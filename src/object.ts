import { ArrayWrapper } from './array'
import { MapWrapper } from './map'
import { clone, Draft, update } from './immupdate'
import type { Pipe } from './lift'

export class ObjectWrapper<T extends object> {
  constructor(private _value: T) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }

  clone() {
    return new ObjectWrapper(this._clone())
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
   */
  keys(): ArrayWrapper<Array<keyof T>> {
    return this.pipe(o => Object.keys(o) as (keyof T)[])
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
  values(): ArrayWrapper<Array<keyof T>> {
    return this.pipe(Object.values)
  }

  /**
   * Make mutable modifications to a draft then return a new Object.
   * Example: lift({a: 1}).update(draft => {draft.a = 10})
   */
  update(updateFunction: (draft: Draft<T>) => void) {
    return this.pipe(o => update(o, updateFunction))
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
