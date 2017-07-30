import { object as isObject } from '../object/is'


let currentMemoId = 0

export type Fn0<R> = () => R
export type Fn1<A, R> = (a: A) => R
export type Fn2<A, B, R> = (a: A, b: B) => R
export type Fn3<A, B, C, R> = (a: A, b: B, c: C) => R
export type Fn4<A, B, C, D, R> = (a: A, b: B, c: C, d: D) => R

export interface Options<KeyFn> {
  /** The maximum number of items (one per argument combination) to keep in the cache. Set at 30 by default. */
  cacheSize?: number
  /** A custom key function used to derivate the caching key from the function arguments */
  key?: KeyFn
}

export function memoize<R>(fun: Fn0<R>): Fn0<R>
export function memoize<A, R>(fun: Fn1<A, R>, options?: Options<Fn1<A, string>>): Fn1<A, R>
export function memoize<A, B, R>(fun: Fn2<A, B, R>, options?: Options<Fn2<A, B, string>>): Fn2<A, B, R>
export function memoize<A, B, C, R>(fun: Fn3<A, B, C, R>, options?: Options<Fn3<A, B, C, string>>): Fn3<A, B, C, R>
export function memoize<A, B, C, D, R>(fun: Fn4<A, B, C, D, R>, options?: Options<Fn4<A, B, C, D, string>>): Fn4<A, B, C, D, R>

/**
 * Memoizes a function of arbitrary arity.
 * This has two main uses:
 *   1) Reducing the CPU time taken by expensive calculations at the cost of some memory overhead
 *   2) Producing stable references for a given set of arguments. Useful when relying on reference equality.
 *
 * Memoized functions keep internal state. If you wish to clear that state entirely, you can recreate the function.
 */
export function memoize<A extends Function>(fun: A, options?: Options<A>) {
  // The unique property name used by this memoize function instance.
  // This is used to store the id/reference of object arguments, as Weak maps/sets are very limited.
  const memoKey = `__memo__${currentMemoId++}`

  const lastArgKeys: any[] = []

  const cacheSize = (options && options.cacheSize) || 30
  const keyFunction = options && options.key

  // The unique ids/references of objects inside the arityNCache cache
  let objId = 0
  let arity0Cache: any
  let arityNCache: any
  let keyCache: any

  return function(...args: any[]) {
    // 0 arguments edge-case
    if (args.length === 0) {
      if (!arity0Cache) arity0Cache = fun()
      return arity0Cache
    }
    // custom key function
    else if (keyFunction) {
      keyCache = keyCache || {}
      const key = keyFunction.apply(null, args)
      let result = keyCache[key]
      if (!result) {
        lastArgKeys.push(key)
        limitCacheSize(keyCache, lastArgKeys, cacheSize)
        result = keyCache[key] = fun.apply(null, args)
      }
      return result
    }
    // N arguments
    else {
      arityNCache = arityNCache || {}
      let key = ''

      for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        let argKey

        if (isObject(arg)) {
          argKey = arg[memoKey]
          if (!argKey) {
            // Non enumerable
            Object.defineProperty(arg, memoKey, { value: `obj${objId++}` })
            argKey = arg[memoKey]
          }
        }
        else {
          argKey = arg
        }
        key += (argKey + '_')
      }

      let result = arityNCache[key]
      if (!result) {
        lastArgKeys.push(key)
        limitCacheSize(arityNCache, lastArgKeys, cacheSize)
        result = arityNCache[key] = fun.apply(null, args)
      }

      return result
    }
  }
}

function limitCacheSize(cache: {}, lastArgKeys: any[], size: number) {
  if (lastArgKeys.length === size + 1) {
    const key = lastArgKeys.shift()
    delete cache[key]
  }
}
