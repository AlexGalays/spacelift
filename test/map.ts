import lift, { createUnion } from '..'
import { update } from '../src/immupdate'
import { empty } from '../src/union'

describe('Map', () => {
  it('can set a key/value', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])

    const result = lift(map).set(3, { id: 3, name: 'cc' }).value()

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

    const result = lift(map).delete(2).value()

    expect(result).toEqual(new Map([[1, { id: 1, name: 'aa' }]]))
    expect(result).not.toBe(map)
  })

  it('can collect its entries', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])

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

    expect(result).toEqual(new Map([[10, { id: 1, name: 'aa$' }]]))
    expect(result).not.toBe(map)
  })

  it('can filter its entries', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])

    const result = lift(map)
      .filter((key, value) => key === 2 && value.id === 2)
      .value()

    expect(result).toEqual(new Map([[2, { id: 2, name: 'bb' }]]))
    expect(result).not.toBe(map)
  })

  it('can filter and refine its entries', () => {
    const peopleUnion = createUnion({
      Jo: empty,
      Alicia: empty
    })
    type People = typeof peopleUnion.T
    const people = peopleUnion.factories

    const map = new Map<number, People>([
      [1, people.Jo()],
      [2, people.Alicia()]
    ])

    const result = lift(map)
      .filter((_key, value) => peopleUnion.is('Alicia')(value))
      .value()

    expect(result).toEqual(new Map([[2, people.Alicia()]]))
    expect(result).not.toBe(map)
  })

  it('can be converted to an Array', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])

    const result = lift(map).toArray().value()

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

    const result = lift(map).clear().value()

    expect(result).toEqual(new Map())
    expect(result).not.toBe(map)
  })

  it('can be deeply updated', () => {
    const map = new Map([
      [1, { id: 1, name: 'aa' }],
      [2, { id: 2, name: 'bb' }]
    ])

    const result = lift(map)
      .update(m => {
        const value = m.get(2)
        if (value) value.name = `${value.name}$`
      })
      .value()

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

    const result = lift(map)
      .mapValues(v =>
        update(v, draft => {
          draft.name = `${v.name}$`
        })
      )
      .value()

    expect(result).toEqual(
      new Map([
        [1, { id: 1, name: 'aa$' }],
        [2, { id: 2, name: 'bb$' }]
      ])
    )
    expect(result).not.toBe(map)
  })
})
