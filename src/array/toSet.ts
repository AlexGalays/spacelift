import { ArrayOps, ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    toSet: typeof toSet
  }
}


export function toSet(this: ArrayOps<string>): ObjectOps<{ [key: string]: boolean }>
export function toSet(this: ArrayOps<number>): ObjectOps<{ [key: number]: boolean }>

/**
 * Converts this Array of numbers or strings to a Set-like object where values are all truthy.
 */
export function toSet(this: ArrayOps<any>): ObjectOps<{}> {
  const arr = this.value(), result: any = {}
  for (let i = 0; i < arr.length; i++) {
    result[arr[i]] = true
  }
  return new ObjectOps(result)
}


ArrayOps.prototype.toSet = toSet
