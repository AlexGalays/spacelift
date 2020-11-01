import lift from '..'

describe('Object', () => {
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
  })

  it("can return whether it's empty", () => {
    expect(lift({}).isEmpty()).toBe(true)
    expect(lift({ a: undefined }).isEmpty()).toBe(false)
    expect(lift({ a: 10 }).isEmpty()).toBe(false)
  })
})
