import { ArrayOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    distinct: typeof distinct
  }
}

/**
 * Creates an array without any duplicate item.
 * If a key function is passed, items will be compared based on the result of that function;
 * if not, they will be compared using strict equality.
 */
export function distinct<A>(this: ArrayOps<A>, getKey?: (item: A, index: number) => string | number): ArrayOps<A> {
  const arr = this.value(), result: A[] = []
  let keySet
  let refList

  if (getKey)
    keySet = {}
  else
    refList = []

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    if (getKey) {
      const key = getKey(item, i)
      if (!keySet![key]) {
        keySet![key] = 1
        result.push(item)
      }
    }
    else {
      if (refList!.indexOf(item) === -1) {
        refList!.push(item)
        result.push(item)
      }
    }
  }

  return new ArrayOps(result)
}


ArrayOps.prototype.distinct = distinct
