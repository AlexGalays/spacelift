import { pipe } from './lift'

/** A Set wrapper providing extra functionalities and more chaining opportunities */
export class SetWrapper<T> {
  constructor(private _value: ReadonlySet<T>) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }

  clone() {
    return new SetWrapper(this._clone())
  }

  private _clone() {
    return new Set(this._value)
  }

  add(item: T) {
    return new SetWrapper(this._clone().add(item))
  }

  delete(item: T) {
    const result = this._clone()
    result.delete(item)
    return new SetWrapper(result)
  }

  clear() {
    const result = this._clone()
    result.clear()
    return new SetWrapper(result)
  }

  collect<B>(iterator: (item: T) => B | void | undefined): SetWrapper<B> {
    const result = new Set<B>()

    this._value.forEach(item => {
      const res = iterator(item)
      if (res !== undefined) result.add(res)
    })
    return new SetWrapper(result)
  }

  /**
   * Filters this Set's items by aplying a predicate to all values and refine its type.
   */
  filter<B extends T>(predicate: (item: T) => item is B): SetWrapper<B>
  /**
   * Filters this Set's items.
   */
  filter(predicate: (item: T) => boolean): SetWrapper<T>
  filter(predicate: (item: T) => boolean): SetWrapper<T> {
    return this.collect(item => (predicate(item) ? item : undefined))
  }

  toArray() {
    return this.pipe(s => [...s])
  }

  pipe = pipe
}
