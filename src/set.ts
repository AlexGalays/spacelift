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

  add(item: T): this {
    return new SetWrapper(this._clone().add(item)) as any
  }

  addAll(items: Iterable<T>): this {
    return new SetWrapper(new Set([...this._value, ...items])) as any
  }

  delete(item: T): this {
    const result = this._clone()
    result.delete(item)
    return new SetWrapper(result) as any
  }

  clear(): this {
    const result = this._clone()
    result.clear()
    return new SetWrapper(result) as any
  }

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
   * Returns the Set of all items of this Set but not found in the passed Set.
   */
  difference(other: ReadonlySet<T>): SetWrapper<T, S> {
    return this.filter(item => !other.has(item))
  }

  /**
   * Make mutable modifications to a draft Set then return a new Set.
   * Example: lift([{a: 1}]).update(draft => {draft[0]!.a = 10})
   */
  update(updateFunction: (draft: Draft<S>) => NoReturn) {
    return this.pipe(o => update(o, updateFunction))
  }

  toArray() {
    return this.pipe(s => [...s])
  }

  pipe = pipe
}

let pipe: Pipe
export function setSetPipe(_pipe: Pipe) {
  pipe = _pipe
}

type SetOf<T extends ReadonlySet<unknown>, ITEM> = T extends Set<any> ? Set<ITEM> : ReadonlySet<ITEM>
