
/** Returns whether an object is an Array */
export const array = Array.isArray

/** Returns whether this object is a function */
export function func(obj: {}): obj is Function {
  return (typeof obj === 'function')
}

export function string(obj: {}): obj is string {
  return (typeof obj === 'string')
}

export function number(obj: {}): obj is number {
  return (typeof obj === 'number')
}

export function boolean(obj: {}): obj is boolean {
  return (typeof obj === 'boolean')
}

/** Returns whether this value is an object (e.g not a primitive: arrays, functions, objects, regexes, `new Number(0)`, and `new String('')) */
export function object(obj: {}): obj is object {
  const type = typeof obj
  return (type == 'object' || type == 'function')
}
