import { lift, immutable } from '..'

describe('Object', () => {
  it('can be cloned', () => {
    const obj = { a: 1, b: 2 }
    const obj2 = immutable(obj)

    const cloned = lift(obj).clone().value()
    const cloned2 = lift(obj2).clone().value()

    // Type assertion
    const _cloned: typeof obj = cloned
    const _cloned2: typeof obj2 = cloned2

    expect(cloned).not.toBe(obj)
    expect(cloned).toEqual(obj)
  })

  it('can add a key/value', () => {
    const obj2 = { a: 1, b: 2 }
    const result2 = lift(obj2).add('c', 3).add('d', 'ohhhh').value()

    const y = lift(obj2).add('AA', 3)

    expect(result2).toEqual({ a: 1, b: 2, c: 3, d: 'ohhhh' })
  })

  it('can remove a key', () => {
    const obj2 = { a: 1, b: 2, c: 'aaa', d: [1, 2] }
    const result2 = lift(obj2).remove('c').remove('d').value()

    expect(result2).toEqual({ a: 1, b: 2 })

    const obj4 = { 0: 1, 1: 2, 2: 'aaa', 3: [1, 2] }
    const result4 = lift(obj4).remove(2).remove(3).value()

    expect(result4).toEqual({ 0: 1, 1: 2 })
  })

  it('can add and remove keys on the same host', () => {
    const obj2 = { a: 1, b: 2, c: 'aaa', d: [1, 2], e: true }
    const result2 = lift(obj2).remove('c').add('f', [3, 4]).remove('d').add('g', [3, 4]).remove('f').value()

    expect(result2).toEqual({ a: 1, b: 2, e: true, g: [3, 4] })
  })

  it('can convert is keys to an Array', () => {
    const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
    const result = lift(obj).keys().sort().value()
    expect(result).not.toBe(obj)
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('can convert is values to an Array', () => {
    const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
    const result = lift(obj).values().sort().value()
    expect(result).not.toBe(obj)
    expect(result).toEqual([1, 2, 3])

    // Type assertion
    const _array: number[] = result
  })

  it("can return whether it's empty", () => {
    expect(lift({}).isEmpty()).toBe(true)
    expect(lift({ a: undefined }).isEmpty()).toBe(false)
    expect(lift({ a: 10 }).isEmpty()).toBe(false)
  })

  it('can provide collect() via Map()', () => {
    const obj = { a: 1, b: 2, c: 3 }

    const result = lift(obj)
      .toMap()
      .collect((key, value) => {
        if (key === 'b') return
        return [key + '$', value * 2]
      })
      .toObject()
      .value()

    expect(result).toEqual({
      a$: 2,
      c$: 6
    })
  })

  it('can be converted to a Map', () => {
    const obj = { a: 1, b: 2, c: '3' }
    const obj2 = immutable(obj)
    const obj3: Record<number, string> = { 1: '10', 2: '20' }

    const map = lift(obj).toMap().value()
    const map2 = lift(obj2).toMap().value()
    const map3 = lift(obj3).toMap().value()

    const _map: Map<'a' | 'b' | 'c', number | string> = map
    const _map2: Map<'a' | 'b' | 'c', number | string> = map2
    const _map3: Map<string, string> = map3

    expect(map3).toEqual(
      new Map([
        ['1', '10'],
        ['2', '20']
      ])
    )
  })

  it('can be converted to an Array', () => {
    const obj = { a: 1, b: 2, c: 3 }

    const array = lift(obj).toArray().value()

    // Type assertion
    const _array: Array<['a' | 'b' | 'c', number]> = array
    const _obj = lift(_array)
      .fold({} as typeof obj, (result, [key, value]) => {
        result[key] = value
        return result
      })
      .value()

    expect(array).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3]
    ])

    // Type assertion (object keys are ALWAYS strings)
    const _array2: Array<[string, number]> = lift({ 1: 1, 2: 2 }).toArray().value()
  })
})
