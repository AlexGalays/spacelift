import lift, { Set, is } from '..'

describe('Object', () => {
  it('can read the value associated to a key', () => {
    const obj = { a: 1, b: '2', c: { d: 10 } }
    const result = lift(obj).get('b')
    expect(result.get()).toBe('2')

    const map: Record<string, number | undefined> = { a: 1, b: 2, c: 3 }
    const result2 = lift(map)
      .get('d')
      .map(x => x.toFixed(3)) // toFixed to prove we got an Option<number> back
    expect(result2.get()).toBe(undefined)

    const set = Set<string>('1', '2', '3')
    const result3 = set.get('2').get()
    expect(result3).toBe(true)
    const result4 = set.get('4').get()
    expect(result4).toBe(undefined)
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
    const result2 = lift(obj2)
      .remove('c')
      .add('f', [3, 4])
      .remove('d')
      .add('g', [3, 4])
      .remove('f')
      .value()

    expect(result2).toEqual({ a: 1, b: 2, e: true, g: [3, 4] })
  })

  it('can map the values of an object', () => {
    const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
    const result = lift(obj)
      .mapValues((key, value) => value * 2)
      .value()
    expect(result).not.toBe(obj)
    expect(result).toEqual({ a: 2, b: 4, c: 6 })
  })

  it('can be converted to an Array', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = lift(obj)
      .toArray()
      .sort({ by: ([k, v]) => k })
      .value()

    expect(result).not.toBe(obj as any)
    expect(result).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3]
    ])
  })

  it('can convert is keys to an Array', () => {
    const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
    const result = lift(obj).keys().sort().value()
    expect(result).not.toBe(obj as any)
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('can convert is values to an Array', () => {
    const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
    const result = lift(obj).values().sort().value()
    expect(result).not.toBe(obj as any)
    expect(result).toEqual([1, 2, 3])
  })

  it('can be created as a Set-like object', () => {
    const obj = Set('a', 'b', 'c').value()
    expect(obj).toEqual({ a: true, b: true, c: true })
  })

  it('can determine whether an object is of a certain type', () => {
    expect(is.array(null)).toBe(false)
    expect(is.array(undefined)).toBe(false)
    expect(is.array([])).toBe(true)

    expect(is.func({})).toBe(false)
    expect(is.func(() => {})).toBe(true)
  })

  it("can return whether it's empty", () => {
    expect(lift({}).isEmpty()).toBe(true)
    expect(lift({ a: undefined }).isEmpty()).toBe(false)
    expect(lift({ a: 10 }).isEmpty()).toBe(false)
  })

  it('can return whether it contains a key', () => {
    expect(lift({}).contains('a')).toBe(false)
    expect(lift({ b: 10 }).contains('a')).toBe(false)
    expect(lift({ b: 10 }).contains('b')).toBe(true)
    expect(lift({ b: undefined }).contains('b')).toBe(true)
    expect(lift({ b: null }).contains('b')).toBe(true)
  })
})
