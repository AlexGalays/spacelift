export function update<T extends object>(obj: T, updater: (draft: Draft<T>) => void): T {
  let updatedObject: any = obj
  const draft = makeDraft(obj as any, newObj => {
    updatedObject = newObj
  })
  updater(draft)
  return updatedObject
}

function makeDraft(
  initialObject: Record<Key, unknown>,
  onChange: (newObject: Record<Key, unknown>) => void
): Draft<any> {
  let obj = initialObject
  let childDraftCache: DraftCache = {}

  const mutateObj = (mutation: () => void, key: Key | {}) => {
    if (obj === initialObject) obj = clone(obj)
    mutation()
    if (key === allKeys) childDraftCache = {}
    else if (key !== noKeys) delete childDraftCache[key as Key]
    onChange(obj)
    return true
  }

  const getObj = () => obj as any

  const proxiedMethods: Record<Key, Function | undefined> | null = Array.isArray(obj)
    ? proxiedArrayMethods(getObj, mutateObj, () => draft)
    : obj instanceof Map
    ? proxiedMapMethods(getObj, mutateObj, childDraftCache)
    : obj instanceof Set
    ? proxiedSetMethods(getObj, mutateObj)
    : null

  const draft = new Proxy(obj, {
    get: (_, key: Key) => {
      // If we explicitely override or add this method, use it.
      if (proxiedMethods && proxiedMethods[key]) return proxiedMethods[key]

      const value = obj[key]

      // If it's a function on the host object, then return its reference (after binding it as it's now detached)
      if (typeof value === 'function') return value.bind(obj)

      // If it's a primitive, there's no point drafting it so return as is.
      if (isPrimitive(value)) return value

      // At this point, the draft is either an Object or Array and the child being accessed is not a primitive: Draft it.
      let childDraft = childDraftCache[key]
      if (!childDraft) {
        childDraft = childDraftCache[key] = makeDraft(value as any, newChildObject => {
          draft[key] = newChildObject
        })
      }
      return childDraft
    },
    set: (_, key: Key, newValue) =>
      mutateObj(() => {
        obj[key] = newValue
      }, key),
    deleteProperty: (_, key: Key) =>
      mutateObj(() => {
        delete obj[key]
      }, key)
  }) as Record<Key, unknown>

  return draft
}

function proxiedArrayMethods(
  getArray: () => Array<unknown>,
  mutateArray: MutateFunction,
  getDraft: () => Record<Key, unknown>
) {
  return {
    prepend: (item: any) => mutateArray(() => getArray().unshift(item), allKeys),

    append: (item: any) => mutateArray(() => getArray().push(item), noKeys),

    insert: (item: any, index: number) => mutateArray(() => getArray().splice(index, 0, item), allKeys),

    insertSorted: (item: any, by: (item: any) => string | number = item => item) =>
      mutateArray(() => {
        const arr: any[] = getArray()
        let low = 0,
          high = arr.length

        const itemValue = by(item)

        while (low < high) {
          const mid = (low + high) >>> 1
          const midValue = by(arr[mid])
          const itemValueIsBigger =
            typeof itemValue === 'string'
              ? itemValue.localeCompare(midValue as string) > 0
              : itemValue > midValue

          if (itemValueIsBigger) low = mid + 1
          else high = mid
        }

        arr.splice(low, 0, item)
      }, allKeys),

    updateIf: (predicate: Function, updateFunction: Function) =>
      getArray().forEach((item, index) => {
        if (predicate(item, index)) updateFunction(getDraft()[index], index)
      }),

    removeIf: (predicate: Function) => {
      let index = getArray().length - 1
      while (index >= 0) {
        if (predicate(getArray()[index], index)) mutateArray(() => getArray().splice(index, 1), allKeys)
        index -= 1
      }
    }
  }
}

function proxiedMapMethods(
  getMap: () => Map<unknown, unknown>,
  mutateMap: MutateFunction,
  draftCache: DraftCache
) {
  const methods = {
    get: (key: Key) => {
      const value = getMap().get(key)
      if (!value || isPrimitive(value)) return value

      let childDraft = draftCache[key]
      if (!childDraft) {
        childDraft = draftCache[key] = makeDraft(value as any, newChildObject => {
          methods.set(key, newChildObject)
        })
      }
      return childDraft
    },
    set: (key: Key, value: any) => mutateMap(() => getMap().set(key, value), key),
    clear: () => mutateMap(() => getMap().clear(), allKeys),
    delete: (key: Key) => {
      mutateMap(() => getMap().delete(key), key)
    }
  }

  return methods
}

function proxiedSetMethods(getSet: () => Set<unknown>, mutateSet: MutateFunction) {
  return {
    add: (value: unknown) => mutateSet(() => getSet().add(value), noKeys),
    clear: () => mutateSet(() => getSet().clear(), noKeys),
    delete: (value: unknown) => mutateSet(() => getSet().delete(value), noKeys)
  }
}

function isPrimitive(obj: unknown) {
  return obj === null || typeof obj !== 'object'
}

export function clone<T extends object>(obj: T) {
  if (isPrimitive(obj)) return obj

  if (Array.isArray(obj)) return obj.slice()
  if (obj instanceof Map) return new Map(obj)
  if (obj instanceof Set) return new Set(obj)
  else {
    const cloned: any = {}
    Object.keys(obj).forEach(key => {
      cloned[key] = (obj as any)[key]
    })
    return cloned
  }
}

type Key = string | number
type DraftCache = Record<Key, object | undefined>
type MutateFunction = (mutation: () => void, changedKey: Key | {}) => void
const allKeys = {}
const noKeys = {}

interface DraftArray<T> {
  readonly length: number
  [n: number]: Draft<T> | undefined // Might as well fix the original, crappy signature. (https://github.com/microsoft/TypeScript/issues/13778)

  /** Iterator */
  [Symbol.iterator](): IterableIterator<T>

  /**
   * Returns an iterable of key, value pairs for every entry in the array
   */
  entries(): IterableIterator<[number, T]>

  /**
   * Returns an iterable of keys in the array
   */
  keys(): IterableIterator<number>

  /**
   * Returns an iterable of values in the array
   */
  values(): IterableIterator<T>

  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void

  indexOf(searchElement: T, fromIndex?: number): number

  includes(searchElement: T, fromIndex?: number): boolean

  some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean

  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number

  every(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean

  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): DraftArray<U>

  filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): DraftArray<T>

  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T
  reduce(
    callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T,
    initialValue: T
  ): T

  prepend(item: T): void
  append(item: T): void
  insert(item: T, index: number): void

  insertSorted<U extends string | number>(this: DraftArray<U>, item: U): void
  insertSorted(item: T, bySortKey: (item: T) => string | number): void
  updateIf(
    predicate: (item: T, index: number) => boolean,
    updateFunction: (item: Draft<T>, index: number) => void
  ): void
  removeIf(predicate: (item: T, index: number) => boolean): void
}

interface DraftMap<K, V> extends Omit<Map<K, V>, 'get'> {
  /** Returns an iterable of entries in the map. */
  [Symbol.iterator](): IterableIterator<[K, V]>

  get(key: K): Draft<V> | undefined
}

interface DraftSet<E> extends Set<E> {}

/** Types that should never be drafted */
type AtomicObject = Function | Promise<any> | Date | RegExp | Boolean | Number | String

type IsTuple<T extends ReadonlyArray<any>> = T extends never[]
  ? true
  : T extends ReadonlyArray<infer U>
  ? U[] extends T
    ? false
    : true
  : true

type WritableDraft<T> = { -readonly [K in keyof T]: Draft<T[K]> }

export type Draft<T> = T extends AtomicObject
  ? T
  : T extends ReadonlyMap<infer K, infer V>
  ? DraftMap<K, V>
  : T extends ReadonlySet<infer E>
  ? DraftSet<E>
  : T extends ReadonlyArray<infer E>
  ? IsTuple<T> extends true
    ? WritableDraft<T>
    : DraftArray<E>
  : T extends object
  ? WritableDraft<T>
  : T

export function toDraft<T>(array: ReadonlyArray<T>): DraftArray<T> {
  return array as any
}
