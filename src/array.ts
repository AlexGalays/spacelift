import { identity } from './function'
import { Draft, update } from './immupdate'
import { lift, getValue, pipe, Wrapper, Lifted } from './lift'
import { MapWrapper } from './map'
import { SetWrapper } from './set'

/** An Array wrapper providing extra functionalities and more chaining opportunities */
export class ArrayWrapper<T> {
  constructor(private _value: ReadonlyArray<T>) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }

  clone() {
    return new ArrayWrapper(this._clone())
  }

  private _clone() {
    return this._value.slice()
  }

  /**
   * Appends one item at the end of the Array.
   */
  append(item: T): ArrayWrapper<T> {
    return new ArrayWrapper([...this._value, item])
  }

  /**
   * Appends an Array of items at the end of the Array.
   */
  appendAll(items: T[]): ArrayWrapper<T> {
    return new ArrayWrapper(this._value.concat(items))
  }

  /**
   * Filters all the falsy elements out of this Array.
   * All occurences of false, null, undefined, 0, "" will be removed.
   */
  compact<A>(this: ArrayWrapper<A | false | null | undefined | 0 | ''>): ArrayWrapper<A> {
    return this.filter(x => !!x) as ArrayWrapper<A>
  }

  /**
   * Counts the items satisfying a predicate.
   */
  count(predicate: (item: T, index: number) => boolean): number {
    return this.pipe(arr => arr.reduce((count, item, index) => count + (predicate(item, index) ? 1 : 0), 0))
  }

  /**
   * Maps this Array's items, unless void or undefined is returned, in which case the item is filtered.
   */
  collect<B>(iterator: (item: T, index: number) => B | undefined | void): ArrayWrapper<B> {
    const result: B[] = []
    this._value.forEach((item, index) => {
      const res = iterator(item, index)
      if (res !== undefined) result.push(res)
    })
    return new ArrayWrapper(result)
  }

  /**
   * Creates an array without any duplicate item.
   * If a key function is passed, items will be compared based on the result of that function;
   * if not, they will be compared using strict equality.
   */
  distinct(getKey?: (item: T, index: number) => string | number): ArrayWrapper<T> {
    const items = new Set()
    return this.collect((item, index) => {
      const key = getKey ? getKey(item, index) : item
      if (items.has(key)) return
      items.add(key)
      return item
    })
  }

  /**
   * Drops the first 'count' items from this Array.
   */
  drop(count: number): ArrayWrapper<T> {
    return this.pipe(arr => arr.slice(count))
  }

  /**
   * Drops the last 'count' items from this Array.
   */
  dropRight(count: number): ArrayWrapper<T> {
    return this.pipe(arr => arr.slice(0, -count))
  }

  /**
   * Filters this array by aplying a predicate to all items and refine its type.
   */
  filter<A extends T>(predicate: (item: T, index: number) => item is A): ArrayWrapper<A>
  /**
   * Filters this array by aplying a predicate.
   */
  filter(predicate: (item: T, index: number) => boolean): ArrayWrapper<T>
  filter(predicate: (item: T, index: number) => any): ArrayWrapper<any> {
    return this.pipe(arr => arr.filter(predicate))
  }

  /**
   * Returns the first element in this Array or undefined.
   */
  first(): T | undefined {
    return this._value[0]
  }

  /**
   * Maps this Array to an Array of Array | ArrayWrapper using a mapper function then flattens it.
   */
  flatMap<B>(fun: (item: T, index: number) => B[]): ArrayWrapper<B>
  /**
   * Maps this Array to an Array of Array | ArrayWrapper using a mapper function then flattens it.
   */
  flatMap<B>(fun: (item: T, index: number) => ArrayWrapper<B>): ArrayWrapper<B>
  /**
   * Maps this Array to an Array of Array | ArrayWrapper using a mapper function then flattens it.
   */
  flatMap<B>(fun: (item: T, index: number) => ReadonlyArray<B> | ArrayWrapper<B>): ArrayWrapper<B> {
    const arr = this._value,
      result: B[] = []

    for (let i = 0; i < arr.length; i++) {
      result.push.apply(result, getValue(fun(arr[i], i) as B[]))
    }

    return new ArrayWrapper(result)
  }

  /**
   * Flattens this Array of Arrays.
   */
  flatten<A>(this: ArrayWrapper<ReadonlyArray<A>>): ArrayWrapper<A>
  flatten<A>(this: ArrayWrapper<A[]>): ArrayWrapper<A>
  flatten<A>(): ArrayWrapper<A> {
    const arr = this.value(),
      result: A[] = []

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      result.push.apply(result, (item as unknown) as A[])
    }

    return new ArrayWrapper(result)
  }

  /**
   * Folds this Array into a single value, using a starting value.
   */
  fold<V>(startValue: V, func: (acc: V, value: T, index: number) => V): Lifted<V> {
    return lift(this._value.reduce(func, startValue) as any)
  }

  /**
   * Returns the item found at the provided index or undefined.
   */
  get(index: number): T | undefined {
    return this._value[index]
  }

  /**
   * Creates a Map where keys are the results of running each element through a discriminator function.
   * The corresponding value of each key is an array of the elements responsible for generating the key.
   */
  groupBy<K extends string | number>(
    discriminator: (item: T, index: number) => K
  ): MapWrapper<K, ReadonlyArray<T>> {
    const groups = new Map<K, ReadonlyArray<T>>()

    this._value.forEach((item, index) => {
      const key = discriminator(item, index)
      if (!groups.has(key)) groups.set(key, [])
      ;(groups.get(key) as T[]).push(item)
    })

    return new MapWrapper(groups)
  }

  /**
   * Inserts an item at a specified index.
   */
  insert(index: number, item: T): ArrayWrapper<T> {
    return this.pipe(arr => {
      const result = arr.slice()
      result.splice(index, 0, item)
      return result
    })
  }

  /**
   * Returns the item found at the last index or undefined.
   */
  last(): T | undefined {
    return this._value[this._value.length - 1]
  }

  /**
   * Maps this Array using a mapper function.
   */
  map<B>(fun: (item: T, index: number) => B): ArrayWrapper<B> {
    return this.pipe(arr => arr.map(fun))
  }

  /**
   * Removes the item found at the specified index.
   */
  removeAt(index: number): ArrayWrapper<T> {
    const result = this._clone()
    result.splice(index, index < 0 ? 0 : 1)
    return new ArrayWrapper(result)
  }

  /**
   * Reverses the Array.
   */
  reverse(): ArrayWrapper<T> {
    return this.pipe(arr => arr.slice().reverse())
  }

  /**
   * Sorts the Array in ascending order, using one or more iterators specifying which field to compare.
   * For strings, localCompare is used.
   * The sort is stable if the browser uses a stable sort (all modern engines do)
   */
  sort(...fields: Array<SortOnField<T>>): ArrayWrapper<T> {
    const arr = this._clone()

    if (fields.length === 0) {
      fields = [identity as any]
    }

    arr.sort((a, b) => {
      for (let i = 0, length = fields.length; i < length; i++) {
        const fieldA = fields[i](a)
        const fieldB = fields[i](b)

        // Non defined values always go at the end
        if (fieldA === null || fieldA === undefined) return 1
        if (fieldB === null || fieldB === undefined) return -1

        if (typeof fieldA === 'string') {
          const comparison = fieldA.localeCompare(fieldB as string)
          if (comparison !== 0) return comparison
        } else if (fieldA < fieldB) return -1
        else if (fieldA > fieldB) return 1
      }

      return 0
    })

    return new ArrayWrapper(arr)
  }

  /**
   * Takes the first 'count' items from this Array.
   */
  take(count: number): ArrayWrapper<T> {
    return this.pipe(_ => _.slice(0, count))
  }

  /**
   * Takes the last 'count' items from this Array.
   */
  takeRight(count: number): ArrayWrapper<T> {
    return this.pipe(arr => (arr.length < count ? arr.slice(0) : arr.slice(arr.length - count)))
  }

  /**
   * Converts this Array to a Set.
   */
  toSet(): SetWrapper<T> {
    return this.pipe(arr => new Set(arr))
  }

  /**
   * Make mutable modifications to a draft then return a new Array.
   * Example: lift([{a: 1}]).update(draft => {draft[0]!.a = 10})
   */
  update(updateFunction: (draft: Draft<ReadonlyArray<T>>) => void) {
    return this.pipe(o => update(o, updateFunction))
  }

  /**
   * Updates an item at the specified index.
   */
  updateAt(index: number, updater: (item: T) => Wrapper<T>): ArrayWrapper<T>

  /**
   * Updates an item at the specified index.
   */
  updateAt(index: number, updater: (item: T) => T): ArrayWrapper<T>

  /**
   * Updates an item at the specified index.
   */
  updateAt(index: number, updater: (item: T) => T | Wrapper<T>): ArrayWrapper<T> {
    const result = this._clone()

    if (result.length > index && index > -1) result[index] = getValue(updater(result[index]))

    return new ArrayWrapper(result)
  }

  /**
   * Pipes this Array with an arbitrary transformation function.
   */
  pipe = pipe
}

/*
 * Returns a number[] wrapper with all numbers from start to stop (inclusive),
 * incremented or decremented by step.
 */
export function range(start: number, stop?: number, step?: number): ArrayWrapper<number> {
  if (arguments.length === 1) {
    stop = arguments[0] - 1
    start = 0
  }

  step = step || 1

  const result: number[] = []
  const increasing = step > 0
  let next = start

  while ((increasing && next <= stop!) || (!increasing && next >= stop!)) {
    result.push(next)
    next = next + step
  }

  return new ArrayWrapper(result)
}

type SortOnField<T> = ((field: T) => string | null | undefined) | ((field: T) => number | null | undefined)
