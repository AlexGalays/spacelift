import { ArrayOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    takeRight: typeof takeRight
  }
}

/**
 * Takes the last 'count' items from this Array.
 */
export function takeRight<A>(this: ArrayOps<A>, count: number): ArrayOps<A> {
  const arr = this.value()
  return new ArrayOps((arr.length < count)
    ? arr.slice(0)
    : arr.slice(arr.length - count)
  )
}


ArrayOps.prototype.takeRight = takeRight
