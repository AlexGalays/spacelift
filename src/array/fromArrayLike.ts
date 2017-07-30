import { ArrayOps } from '../wrapper'

/**
 * Converts an Array-like object (such as an arguments or NodeList instance) to a regular Array
 */
export function fromArrayLike<T>(arrayLike: ArrayLike<T>): ArrayOps<T> {
  return new ArrayOps([].slice.call(arrayLike)) as ArrayOps<T>
}
