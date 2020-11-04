export function getValue<A>(input: A | Wrapper<A>): A {
  return isWrapper(input) ? input.value() : input
}

export interface Wrapper<T> {
  value(): T
}

export function isWrapper<A>(obj: A | Wrapper<A>): obj is Wrapper<A> {
  return obj && (obj as any)['_isLiftWrapper']
}
