import { update as immupdate } from 'immupdate'
import { ObjectOps } from '../'

declare module '../' {
  interface ObjectOps<A> {
    update: typeof update
  }
}

/**
 * Updates an object properties shallowly.
 * This delegates to "immupdate", see https://github.com/AlexGalays/immupdate
 */
export function update<A, K extends keyof A>(this: ObjectOps<A>, spec: Pick<A, K>): ObjectOps<A> {
  return new ObjectOps(immupdate(this.value(), spec))
}

ObjectOps.prototype.update = update
