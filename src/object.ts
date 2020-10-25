import { ArrayOps } from './array'
import { Draft, update } from './immupdate'
import { Option } from './option'

export class ObjectWrapper<T extends {}> {
  constructor(private _value: T) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }

  /**
   * Adds a new key/value to this heterogeneous object.
   * To add a nullable key to an object while preserving its type, use "update()" instead.
   */
  add<K extends string, V>(key: K, value: V): ObjectWrapper<T & { [P in K]: V }> {
    const obj = this.value(),
      result: any = {}
    Object.keys(obj).forEach(key => {
      result[key] = obj[key]
    })
    result[key] = value
    return new ObjectWrapper(result)
  }

  /**
   * Returns the value found at the provided key, as an Option.
   * Usage: read a nullable value from a domain object.
   */
  get<K extends keyof T>(key: K): Option<NonNullable<T[K]>> {
    return Option(this.value()[key]) as Option<NonNullable<T[K]>>
  }

  /**
   * Returns whether this object contains no keys.
   */
  isEmpty(this: ObjectWrapper<{}>): boolean {
    return Object.keys(this.value()).length === 0
  }

  /**
   * Creates an Array of all this object's keys, in no particular order.
   */
  keys(): ArrayOps<keyof T> {
    return new ArrayOps(Object.keys(this.value()) as (keyof T)[])
  }

  /**
   * Removes a key/value from this object and return a new object (and type)
   * To delete a (nullable) key from an object while preserving its type, use "update()" instead.
   */
  remove<K extends keyof T>(keyToRemove: K): ObjectWrapper<Omit<T, K>> {
    const obj = this.value()
    const keyToRemoveStr = keyToRemove.toString()
    const result = {}
    Object.keys(obj).forEach(key => {
      if (key !== keyToRemoveStr) result[key] = obj[key]
    })
    return new ObjectWrapper(result) as any
  }

  /**
   * Creates an Array with all these object's values.
   */
  values(): ArrayOps<T[keyof T]> {
    return new ArrayOps(Object.values(this.value()))
  }

  /**
   * Make mutable modifications to a draft then return a new Object.
   */
  update(updateFunction: (draft: Draft<T>) => void): ObjectWrapper<T> {
    return new ObjectWrapper(update(this.value(), updateFunction))
  }
}
