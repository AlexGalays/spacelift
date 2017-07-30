
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


export interface Wrapper<A> {
  _isLiftWrapper: {}
  value(): A
}

export function getValue<A>(input: A | Wrapper<A>): A {
  return input && input['_isLiftWrapper']
    ? (input as Wrapper<A>).value()
    : input as A
}


//--------------------------------------
//  Array
//--------------------------------------

export class ArrayOps<A> implements Wrapper<A[]> {

  constructor(array: A[]) {
    this._value = array
  }

  _isLiftWrapper = true
  private _value: A[]

  value() { return this._value }
}

//--------------------------------------
//  Object
//--------------------------------------

export class ObjectOps<A> implements Wrapper<A> {

  constructor(object: A) {
    this._value = object
  }

  _isLiftWrapper = true
  private _value: A

  value() { return this._value }
}

//--------------------------------------
//  Number
//--------------------------------------

export class NumberOps implements Wrapper<number> {

  constructor(num: number) {
    this._value = num
  }

  _isLiftWrapper = true
  private _value: number

  value() { return this._value }
}

//--------------------------------------
//  String
//--------------------------------------

export class StringOps implements Wrapper<string> {

  constructor(str: string) {
    this._value = str
  }

  _isLiftWrapper = true
  private _value: string

  value() { return this._value }
}

//--------------------------------------
//  Boolean
//--------------------------------------

// Not that we expect to expand on the boolean capabilities... But for completeness sake.
export class BoolOps implements Wrapper<boolean> {

  constructor(value: boolean) {
    this._value = value
  }

  _isLiftWrapper = true
  private _value: boolean

  value() { return this._value }
}