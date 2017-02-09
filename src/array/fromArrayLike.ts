import { ArrayOps } from '../'

/**
 * Converts an Array-like object (such as an arguments or NodeList instance) to a regular Array
 */
export default function<T>(arrayLike: ArrayLike<T>): ArrayOps<T> {
  return new ArrayOps([].slice.call(arrayLike)) as ArrayOps<T>
}
