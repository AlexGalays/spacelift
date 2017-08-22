
/** Returns whether an object is an Array */
export const array = Array.isArray

/** Returns whether this object is a function */
export function func(obj: {}): obj is Function {
  return (typeof obj === 'function')
}

/** Returns whether this object is a string */
export function string(obj: {}): obj is string {
  return (typeof obj === 'string')
}

/** Returns whether this object is a number */
export function number(obj: {}): obj is number {
  return (typeof obj === 'number')
}

/** Returns whether this object is a boolean */
export function boolean(obj: {}): obj is boolean {
  return (typeof obj === 'boolean')
}

/** Returns whether this value is an object (e.g not a primitive: dates, arrays, functions, objects, regexes, `new Number(0)`, and `new String('')) */
export function object(obj: {}): obj is object {
  const type = typeof obj
  return (type == 'object' || type == 'function')
}
