import { ArrayOps } from '../'

declare module '../' {
  interface ArrayOps<A> {
    sort: typeof sort
  }
}

// simple string sorting
export function sort(this: ArrayOps<string>, options?: StringSortOptions): ArrayOps<string>

// string sorting, after extraction using by()
export function sort<A>(this: ArrayOps<A>, options: ByStringSortOptions<A>): ArrayOps<A>

// simple number sorting
export function sort(this: ArrayOps<number>, options?: NumberSortOptions): ArrayOps<number>

// number sorting, after extraction using by()
export function sort<A>(this: ArrayOps<A>, options: ByNumberSortOptions<A>): ArrayOps<A>

/**
* Sorts the Array. The sort is stable.
* If you want to sort on field "a" then on field "b", just chain a sort on "b" then a sort on "a".
*
* An option Object can be passed to modify the sort behavior.
* The supported options are:
*
* ignoreCase: Assuming strings are going to be sorted, ignore their cases. Defaults to false.
*
* localCompare: Assuming strings are going to be sorted,
*   handle locale-specific characters correctly at the cost of reduced sort speed. Defaults to false.
*
* by: Assuming objects are being sorted, a function either pointing to or computing the value
*   that should be used for the sort. Defaults to undefined.
*
* reverse: Reverses the sort. Defaults to false.
*/
export function sort<A>(this: ArrayOps<A>, options?: any): ArrayOps<A> {
  type MappedItem = { index: number, value: any }

  const arr = this.value()
  const o = options || {}
  const mapped: MappedItem[] = []
  const missingData = []

  let result: A[] = []
  let sortFunction: (a: MappedItem, b: MappedItem) => any

  for (let i = 0, length = arr.length; i < length; i++) {
    let item: any = arr[i]
    const originalItem = item

    if (o.by && item)
      item = o.by(item)

    if (item === null || item === undefined || item === '') {
      missingData.push(originalItem)
      continue
    }

    mapped.push({
      index: i,
      value: o.ignoreCase ? item.toUpperCase() : item
    })
  }

  if (o.localeCompare) {
    sortFunction = function(a, b) {
      if (a.value !== b.value)
        return a.value.localeCompare(b.value)
      else
        return a.index < b.index ? -1 : 1
    }
  }
  else {
    sortFunction = function(a, b) {
      if (a.value !== b.value)
        return a.value < b.value ? -1 : 1
      else
        return a.index < b.index ? -1 : 1
    }
  }

  mapped.sort(sortFunction)

  for (let i = 0, length = mapped.length; i < length; i++) {
    result.push(arr[mapped[i].index])
  }

  if (missingData.length)
    result = result.concat(missingData)

  if (o.reverse)
    result.reverse()

  return new ArrayOps(result)
}

ArrayOps.prototype.sort = sort


// Prevent impossible option combinations

export interface StringSortOptions {
  localeCompare?: boolean
  ignoreCase?: boolean
  reverse?: boolean
}

export interface ByStringSortOptions<A> {
  by: (item: A) => string
  localeCompare?: boolean
  ignoreCase?: boolean
  reverse?: boolean
}

export interface NumberSortOptions {
  reverse?: boolean
}

export interface ByNumberSortOptions<A> {
  by: (item: A) => number
  reverse?: boolean
}
