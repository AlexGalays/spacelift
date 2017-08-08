import lift, { Wrapper, getValue, ArrayOps } from '../lift'


export interface Option<A> {
  /**
   * Returns the value contained in this Option.
   * This will always return undefined if this Option instance is None.
   * This method never throws.
   */
  get(): A | undefined

  /**
   * Returns whether this Option has a defined value (i.e, it's a Some(value))
   */
  isDefined(): this is Some<A>

  /**
   * Applies the given procedure to the option's value, if it is non empty.
   */
  forEach(fn: (a: A) => void): void


  map<B>(fn: (a: A) => Wrapper<B> | null | undefined): Option<B>
  map<B>(fn: (a: A) => B | null | undefined): Option<B>
  /**
   * Maps the value contained in this Some, else returns None.
   * Depending on the map function return value, a Some could be tranformed into a None.
   */
  map<B>(fn: (a: A) => B | null | undefined | Wrapper<B>): Option<B>

  /**
   * Maps the value contained in this Some to a new Option, else returns None.
   */
  flatMap<B>(fn: (a: A) => Option<B>): Option<B>

  /**
   * If this Option is a Some and the predicate returns true, keep that Some.
   * In all other cases, return None.
   */
  filter(fn: (a: A) => boolean): Option<A>

  /**
   * Applies the first function if this is a None, else applies the second function.
   * Note: Since this method creates 2 functions everytime it runs, don't use in tight loops; use isDefined() instead.
   */
  fold<B, C>(
    ifEmpty: () => B,
    ifDefined: (a: A) => C
  ): B | C

  /**
   * Returns this Option unless it's a None, in which case the provided alternative is returned
   */
  orElse(alternative: () => Option<A>): Option<A>

  /**
   * Returns this Option's value if it's a Some, else return the provided alternative
   */
  getOrElse(alternative: A): A

  /**
   * Converts this Option to an Array.
   */
  toArray(): ArrayOps<A>

  toString(): string
}

export interface Some<T> extends Option<T> {
  type: 'some'
  get(): T
}

export interface None extends Option<never> {
  type: 'none'
  get(): undefined
}


export type NullableValue<T> = T | Option<T> | null | undefined

export interface OptionObject {
  /**
   * Creates an Option from a value.
   * If the value is null or undefined, it will create a None, else a Some.
   */
  <T>(value: T | null | undefined): Option<T>

  /**
   * Returns whether the passed value is an Option (either a Some or a None).
   */
  isOption(value: any): value is Option<{}>

  /**
   * Creates a new Option holding the tuple of all the passed values if they were all Some or non null/undefined values,
   * else returns None
   */
  all<T1, T2>(t1: NullableValue<T1>, t2: NullableValue<T2>): Option<[T1, T2]>
  all<T1, T2, T3>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>): Option<[T1, T2, T3]>
  all<T1, T2, T3, T4>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>, t4: NullableValue<T4>): Option<[T1, T2, T3, T4]>
  all<T1, T2, T3, T4, T5>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>, t4: NullableValue<T4>, t5: NullableValue<T5>): Option<[T1, T2, T3, T4, T5]>
  all<T>(...ts: Array<NullableValue<T>>): Option<T[]>
}

// The Option factory / static object
const OptionObject = function<T>(value: T): Option<T> {
  return isDef(value) ? Some(value) : None
} as OptionObject

OptionObject.all = (...args: any[]): any => {
  const values: any[] = []

  for (let i = 0; i < args.length; i++) {
    let value = args[i]
    if (Option.isOption(value)) value = value.get()
    if (!isDef(value)) return None
    values.push(value)
  }

  return Some(values)
}

OptionObject.isOption = function(value: any): value is Option<{}> {
  return !!value && (value.type === 'some' || value.type === 'none')
}

function makeNone() {
  const self: any = {}

  function returnNone() { return None }

  self.type = 'none'
  self.get = () => undefined
  self.isDefined = () => false
  self.forEach = () => {}
  self.map = returnNone
  self.flatMap = returnNone
  self.filter = returnNone
  self.fold = (ifEmpty: Function) => ifEmpty() 
  self.orElse = (alt: Function) => alt()
  self.getOrElse = (alt: any) => alt
  self.toArray = () => lift([])
  self.toString = () => 'None'
  self.toJSON = () => null

  return self as None
}

function _Some<T>(this: Some<T> & { value: T }, value: T) {
  this.value = value
}

_Some.prototype = {

  type: 'some',

  get() {
    return this.value
  },

  isDefined() {
    return true
  },

  forEach(fn: any) {
    fn(this.value)
  },

  map(fn: any): any {
    return Option(getValue(fn(this.value)))
  },

  flatMap(fn: any) {
    return fn(this.value)
  },

  filter(fn: any) {
    return fn(this.value) ? this : None
  },

  fold(ifEmpty: any, ifDefined: any) {
    return ifDefined(this.value)
  },

  orElse() {
    return this
  },

  getOrElse() {
    return this.value
  },

  toArray() {
    return lift([this.value])
  },

  toString() {
    return `Some(${this.value})`
  },

  toJSON() {
    return this.value
  }
}

function isDef<T>(value: T | null | undefined): value is T  {
  return value !== null && value !== undefined
}


export const Option = OptionObject

/** Creates a new Some instance using a non nullable value */
// extends {} to prevent null and undefined being passed
export function Some<T extends {}>(value: T): Some<T> {
  return new (_Some as any)(value)
}

export const None = makeNone()