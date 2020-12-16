import { Draft, NoReturn, update } from './immupdate'
import type { Pipe } from './lift'

/** A Set wrapper providing extra functionalities and more chaining opportunities */
export class SetWrapper<T, S extends ReadonlySet<T>> {
  constructor(private _value: S) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }

  private _clone() {
    return new Set<T>(this._value)
  }

  /**
   * Adds a new value to this Set.
   */
  add(item: T): this {
    return new SetWrapper(this._clone().add(item)) as any
  }

  /**
   * Adds all items from the passed iterable to this Set.
   */
  addAll(items: Iterable<T>): this {
    return new SetWrapper(new Set([...this._value, ...items])) as any
  }

  /**
   * Deletes one value from this Set.
   */
  delete(item: T): this {
    const result = this._clone()
    result.delete(item)
    return new SetWrapper(result) as any
  }

  /**
   * Maps this Set's items, unless void or undefined is returned, in which case the item is filtered.
   * This is effectively a `filter` + `map` combined in one.
   */
  collect<B>(iterator: (item: T) => B | void | undefined): SetWrapper<B, SetOf<S, B>> {
    const result = new Set<B>()

    this._value.forEach(item => {
      const res = iterator(item)
      if (res !== undefined) result.add(res)
    })
    return new SetWrapper(result) as any
  }

  /**
   * Filters this Set's items by aplying a predicate to all values and refine its type.
   */
  filter<B extends T>(predicate: (item: T) => item is B): SetWrapper<B, SetOf<S, B>>
  /**
   * Filters this Set's items.
   */
  filter(predicate: (item: T) => boolean): SetWrapper<T, S>
  filter(predicate: (item: T) => boolean): SetWrapper<any, any> {
    return this.collect(item => (predicate(item) ? item : undefined))
  }

  /**
   * Returns the Set of all items of this Set that are also found in the passed Set.
   */
  intersection(other: ReadonlySet<T>): SetWrapper<T, S> {
    return this.filter(item => other.has(item))
  }

  /**
   * Returns the Set of all items of this Set that are not found in the passed Set.
   */
  difference(other: ReadonlySet<T>): SetWrapper<T, S> {
    return this.filter(item => !other.has(item))
  }

  /**
   * Transforms this Set into an Array. The insertion order is kept.
   */
  toArray() {
    return this.pipe(s => [...s])
  }

  /**
   * Pipes this Set with an arbitrary transformation function.
   */
  pipe = pipe
}

let pipe: Pipe
export function setSetPipe(_pipe: Pipe) {
  pipe = _pipe
}

type SetOf<T extends ReadonlySet<unknown>, ITEM> = T extends Set<any> ? Set<ITEM> : ReadonlySet<ITEM>
