import { ArrayOps, ObjectOps } from '../lift'

declare module '../../wrapper' {
  interface ArrayOps<A> {
    groupBy: typeof groupBy
  }
}

/**
* Creates an object composed of keys generated from the results of running each element through a discriminator function.
* The corresponding value of each key is an array of the elements responsible for generating the key.
*/
export function groupBy<A>(this: ArrayOps<A>, discriminator: (item: A, index: number) => string | number): ObjectOps<Record<string, A[]>> {
  const arr = this.value(), groups: Record<string, A[]> = {}

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const key = discriminator(item, i)
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }

  return new ObjectOps(groups)
}

ArrayOps.prototype.groupBy = groupBy
