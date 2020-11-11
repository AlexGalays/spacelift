type UnionDescription = Record<string, (...args: any[]) => any>

type UnionResult<T extends UnionDescription> = {
  T: Union<T>
  is: <NAME extends keyof T>(
    name: NAME
  ) => <U extends Union<T>>(other: U) => other is ReturnType<T[NAME]> & { type: NAME }
} & { [K in keyof T]: Factory<T[K], K> & { T: ReturnType<Factory<T[K], K>> } }

// Same as the std lib's ReturnType but without the constraint on T as the compiler can't check it against Arguments<F>
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any

type Factory<F extends (...args: any[]) => any, TYPE> = (
  ...args: Arguments<F>
) => F extends (...args: any[]) => infer R
  ? { [K in keyof R | 'type']: K extends 'type' ? TYPE : R[K & keyof R] }
  : (...args: any[]) => any

type Union<T extends UnionDescription> = {
  [K in keyof T]: { [K2 in keyof ReturnType<T[K]> | 'type']: K2 extends 'type' ? K : ReturnType<T[K]>[K2] }
}[keyof T]

// Note: This has a small limitation in tooltips: https://github.com/Microsoft/TypeScript/issues/28127
type Arguments<T extends (...args: any[]) => any> = T extends (...args: infer A) => any ? A : []

/**
 * Creates a type-safe union, providing: derived types, factories and type-guards in a single declaration.
 */
export function createUnion<D extends UnionDescription>(description: D): UnionResult<D> {
  const factories = Object.keys(description).reduce((acc, key) => {
    const factory = description[key]
    const factoryWithType = (...args: any[]) => ({ type: key, ...factory.apply(null, args) })
    acc[key] = factoryWithType
    return acc
  }, {} as any)

  const isCache: any = {}
  function is(type: string): any {
    if (isCache[type]) return isCache[type]
    isCache[type] = (obj: any) => obj.type === type
    return isCache[type]
  }

  return {
    ...factories,
    is
  } as any
}

export function empty() {
  return {}
}
