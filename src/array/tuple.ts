
/**
 * Creates a tuple.
 * typescript can usually infer when a tuple should be used instead of an Array, but not always, use this to force a typle type.
 */
export function tuple<A, B>(a: A, b: B): [A, B]

/**
 * Creates a tuple.
 * typescript can usually infer when a tuple should be used instead of an Array, but not always, use this to force a typle type.
 */
export function tuple<A, B, C>(a: A, b: B, c: C): [A, B, C]

/**
 * Creates a tuple.
 * typescript can usually infer when a tuple should be used instead of an Array, but not always, use this to force a typle type.
 */
export function tuple<A, B, C, D>(a: A, b: B, c: C, d: D): [A, B, C, D]

/**
 * Creates a tuple.
 * typescript can usually infer when a tuple should be used instead of an Array, but not always, use this to force a typle type.
 */
export function tuple<A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): [A, B, C, D, E]

/**
 * Creates a tuple.
 * typescript can usually infer when a tuple should be used instead of an Array, but not always, use this to force a typle type.
 */
export function tuple<A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): [A, B, C, D, E, F]

/**
 * Creates a tuple.
 * typescript can usually infer when a tuple should be used instead of an Array, but not always, use this to force a typle type.
 */
export function tuple<A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): [A, B, C, D, E, F, G]

/**
 * Creates a tuple.
 * typescript can usually infer when a tuple should be used instead of an Array, but not always, use this to force a typle type.
 */
export function tuple<A, B, C, D, E, F, G, H>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): [A, B, C, D, E, F, G, H]


export function tuple(...arr: any[]): any {
  return arr
}