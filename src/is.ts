/** Returns whether an object is an Array */
export const array: (obj: unknown) => obj is Array<unknown> = Array.isArray

/** Returns whether this object is neither null or undefined */
export function defined<T>(obj: T): obj is NonNullable<T> {
  return obj !== null && obj !== undefined
}

/** Returns whether this object is a function */
export function func(obj: unknown): obj is Function {
  return typeof obj === 'function'
}

/** Returns whether this object is a string */
export function string(obj: unknown): obj is string {
  return typeof obj === 'string'
}

/** Returns whether this object is a number */
export function number(obj: unknown): obj is number {
  return typeof obj === 'number'
}

/** Returns whether this object is a boolean */
export function boolean(obj: unknown): obj is boolean {
  return typeof obj === 'boolean'
}

/** Returns whether this value is a plain object */
export function object(obj: unknown): obj is object {
  return Object.getPrototypeOf(obj) === Object.prototype
}
