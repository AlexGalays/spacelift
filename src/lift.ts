import { ObjectWrapper } from './object'

export interface Lift {
  /** Wraps a Number to provide a richer API. Unwrap with .value() **/
  (obj: number): Wrapper<number>

  /** Wraps a String to provide a richer API. Unwrap with .value() **/
  (obj: string): Wrapper<string>

  /** Wraps a Date to provide a richer API. Unwrap with .value() **/
  (obj: Date): Wrapper<Date>

  /** Wraps an Array to provide a richer API. Unwrap with .value() **/
  <T>(obj: ReadonlyArray<T>): ArrayOps<T>

  /** Wraps a plain Object to provide a richer API. Unwrap with .value() **/
  <T extends {}>(obj: T): ObjectWrapper<T>
}

interface Wrapper<A> {
  value(): A
}

const lift: Lift = function (obj: any): any {
  if (obj instanceof Array) return new ArrayOps(obj)
  if (obj instanceof Date) return new DateWrapper(obj)

  if (typeof obj === 'string') return new StringWrapper(obj)
  if (typeof obj === 'number') return new NumberWrapper(obj)
  if (typeof obj === 'boolean') return obj

  return new ObjectWrapper(obj)
}

export default lift

export function getValue<A>(input: A | Wrapper<A>): A {
  return input && input['_isLiftWrapper'] ? (input as Wrapper<A>).value() : (input as A)
}

// Generic Wrapper for types without any added methods.
function makeWrapper() {
  return class Wrapper {
    constructor(private _value: any) {}
    _isLiftWrapper = true

    value() {
      return this._value
    }

    pipe(func: Function) {
      return lift(getValue(func(this.value())))
    }
  }
}

const DateWrapper = makeWrapper()
const NumberWrapper = makeWrapper()
const StringWrapper = makeWrapper()
