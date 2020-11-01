import lift from './lift'

export default lift
export { Wrapper, getValue } from './lift'
export { update } from './immupdate'

export { range } from './array'
export { createUnion } from './union'
export { createEnum } from './enum'

import * as isType from './is'
export const is = isType

export { identity, noop } from './function'
