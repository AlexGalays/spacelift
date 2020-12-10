import { lift, createUnion, immutable } from '..'
import { update } from '../src/immupdate'

describe('Map', () => {
  it('can be unwrapped', () => {
    const map = new Map([[1, 1]])
    const unwrapped = lift(map).value()
    expect(unwrapped).toBe(map)
    expect(map instanceof Map).toBe(true)

    // The unwrapped Map retained its original mutability.
    unwrapped.set
  })

  it('can set a key/value', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map).set(3, { id: 3, name: 'cc' }).value()
    const result2 = lift(map2).set(3, { id: 3, name: 'cc' }).value()

    // Type assertion
    const _result: typeof map = result
    const _result2: typeof map2 = result2

    expect(result).toEqual(
      new Map([
        [1, { id: 1, name: 'aa' }],
        [2, { id: 2, name: 'bb' }],
        [3, { id: 3, name: 'cc' }]
      ])
    )
    expect(result).not.toBe(map)
  })

  it('can delete a key/value', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map).delete(2).value()
    const result2 = lift(map2).delete(2).value()

    // Type assertion
    const _result: typeof map = result
    const _result2: typeof map2 = result2

    expect(result).toEqual(new Map([[1, { id: 1, name: 'aa' }]]))
    expect(result).not.toBe(map)
  })

  it('can collect its entries', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map)
      .collect((key, value) => {
        if (key === 2) return
        return [
          key * 10,
          update(value, v => {
            v.name = `${v.name}$`
          })
        ]
      })
      .value()
    const result2 = lift(map2)
      .collect((key, value) => {
        if (key === 2) return
        return [
          key * 10,
          update(value, v => {
            v.name = `${v.name}$`
          })
        ]
      })
      .value()

    // Type assertion
    const _result: typeof map = result
    const _result2: typeof map2 = result2

    expect(result).toEqual(new Map([[10, { id: 1, name: 'aa$' }]]))
    expect(result).not.toBe(map)
  })

  it('allows its first item to be read', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const one = lift(map).first()
    const one2 = lift(map2).first()

    // Type assertion
    const _one: { id: number; name: string } | undefined = one
    const _one2: { id: number; name: string } | undefined = one2

    expect(one).toEqual({ id: 1, name: 'aa' })
    expect(one2).toEqual({ id: 1, name: 'aa' })
    expect(lift(new Map()).first()).toBe(undefined)
  })

  it('allows its last item to be read', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const one = lift(map).last()
    const one2 = lift(map2).last()

    // Type assertion
    const _one: { id: number; name: string } | undefined = one
    const _one2: { id: number; name: string } | undefined = one2

    expect(one).toEqual({ id: 2, name: 'bb' })
    expect(one2).toEqual({ id: 2, name: 'bb' })
    expect(lift(new Map()).last()).toBe(undefined)
  })

  it('can filter its entries', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map)
      .filter((key, value) => key === 2 && value.id === 2)
      .value()
    const result2 = lift(map2)
      .filter((key, value) => key === 2 && value.id === 2)
      .value()

    // Type assertion
    const _result: typeof map = result
    const _result2: typeof map2 = result2

    expect(result).toEqual(new Map([[2, { id: 2, name: 'bb' }]]))
    expect(result).not.toBe(map)
  })

  it('can filter and refine its entries', () => {
    const people = createUnion({
      Jo: () => ({}),
      Alicia: () => ({})
    })
    type People = typeof people.T

    const map = new Map<number, People>([
      [1, people.Jo()],
      [2, people.Alicia()]
    ])
    const map2 = immutable(map)

    const result = lift(map)
      .filter((_key, value) => people.is('Alicia')(value))
      .value()

    const result2 = lift(map2)
      .filter((_key, value) => people.is('Alicia')(value))
      .value()

    // Type assertion
    const _result: typeof map = result
    const _result2: typeof map2 = result2

    expect(result).toEqual(new Map([[2, people.Alicia()]]))
    expect(result).not.toBe(map)
  })

  it('can be converted to an Object', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map).toObject().value()
    const result2 = lift(map2).toObject().value()

    // Type assertion
    const _result: Record<number, { id: number; name: string } | undefined> = result
    const _result2: Readonly<Record<number, { id: number; name: string } | undefined>> = result2
    type TypeAssertion = SameTypes<typeof result[0], { id: number; name: string } | undefined>
    const _typeAssertion: TypeAssertion = true

    expect(result).toEqual({
      1: { id: 1, name: 'aa' },
      2: { id: 2, name: 'bb' }
    })
    expect(result).not.toBe(map)
  })

  it('can be converted to an Array', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map).toArray().value()
    const result2 = lift(map2).toArray().value()

    // Type assertion
    const _result: Array<[number, { id: number; name: string }]> = result
    const _result2: ReadonlyArray<[number, { id: number; name: string }]> = result2

    expect(result).toEqual([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    expect(result).not.toBe(map)
  })

  it('can be cleared', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map).clear().value()
    const result2 = lift(map2).clear().value()

    // Type assertion
    const _result: typeof map = result
    const _result2: typeof map2 = result2

    expect(result).toEqual(new Map())
    expect(result).not.toBe(map)
  })

  it('can be deeply updated', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map)
      .update(m => {
        const value = m.get(2)
        if (value) value.name = `${value.name}$`
      })
      .value()

    const result2 = lift(map2)
      .update(m => {
        const value = m.get(2)
        if (value) value.name = `${value.name}$`
      })
      .value()

    // Type assertion
    const _result: typeof map = result
    const _result2: typeof map2 = result2

    expect(result).toEqual(
      new Map([
        [1, { id: 1, name: 'aa' }],
        [2, { id: 2, name: 'bb$' }]
      ])
    )
    expect(result).not.toBe(map)
  })

  it('can map its values', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])
    const map2 = immutable(map)

    const result = lift(map)
      .mapValues(v =>
        update(v, draft => {
          draft.name = `${v.name}$`
        })
      )
      .value()

    const result2 = lift(map2)
      .mapValues(v =>
        update(v, draft => {
          draft.name = `${v.name}$`
        })
      )
      .value()

    // Type assertion
    const _result: typeof map = result
    const _result2: typeof map2 = result2

    expect(result).toEqual(
      new Map([
        [1, { id: 1, name: 'aa$' }],
        [2, { id: 2, name: 'bb$' }]
      ])
    )
    expect(result).not.toBe(map)
  })

  it('can be arbitrarily transformed', () => {
    const map = new Map([
      ['1', 10],
      ['2', 20]
    ])

    // Map -> Map
    const result = lift(map)
      .pipe(map => {
        return lift(map).mapValues(n => n * 2)
      })
      .value()

    expect(result).toEqual(
      new Map([
        ['1', 20],
        ['2', 40]
      ])
    )

    // Map -> Object
    const result2 = lift(map).pipe(_ => ({ a: 1, b: 2 }))
    expect(result2.value()).toEqual({ a: 1, b: 2 })

    // Map -> string
    const result3 = lift(map).pipe(_ => 'ohoh')
    expect(result3).toBe('ohoh')

    // Object -> Map
    const result4 = lift({ a: 1, b: 2 }).pipe(_ => map)
    expect(result4.value()).toEqual(
      new Map([
        ['1', 10],
        ['2', 20]
      ])
    )

    // Object -> MapWrapper
    const result5 = lift({ a: 1, b: 2 }).pipe(_ =>
      lift(
        new Map([
          ['1', 10],
          ['2', 20]
        ])
      )
    )
    expect(result5.value()).toEqual(
      new Map([
        ['1', 10],
        ['2', 20]
      ])
    )

    // Type assertion
    const _result: Map<string, number> = result
    const _result2: { a: number; b: number } = result2.value()
    const _result3: string = result3
    const _result4: Map<string, number> = result4.value()
    const _result5: Map<string, number> = result5.value()
  })
})

type SameTypes<T, U, Y = true, N = false> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U
  ? 1
  : 2
  ? Y
  : N
