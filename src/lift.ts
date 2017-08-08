import {
  Wrapper,
  ArrayOpsConstructor, ArrayOps as IArrayOps,
  ObjectOpsConstructor, ObjectOps as IObjectOps,
  NumberOpsConstructor, NumberOps as INumberOps,
  StringOpsConstructor, StringOps as IStringOps,
  BoolOpsConstructor, BoolOps as IBoolOps
} from '../wrapper'
export { Wrapper } from '../wrapper'


export interface Lift {
  /** Wraps a Number to provide a richer API. Unwrap with .value() **/
  (obj: number): NumberOps

  /** Wraps a String to provide a richer API. Unwrap with .value() **/
  (obj: string): StringOps

  /** Wraps a boolean to provide a richer API. Unwrap with .value() **/
  (obj: boolean): BoolOps

  /** Wraps an Array to provide a richer API. Unwrap with .value() **/
  <T>(obj: T[]): ArrayOps<T>

  /** Wraps a plain Object to provide a richer API. Unwrap with .value() **/
  <T extends {}>(obj: T): ObjectOps<T>
}


const lift: Lift = function(obj: any): any {
  if (obj instanceof Array) return new ArrayOps(obj)
  if (typeof obj === 'string') return new StringOps(obj)
  if (typeof obj === 'number') return new NumberOps(obj)
  if (obj === true || obj === false) return new BoolOps(obj)
  return new ObjectOps(obj)
}

export default lift


export function getValue<A>(input: A | Wrapper<A>): A {
  return input && input['_isLiftWrapper']
    ? (input as Wrapper<A>).value()
    : input as A
}


function makeOps(): {} {
  class Ops {
    constructor(private _value: any) {}
    _isLiftWrapper = true
    value() { return this._value }
  }

  return Ops
}


//--------------------------------------
//  Array
//--------------------------------------

export type ArrayOps<A> = IArrayOps<A>
export const ArrayOps = makeOps() as ArrayOpsConstructor

//--------------------------------------
//  Object
//--------------------------------------

export type ObjectOps<A> = IObjectOps<A>
export const ObjectOps = makeOps() as ObjectOpsConstructor

//--------------------------------------
//  Number
//--------------------------------------

export type NumberOps = INumberOps
export const NumberOps = makeOps() as NumberOpsConstructor

//--------------------------------------
//  String
//--------------------------------------

export type StringOps = IStringOps
export const StringOps = makeOps() as StringOpsConstructor

//--------------------------------------
//  Boolean
//--------------------------------------

// Not that we expect to expand on the boolean capabilities... But for completeness sake.
export type BoolOps = IBoolOps
export const BoolOps = makeOps() as BoolOpsConstructor