import * as is from '../src/is'

describe('is', () => {
  it('works', () => {
    expect(is.array(null)).toBe(false)
    expect(is.array(undefined)).toBe(false)
    expect(is.array([])).toBe(true)

    expect(is.func({})).toBe(false)
    expect(is.func(() => {})).toBe(true)

    const arr = [1, undefined, 2, 3, undefined, null]
    const filtered = arr.filter(is.defined)
    filtered.forEach(n => n.toExponential())
  })
})
