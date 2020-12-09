import { lift, immutable } from '..'

describe('Set', () => {
  it('can be unwrapped', () => {
    const set = new Set([1, 2])
    const unwrapped = lift(set).value()
    expect(unwrapped).toBe(set)
    expect(set instanceof Set).toBe(true)

    // The unwrapped Set retained its original mutability.
    unwrapped.add
  })

  it('can add an item', () => {
    const set = new Set([1, 2])
    const set2 = immutable(set)

    const updated = lift(set).add(3).value()
    const updated2 = lift(set2).add(3).value()

    // Type assertion
    const _updated: Set<number> = updated
    const _updated2: ReadonlySet<number> = updated2

    expect(updated).toEqual(new Set([1, 2, 3]))
  })

  it('can add multiple items', () => {
    const set = new Set([1, 2])
    const set2 = immutable(set)

    const updated = lift(set)
      .addAll([3, 4])
      .addAll(new Set([5, 6]))
      .value()

    const updated2 = lift(set2)
      .addAll([3, 4])
      .addAll(new Set([5, 6]))
      .value()

    // Type assertion
    const _updated: Set<number> = updated
    const _updated2: ReadonlySet<number> = updated2

    expect(updated).toEqual(new Set([1, 2, 3, 4, 5, 6]))
  })

  it('can compute its intersection with other sets', () => {
    const set = new Set([2, 8])

    const result = lift(set)
      .intersection(new Set([3, 2]))
      .value()

    const result2 = lift([new Set([3, 2]), new Set([2, 2]), new Set([2, 4])])
      .reduce(lift(set), (result, set) => result.intersection(set))
      .value()

    expect(result).toEqual(new Set([2]))
    expect(result2).toEqual(new Set([2]))
  })

  it('can compute its differences with other sets', () => {
    const set = new Set([2, 8])

    const result = lift(set)
      .difference(new Set([3, 2]))
      .value()

    const result2 = lift([new Set([3, 2]), new Set([2, 2]), new Set([2, 4])])
      .reduce(lift(set), (result, set) => result.difference(set))
      .value()

    expect(result).toEqual(new Set([8]))
    expect(result2).toEqual(new Set([8]))
  })

  it('can delete an item', () => {
    const set = new Set([1, 2])
    const set2 = immutable(set)

    const updated = lift(set).delete(2).value()
    const updated2 = lift(set2).delete(2).value()

    // Type assertion
    const _updated: Set<number> = updated
    const _updated2: ReadonlySet<number> = updated2

    expect(updated).toEqual(new Set([1]))
  })

  it('can be cleared', () => {
    const set = new Set([1, 2])
    const set2 = immutable(set)

    const updated = lift(set).clear().value()
    const updated2 = lift(set2).clear().value()

    // Type assertion
    const _updated: Set<number> = updated
    const _updated2: ReadonlySet<number> = updated2

    expect(updated).toEqual(new Set())
  })

  it('can use collect()', () => {
    const set = new Set([1, 2])
    const set2 = immutable(set)

    const updated = lift(set)
      .collect(item => {
        if (item === 1) return

        return String(item * 2)
      })
      .value()

    const updated2 = lift(set2)
      .collect(item => {
        if (item === 1) return

        return String(item * 2)
      })
      .value()

    // Type assertion
    const _updated: Set<string> = updated
    const _updated2: ReadonlySet<string> = updated2

    expect(updated).toEqual(new Set(['4']))
  })

  it('can be filtered', () => {
    const set = new Set([1, 2])
    const set2 = immutable(set)

    const updated = lift(set)
      .filter(item => item === 1)
      .value()
    const updated2 = lift(set2)
      .filter(item => item === 1)
      .value()

    // Type assertion
    const _updated: Set<number> = updated
    const _updated2: ReadonlySet<number> = updated2

    expect(updated).toEqual(new Set([1]))
  })

  it('can be converted to an Array', () => {
    const set = new Set([1, 2])
    const set2 = immutable(set)

    const updated = lift(set).toArray().value()
    const updated2 = lift(set2).toArray().value()

    // Type assertion
    const _updated: Array<number> = updated
    const _updated2: ReadonlyArray<number> = updated2

    expect(updated).toEqual([1, 2])
  })

  it('can be arbitrarily transformed', () => {
    const set = new Set([1, 2])
    const set2 = immutable(set)

    const updated = lift(set)
      .pipe(set => lift(set).add(3).value())
      .value()
    const updated2 = lift(set2)
      .pipe(item => lift(set).add(3))
      .value()

    // Type assertion
    const _updated: Set<number> = updated
    const _updated2: ReadonlySet<number> = updated2

    expect(updated).toEqual(new Set([1, 2, 3]))
  })
})
