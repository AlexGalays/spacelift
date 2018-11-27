/**
 * Creates a type safe string enumeration from a list of strings, providing:
 * the list of all possible values, an object with all enum keys and the derived type of the enum in a single declaration.
 */
export function createEnum<T extends string>(
  ...values: T[]
): {
  T: T
  enum: { [K in T]: K }
  values: T[]
} {
  const enumeration: any = {}

  values.forEach(v => (enumeration[v] = v))
  
  return {
    enum: enumeration,
    values
  } as any
}