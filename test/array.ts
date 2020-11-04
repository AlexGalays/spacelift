import { lift, range } from '../'
import { update } from '../src/immupdate'

describe('Array', () => {
  it('can be unwrapped', () => {
    const arr = [1, 2, 3]
    const unwrapped = lift(arr).value()
    expect(unwrapped).toBe(arr)
    expect(arr instanceof Array).toBe(true)

    // The unwrapped Array retained its mutability.
    unwrapped.push
  })

  it('can be mapped', () => {
    const arr = [1, 2, 3]
    const mapped = lift(arr)
      .map(x => x * 2)
      .value()
    expect(mapped).toEqual([2, 4, 6])
    expect(mapped instanceof Array).toBe(true)
    expect(mapped).not.toBe(arr)

    // The map iterator can also return Wrappers
    const mapped2 = lift(arr)
      .map(x => lift(x * 2))
      .value()
    expect(mapped2).toEqual([2, 4, 6])
  })

  it('can be flatMapped', () => {
    const arr = [1, 2, 3]
    const mapped = lift(arr)
      .flatMap(x => [x + 1, x + 2])
      .value()
    expect(mapped).toEqual([2, 3, 3, 4, 4, 5])

    // The flatMap iterator can also return Wrappers
    const mapped3 = lift(arr)
      .flatMap(x => lift([x + 1, x + 2]))
      .value()
    expect(mapped3).toEqual([2, 3, 3, 4, 4, 5])

    // Intermediary chaining, test inference
    const mapped4 = lift([1, 2, 3, 2, 1])
      .flatMap(x => lift([x + 1, x + 2]))
      .map(y => y + 1)
      .distinct()
      .value()
    expect(mapped4).toEqual([3, 4, 5, 6])
  })

  it('can be filtered', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const filtered = lift(arr)
      .map(n => n * 2)
      .filter(n => n > 6)
      .value()

    expect(filtered).toEqual([8, 10, 12])
    expect(filtered instanceof Array).toBe(true)
    expect(filtered).not.toBe(arr)

    type A = { type: 'a'; a: number }
    type B = { type: 'b'; b: string }
    type Union = A | B
    const isA = (u: Union): u is A => u.type === 'a'

    const arr2: Union[] = [
      { type: 'a', a: 10 },
      { type: 'a', a: 20 },
      { type: 'b', b: '30' }
    ]

    // It should now have been refined as an Array of as, but is not
    const filtered2: A[] = arr2.filter(isA)

    expect(filtered2).toEqual([
      { type: 'a', a: 10 },
      { type: 'a', a: 20 }
    ])
  })

  it('can append an item', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const updated = lift(arr).append(7).value()
    expect(updated).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(updated).not.toBe(arr)
  })

  it('can append an Array item', () => {
    const arr = [[1], [2], [3], [4], [5], [6]]
    const updated = lift(arr).append([7]).value()
    expect(updated).toEqual([[1], [2], [3], [4], [5], [6], [7]])
    expect(updated).not.toBe(arr)
  })

  it('can append an Array of items', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const updated = lift(arr).appendAll([7, 8, 9, 10]).value()
    expect(updated).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(updated).not.toBe(arr)
  })

  it('can insert an item', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const updated = lift(arr).insert(2, 300).value()
    expect(updated).toEqual([1, 2, 300, 3, 4, 5, 6])
    expect(updated).not.toBe(arr)
  })

  it('can replace an item at a given index', () => {
    const arr = [1, 2, 3, 4, 5, 6]

    const updated = lift(arr)
      .updateAt(-1, n => n * 2)
      .updateAt(2, n => lift(n * 1000)) // test that we can return a lifted value as well
      .updateAt(5, n => n * 100)
      .updateAt(1000, n => n / 10)
      .value()

    expect(updated).toEqual([1, 2, 3000, 4, 5, 600])
    expect(updated).not.toBe(arr)
  })

  it("won't replace an item if the given index is out of bounds", () => {
    const arr = [
      { id: 1, label: 'one' },
      { id: 2, label: 'two' }
    ]
    const updated = lift(arr)
      .updateAt(-1, item =>
        update(item, draft => {
          draft.label = draft.label.toUpperCase()
        })
      )
      .updateAt(1000, item =>
        update(item, draft => {
          draft.label = draft.label.toUpperCase()
        })
      )
      .value()

    expect(updated).toEqual(arr)
  })

  it('can remove an item at a given index', () => {
    const arr = ['a', 'b', 'c', 'd', 'e', 'f']
    const updated = lift(arr).removeAt(2).value()

    expect(updated).toEqual(['a', 'b', 'd', 'e', 'f'])
    expect(updated).not.toBe(arr)
  })

  it("won't remove an item if the given index is negative", () => {
    const arr = ['a', 'b', 'c', 'd', 'e', 'f']
    const updated = lift(arr).removeAt(-1).value()

    expect(updated).toEqual(arr)
  })

  it('can remove all falsy values', () => {
    const arr = [undefined, 'a', '', 'b', false, 'c', undefined, 'd', 'e', null, null, 'f', 0]
    const updated = lift(arr).compact().value()

    expect(updated).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    expect(updated).not.toBe(arr as any)

    const updated2 = lift(['', 'hey']).compact().value()
    expect(updated2).toEqual(['hey'])
  })

  it('can be flattened', () => {
    const arr = [[1, 2], [3], [], [4, 5, 6]]
    const result = lift(arr).flatten().value()
    expect(result).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('can count items satisfying a predicate', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3]
    const count = lift(arr).count(n => n > 3)

    expect(count).toBe(7)
  })

  it('can keep only the first ocurrence of any encountered item', () => {
    const arr = [{ id: 10 }, { id: 20 }, { id: 10 }, { id: 30 }, { id: 40 }, { id: 40 }]
    const result = lift(arr)
      .distinct(u => u.id)
      .value()
    expect(result).toEqual([{ id: 10 }, { id: 20 }, { id: 30 }, { id: 40 }])
    expect(result[0]).toBe(arr[0])
    expect(result[1]).toBe(arr[1])
    expect(result[2]).toBe(arr[3])
    expect(result[3]).toBe(arr[4])

    const arr2 = ['7', 1, 2, 2, 1, '3', '7', '2', '3']
    const result2 = lift(arr2).distinct().value()
    expect(result2).toEqual(['7', 1, 2, '3', '2'])
  })

  it('can be sliced from the left', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const result = lift(arr).take(3).value()
    expect(result).toEqual([1, 2, 3])
  })

  it('can be sliced from the right', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const result = lift(arr).takeRight(3).value()
    expect(result).toEqual([4, 5, 6])
  })

  it('can create a Map, grouping all items by key', () => {
    const arr = [
      { age: 10, name: 'jon' },
      { age: 30, name: 'momo' },
      { age: 10, name: 'kiki' },
      { age: 28, name: 'jesus' },
      { age: 29, name: 'frank' },
      { age: 30, name: 'michel' }
    ]

    const result = lift(arr)
      .groupBy(p => p.age)
      .value()

    expect([...result.entries()]).toEqual([
      [
        10,
        [
          { age: 10, name: 'jon' },
          { age: 10, name: 'kiki' }
        ]
      ],
      [
        30,
        [
          { age: 30, name: 'momo' },
          { age: 30, name: 'michel' }
        ]
      ],
      [28, [{ age: 28, name: 'jesus' }]],
      [29, [{ age: 29, name: 'frank' }]]
    ])
  })

  it('can be reversed', () => {
    const arr = [1, 2, 3, 4]
    const result = lift(arr).reverse().value()
    expect(result).toEqual([4, 3, 2, 1])
  })

  it('allows its first item to be read', () => {
    const arr = [1, 2, 3, 4]
    const one = lift(arr).first()
    expect(one).toBe(1)
    expect(lift([]).first()).toBe(undefined)
  })

  it('allows its last item to be read', () => {
    const arr = [1, 2, 3, 4]
    const four = lift(arr).last()
    expect(four).toBe(4)
    expect(lift([]).last()).toBe(undefined)
  })

  it('allows an item to be read by index', () => {
    const arr = [1, 2, 3, 4]
    const item = lift(arr).get(2)
    expect(item).toBe(3)
    expect(lift(arr).get(999)).toBe(undefined)
  })

  it.only('can be sorted', () => {
    let sorted: ReadonlyArray<any>

    // Numbers
    const arr = [5, 4, 1, 6, 2, 4, 3]
    sorted = lift(arr).sort().value()
    expect(sorted).not.toBe(arr)
    expect(sorted).toEqual([1, 2, 3, 4, 4, 5, 6])

    // String sort uses localeCompare
    const arr3 = 'ä ba bb bä bz a e è é aa ae b ss sz sa st ß'.split(' ')
    sorted = lift(arr3).sort().value()
    expect(sorted.join(' ')).toBe('a ä aa ae b ba bä bb bz e é è sa ss ß st sz')

    // String sort + ignoreCase
    const arr4 = ['e', 'c', 'ca', 'A', 'F', 'd', 'b']
    sorted = lift(arr4)
      .sort(item => item.toLowerCase())
      .value()
    expect(sorted).toEqual(['A', 'b', 'c', 'ca', 'd', 'e', 'F'])

    // null and undefined should be in tail position
    const arr6 = ['e', 'c', '', undefined, 'ca', null, 'A', undefined, 'F', null, 'd', 'b']
    sorted = lift(arr6)
      .sort(item => item && item.toLowerCase())
      .value()
    expect(sorted).toEqual(['', 'A', 'b', 'c', 'ca', 'd', 'e', 'F', null, null, undefined, undefined])

    // By field
    const people = [
      { name: 'Jesse', creationDate: 2 },
      { name: 'Walt', creationDate: 1 },
      { name: 'Mike', creationDate: 4 },
      { name: 'Skyler', creationDate: 3 }
    ]

    sorted = lift(people)
      .sort(p => p.creationDate)
      .map(p => p.name)
      .value()

    expect(sorted).toEqual(['Walt', 'Jesse', 'Skyler', 'Mike'])

    // Double-sort
    const people2 = [
      { name: 'Jesse', age: 44 },
      { name: 'Walt', age: 18 },
      { name: 'Mike', age: 20 },
      { name: 'Skyler', age: 37 },
      { name: 'Walt', age: 100 },
      { name: 'Tonton', age: 18 },
      { name: 'Jesse', age: 20 }
    ]

    sorted = lift(people2)
      .sort(p => p.age)
      .sort(p => p.name)
      .value()

    expect(sorted).toEqual([
      { name: 'Jesse', age: 20 },
      { name: 'Jesse', age: 44 },
      { name: 'Mike', age: 20 },
      { name: 'Skyler', age: 37 },
      { name: 'Tonton', age: 18 },
      { name: 'Walt', age: 18 },
      { name: 'Walt', age: 100 }
    ])

    sorted = lift(people2)
      .sort(
        p => p.name,
        p => p.age
      )
      .value()

    expect(sorted).toEqual([
      { name: 'Jesse', age: 20 },
      { name: 'Jesse', age: 44 },
      { name: 'Mike', age: 20 },
      { name: 'Skyler', age: 37 },
      { name: 'Tonton', age: 18 },
      { name: 'Walt', age: 18 },
      { name: 'Walt', age: 100 }
    ])
  })

  it('can fold its items', () => {
    const arr = ['a', 'b', 'c', 'd']
    const result = lift(arr).fold('zzz', (acc, value) => acc + value)

    expect(result).toBe('zzzabcd')

    expect(lift([] as string[]).fold('zzz', (acc, value) => acc + value)).toBe('zzz')

    const arr2 = [1, 2, 3]
    const seed2: number[] = []
    const result2 = lift(arr2).fold(seed2, (acc, value) => acc.concat(value))
    expect(result2.value()).toEqual([1, 2, 3])
  })

  it('can drop some items', () => {
    const arr = ['a', 'b', 'c', 'd']
    const result = lift(arr).drop(2).value()
    expect(result).toEqual(['c', 'd'])
    expect(lift(arr).drop(100).value()).toEqual([])
  })

  it('can drop some items from its right side', () => {
    const arr = ['a', 'b', 'c', 'd']
    const result = lift(arr).dropRight(2).value()
    expect(result).toEqual(['a', 'b'])
    expect(lift(arr).dropRight(100).value()).toEqual([])
  })

  it('can be converted to a Set-like object', () => {
    const arr = ['a', 'b', 'c', 'd']
    const result = lift(arr).toSet().value()
    expect(result).toEqual(new Set(['a', 'b', 'c', 'd']))

    const arr2 = [1, 2, 3, 4]
    const result2 = lift(arr2).toSet().value()
    expect(result2).toEqual(new Set([1, 2, 3, 4]))
  })

  it('can create a range', () => {
    const singleArgRange = range(5).value()
    expect(singleArgRange).toEqual([0, 1, 2, 3, 4])

    const rangeWithoutStep = range(1, 4).value()
    expect(rangeWithoutStep).toEqual([1, 2, 3, 4])

    const rangeWithStepOfOne = range(1, 4, 1).value()
    expect(rangeWithStepOfOne).toEqual([1, 2, 3, 4])

    const rangeWithStepOfFive = range(0, 15, 5).value()
    expect(rangeWithStepOfFive).toEqual([0, 5, 10, 15])

    const rangeWithNegativeStep = range(2, -4, -1).value()
    expect(rangeWithNegativeStep).toEqual([2, 1, 0, -1, -2, -3, -4])
  })

  it('can be arbitrarily transformed', () => {
    const arr = [1, 2, 3]
    const result = lift(arr)
      .pipe(arr => {
        return arr.map(n => n * 2)
      })
      .value()

    expect(result).toEqual([2, 4, 6])

    // Array -> Object
    const result2 = lift(arr).pipe(arr => ({ a: 1, b: 2 }))
    expect(result2.value()).toEqual({ a: 1, b: 2 })

    // Array -> string
    const result3 = lift(arr).pipe(_ => 'ohoh')
    expect(result3).toBe('ohoh')

    // Object -> Array
    const result4 = lift({ a: 1, b: 2 }).pipe(obj => lift(obj).keys().sort().value())
    expect(result4.value()).toEqual(['a', 'b'])

    // Object -> ArrayOps
    const result5 = lift({ a: 1, b: 2 }).pipe(obj => lift(obj).keys().sort())
    expect(result5.value()).toEqual(['a', 'b'])
  })
})
