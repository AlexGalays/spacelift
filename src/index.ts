import lift from './wrapper'

export default lift
export { ArrayOps, ObjectOps, BoolOps, NumberOps, StringOps, Wrapper, getValue } from './wrapper'
export { update, deepUpdate, DELETE } from 'immupdate'
export { Option, None, Some } from './option'
export { Result, Ok, Err } from './result'

export { range } from './array/range'
export { fromArrayLike } from './array/fromArrayLike'
export { Set } from './object/set'
export { memoize } from './function/memoize'

import * as isType from './object/is'
export const is = isType