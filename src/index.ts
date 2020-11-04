import { pipe } from './lift'
export { lift } from './lift'

export { update } from './immupdate'
export { range } from './array'
export { createUnion } from './union'
export { createEnum } from './enum'
export { identity, noop } from './function'

import * as isType from './is'
export const is = isType

import { setArrayPipe } from './array'
import { setObjectPipe } from './object'
import { setMapPipe } from './map'
import { setSetPipe } from './set'

setArrayPipe(pipe)
setObjectPipe(pipe)
setMapPipe(pipe)
setSetPipe(pipe)
