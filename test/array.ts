import { lift, range, immutable } from '../'
import { update } from '../src/immupdate'

describe('Array', () => {
  it('can be unwrapped', () => {
    const arr = [1, 2, 3]
    const unwrapped = lift(arr)
      .pipe(arr => {
        expect(arr[0] + arr[1]).toBe(3) // Type assertion
        return arr
      })
      .value()
    expect(unwrapped).toBe(arr)
    expect(arr instanceof Array).toBe(true)

    // The unwrapped Array retained its original mutability.
    unwrapped.push
  })

  it('can be cloned', () => {
    const arr = [1, 2, 3]
    const arr2 = immutable(arr)

    const cloned = lift(arr).clone().value()
    const cloned2 = lift(arr2).clone().value()

    // Type assertion
    const _cloned: Array<number> = cloned
    const _cloned2: ReadonlyArray<number> = cloned2

    expect(cloned).not.toBe(arr)
    expect(cloned).toEqual([1, 2, 3])
  })

  it('can be mapped', () => {
    const arr = [1, 2, 3]
    const arr2 = immutable(arr)

    const mapped = lift(arr)
      .map(x => x * 2)
      .value()

    const mapped2 = lift(arr2)
      .map(x => x * 2)
      .value()

    expect(mapped).toEqual([2, 4, 6])
    expect(mapped instanceof Array).toBe(true)
    expect(mapped).not.toBe(arr)

    // The map iterator can also return Wrappers
    const mapped3 = lift(arr)
      .map(x => lift(x * 2))
      .value()

    expect(mapped2).toEqual([2, 4, 6])

    // Type assertion
    const _mapped: Array<number> = mapped
    const _mapped2: ReadonlyArray<number> = mapped2
    const _mapped3: Array<number> = mapped3
  })

  it('can collect its items', () => {
    const arr = [1, 2, 3]
    const arr2 = immutable(arr)

    const result = lift(arr)
      .collect(item => {
        if (item === 2) return
        return item.toString()
      })
      .value()

    const result2 = lift(arr2)
      .collect(item => {
        if (item === 2) return
        return item.toString()
      })
      .value()

    // Type assertion
    const _result: Array<string> = result
    const _resul2: ReadonlyArray<string> = result2

    expect(result).toEqual(['1', '3'])
  })

  it('can be flatMapped', () => {
    const arr = [1, 2, 3]
    const arr2 = immutable(arr)

    const mapped = lift(arr)
      .flatMap(x => [x + 1, x + 2])
      .value()
    expect(mapped).toEqual([2, 3, 3, 4, 4, 5])

    // The flatMap iterator can also return Wrappers
    const mapped3 = lift(arr2)
      .flatMap(x => lift([x + 1, x + 2]))
      .value()
    expect(mapped3).toEqual([2, 3, 3, 4, 4, 5])

    // Intermediary chaining, test inference
    const mapped4 = lift([1, 2, 3, 2, 1])
      .flatMap(x => lift([x + 1, x + 2]))
      .map(y => y + 1)
      .distinct()
      .value()

    // Type assertion
    const _mapped: Array<number> = mapped
    const _mapped3: ReadonlyArray<number> = mapped3
    const _mapped4: Array<number> = mapped4

    expect(mapped4).toEqual([3, 4, 5, 6])
  })

  it('can be filtered', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const arr2 = immutable(arr)

    const filtered = lift(arr)
      .map(n => n * 2)
      .filter(n => n > 6)
      .value()

    const filtered2 = lift(arr2)
      .map(n => n * 2)
      .filter(n => n > 6)
      .value()

    // Type assertion
    const _filtered: Array<number> = filtered
    const _filtered2: ReadonlyArray<number> = filtered2

    expect(filtered).toEqual([8, 10, 12])
    expect(filtered instanceof Array).toBe(true)
    expect(filtered).not.toBe(arr)

    type A = { type: 'a'; a: number }
    type B = { type: 'b'; b: string }
    type Union = A | B
    const isA = (u: Union): u is A => u.type === 'a'

    const arr3: Union[] = [
      { type: 'a', a: 10 },
      { type: 'a', a: 20 },
      { type: 'b', b: '30' }
    ]

    const arr4 = immutable(arr3)

    // It should now have been refined as an Array of as
    const filtered3: A[] = arr3.filter(isA)
    const _filtered4: ReadonlyArray<A> = arr4.filter(isA)

    expect(filtered3).toEqual([
      { type: 'a', a: 10 },
      { type: 'a', a: 20 }
    ])
  })

  it('can append an item', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const arr2 = immutable(arr)

    const updated = lift(arr).append(7).value()

    const updated2 = lift(arr2).append(7).value()

    // Type assertion
    const _updated: Array<number> = updated
    const _updated2: ReadonlyArray<number> = updated2

    expect(updated).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(updated).not.toBe(arr)
  })

  it('can append an Array item', () => {
    const arr = [[1], [2], [3], [4], [5], [6]]
    const arr2 = immutable(arr)

    const updated = lift(arr).append([7]).value()
    const updated2 = lift(arr2).append([7]).value()

    // Type Assertion
    const _updated: Array<number[]> = updated
    const _updated2: ReadonlyArray<ReadonlyArray<number>> = updated2

    expect(updated).toEqual([[1], [2], [3], [4], [5], [6], [7]])
    expect(updated).not.toBe(arr)
  })

  it('can append an Array of items', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const arr2 = immutable(arr)

    const updated = lift(arr)
      .appendAll([7, 8, 9, 10])
      .appendAll(new Set([11, 12]))
      .value()

    const updated2 = lift(arr2).appendAll([7, 8, 9, 10]).value()

    // Type assertion
    const _updated: Array<number> = updated
    const _updated2: ReadonlyArray<number> = updated2

    expect(updated).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(updated).not.toBe(arr)
  })

  it('can insert an item', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const arr2 = immutable(arr)

    const updated = lift(arr).insert(2, 300).value()
    const updated2 = lift(arr2).insert(2, 300).value()

    // Type assertion
    const _updated: Array<number> = arr
    const _updated2: ReadonlyArray<number> = arr2

    expect(updated).toEqual([1, 2, 300, 3, 4, 5, 6])
    expect(updated).not.toBe(arr)
  })

  it('can replace an item at a given index', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const arr2 = immutable(arr)

    const updated = lift(arr)
      .updateAt(-1, n => n * 2)
      .updateAt(2, n => lift(n * 1000)) // test that we can return a lifted value as well
      .updateAt(5, n => n * 100)
      .updateAt(1000, n => n / 10)
      .value()

    const updated2 = lift(arr2)
      .updateAt(-1, n => n * 2)
      .updateAt(2, n => lift(n * 1000)) // test that we can return a lifted value as well
      .updateAt(5, n => n * 100)
      .updateAt(1000, n => n / 10)
      .value()

    expect(updated).toEqual([1, 2, 3000, 4, 5, 600])
    expect(updated).not.toBe(arr)

    // Type assertion
    const _updated: number[] = updated
    const _updated2: ReadonlyArray<number> = updated2
  })

  it('it can update itself', () => {
    const arr: Array<{ id: number; label: string }> = [
      { id: 1, label: 'one' },
      { id: 2, label: 'two' }
    ]
    const arr2 = immutable(arr)

    const updated = lift(arr)
      .update(draft => {
        const item = draft[1]
        if (item) item.label = 'TWO'

        expect(draft).toEqual([
          { id: 1, label: 'one' },
          { id: 2, label: 'TWO' }
        ])
      })
      .value()

    const updated2 = lift(arr2)
      .update(draft => {
        const item = draft[1]
        if (item) item.label = 'TWO'
      })
      .value()

    expect(updated).toEqual([
      { id: 1, label: 'one' },
      { id: 2, label: 'TWO' }
    ])

    // Type assertion
    const _updated: typeof arr = updated
    const _updated2: typeof arr2 = updated2
  })

  it("won't replace an item if the given index is out of bounds", () => {
    const arr = [
      { id: 1, label: 'one' },
      { id: 2, label: 'two' }
    ]
    const arr2 = immutable(arr)

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

    const updated2 = lift(arr2)
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

    // Type assertion
    const _updated: typeof arr = updated
    const _updated2: typeof arr2 = updated2
  })

  it('can remove an item at a given index', () => {
    const arr = ['a', 'b', 'c', 'd', 'e', 'f']
    const arr2 = immutable(arr)

    const updated = lift(arr).removeAt(2).value()
    const updated2 = lift(arr2).removeAt(2).value()

    // Type assertion
    const _updated: Array<string> = updated
    const _updated2: ReadonlyArray<string> = updated2

    expect(updated).toEqual(['a', 'b', 'd', 'e', 'f'])
    expect(updated).not.toBe(arr)
  })

  it("won't remove an item if the given index is negative", () => {
    const arr = ['a', 'b', 'c', 'd', 'e', 'f']
    const arr2 = immutable(arr)

    const updated = lift(arr).removeAt(-1).value()
    const updated2 = lift(arr2).removeAt(-1).value()

    expect(updated).toEqual(arr)

    // Type assertion
    const _updated: Array<string> = updated
    const _updated2: ReadonlyArray<string> = updated2
  })

  it('can remove all falsy values', () => {
    const arr = [undefined, 'a', '', 'b', false, 'c', undefined, 'd', 'e', null, null, 'f', 0]
    const arr2 = immutable(arr)

    const updated = lift(arr).compact().value()

    const updated2 = lift(arr2).compact().value()

    expect(updated).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    expect(updated).not.toBe(arr as any)

    const updated3 = lift(['', 'hey']).compact().value()
    expect(updated3).toEqual(['hey'])

    // Type assertion
    const _updated: Array<string | true | number> = updated
    const _updated2: ReadonlyArray<string | true | number> = updated2
  })

  it('can be flattened', () => {
    const arr = [[1, 2], [3], [], [4, 5, 6]]
    const arr2 = immutable(arr)

    const result = lift(arr).flatten().value()
    const result2 = lift(arr2).flatten().value()

    // Type assertion
    const _result: number[] = result
    const _result2: ReadonlyArray<number> = result2

    expect(result).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('can count items satisfying a predicate', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3]
    const arr2 = immutable(arr)

    const count = lift(arr).count(n => n > 3)
    const count2 = lift(arr2).count(n => n > 3)

    // Type assertion
    const _count: number = count
    const _count2: number = count2

    expect(count).toBe(7)
  })

  it('can keep only the first ocurrence of any encountered item', () => {
    const arr = [{ id: 10 }, { id: 20 }, { id: 10 }, { id: 30 }, { id: 40 }, { id: 40 }]
    const arr2 = immutable(arr)

    const result = lift(arr)
      .distinct(u => u.id)
      .value()
    const result2 = lift(arr2)
      .distinct(u => u.id)
      .value()

    // Type assertion
    const _result: typeof arr = result
    const _result2: typeof arr2 = result2

    expect(result).toEqual([{ id: 10 }, { id: 20 }, { id: 30 }, { id: 40 }])
    expect(result[0]).toBe(arr[0])
    expect(result[1]).toBe(arr[1])
    expect(result[2]).toBe(arr[3])
    expect(result[3]).toBe(arr[4])

    const arr3 = ['7', 1, 2, 2, 1, '3', '7', '2', '3']
    const result3 = lift(arr3).distinct().value()
    expect(result3).toEqual(['7', 1, 2, '3', '2'])
  })

  it('can be sliced from the left', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const arr2 = immutable(arr)

    const result = lift(arr).take(3).value()
    const result2 = lift(arr2).take(3).value()

    // Type assertion
    const _result: number[] = result
    const _result2: ReadonlyArray<number> = result2

    expect(result).toEqual([1, 2, 3])
  })

  it('can be sliced from the right', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const arr2 = immutable(arr)

    const result = lift(arr).takeRight(3).value()
    const result2 = lift(arr2).takeRight(3).value()

    // Type assertion
    const _result: number[] = result
    const _result2: ReadonlyArray<number> = result2

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

    const arr2 = immutable(arr)

    const result = lift(arr)
      .groupBy(p => p.age)
      .value()

    const result2 = lift(arr2)
      .groupBy(p => p.age)
      .value()

    // Type assertion
    const _result: Map<number, Array<{ age: number; name: string }>> = result
    const _result2: ReadonlyMap<number, ReadonlyArray<{ age: number; name: string }>> = result2

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
    const arr2 = immutable(arr)

    const result = lift(arr).reverse().value()
    const result2 = lift(arr2).reverse().value()

    // Type assertion
    const _result: Array<number> = result
    const _result2: ReadonlyArray<number> = result2

    expect(result).toEqual([4, 3, 2, 1])
  })

  it('allows its first item to be read', () => {
    const arr = [1, 2, 3, 4]
    const arr2 = immutable(arr)

    const one = lift(arr).first()
    const one2 = lift(arr2).first()

    // Type assertion
    const _one: number | undefined = one
    const _one2: number | undefined = one2

    expect(one).toBe(1)
    expect(lift([]).first()).toBe(undefined)
  })

  it('allows its last item to be read', () => {
    const arr = [1, 2, 3, 4]
    const arr2 = immutable(arr)

    const four = lift(arr).last()
    const four2 = lift(arr2).last()

    // Type assertion
    const _four: number | undefined = four
    const _four2: number | undefined = four2

    expect(four).toBe(4)
    expect(lift([]).last()).toBe(undefined)
  })

  it('allows an item to be read by index', () => {
    const arr = [1, 2, 3, 4]
    const arr2 = immutable(arr)

    const item = lift(arr).get(2)
    const item2 = lift(arr2).get(2)

    // Type assertion
    const _item: number | undefined = item
    const _item2: number | undefined = item2

    expect(item).toBe(3)
    expect(lift(arr).get(999)).toBe(undefined)
  })

  it('can be sorted', () => {
    // Numbers
    const arr = [5, 4, 1, 6, 2, 4, 3]
    const arr2 = immutable(arr)

    const sorted = lift(arr).sort().value()
    const sorted2 = lift(arr2).sort().value()

    // Type assertion
    const _sorted: number[] = sorted
    const _sorted2: ReadonlyArray<number> = sorted2

    expect(sorted).not.toBe(arr)
    expect(sorted).toEqual([1, 2, 3, 4, 4, 5, 6])

    // String sort uses localeCompare
    const arr3 = 'ä ba bb bä bz a e è é aa ae b ss sz sa st ß'.split(' ')
    const sorted3 = lift(arr3).sort().value()
    expect(sorted3.join(' ')).toBe('a ä aa ae b ba bä bb bz e é è sa ss ß st sz')

    // String sort + ignoreCase
    const arr4 = ['e', 'c', 'ca', 'A', 'F', 'd', 'b']
    const sorted4 = lift(arr4)
      .sort(item => item.toLowerCase())
      .value()
    expect(sorted4).toEqual(['A', 'b', 'c', 'ca', 'd', 'e', 'F'])

    // null and undefined should be in tail position
    const arr6 = ['e', 'c', '', undefined, 'ca', null, 'A', undefined, 'F', null, 'd', 'b']
    const sorted6 = lift(arr6)
      .sort(item => item && item.toLowerCase())
      .value()
    expect(sorted6).toEqual(['', 'A', 'b', 'c', 'ca', 'd', 'e', 'F', null, null, undefined, undefined])

    // By field
    const people = [
      { name: 'Jesse', creationDate: 2 },
      { name: 'Walt', creationDate: 1 },
      { name: 'Mike', creationDate: 4 },
      { name: 'Skyler', creationDate: 3 }
    ]

    const sorted7 = lift(people)
      .sort(p => p.creationDate)
      .map(p => p.name)
      .value()

    expect(sorted7).toEqual(['Walt', 'Jesse', 'Skyler', 'Mike'])

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

    const sorted8 = lift(people2)
      .sort(p => p.age)
      .sort(p => p.name)
      .value()

    expect(sorted8).toEqual([
      { name: 'Jesse', age: 20 },
      { name: 'Jesse', age: 44 },
      { name: 'Mike', age: 20 },
      { name: 'Skyler', age: 37 },
      { name: 'Tonton', age: 18 },
      { name: 'Walt', age: 18 },
      { name: 'Walt', age: 100 }
    ])

    const sorted9 = lift(people2)
      .sort(
        p => p.name,
        p => p.age
      )
      .value()

    const sorted10 = lift(immutable(people2))
      .sort(
        p => p.name,
        p => p.age
      )
      .value()

    expect(sorted9).toEqual([
      { name: 'Jesse', age: 20 },
      { name: 'Jesse', age: 44 },
      { name: 'Mike', age: 20 },
      { name: 'Skyler', age: 37 },
      { name: 'Tonton', age: 18 },
      { name: 'Walt', age: 18 },
      { name: 'Walt', age: 100 }
    ])

    // Type assertion
    const _sorted9: Array<{ name: string; age: number }> = sorted9
    const _sorted10: ReadonlyArray<{ name: string; age: number }> = sorted10
  })

  it('can fold its items', () => {
    const arr = ['a', 'b', 'c', 'd']
    const arr2 = immutable(arr)

    const result = lift(arr).fold('zzz', (acc, value) => acc + value)
    const result2 = lift(arr2).fold('zzz', (acc, value) => acc + value)

    expect(result).toBe('zzzabcd')

    expect(lift([] as string[]).fold('zzz', (acc, value) => acc + value)).toBe('zzz')

    // Type assertion
    const _result: string = result
    const _result2: string = result2

    const arr3 = [1, 2, 3]
    const seed2: number[] = []
    const result3 = lift(arr3).fold(seed2, (acc, value) => acc.concat(value))
    expect(result3.value()).toEqual([1, 2, 3])
  })

  it('can drop some items', () => {
    const arr = ['a', 'b', 'c', 'd']
    const arr2 = immutable(arr)

    const result = lift(arr).drop(2).value()
    const result2 = lift(arr2).drop(2).value()

    // Type assertion
    const _result: Array<string> = result
    const _result2: ReadonlyArray<string> = result2

    expect(result).toEqual(['c', 'd'])
    expect(lift(arr).drop(100).value()).toEqual([])
  })

  it('can drop some items from its right side', () => {
    const arr = ['a', 'b', 'c', 'd']
    const arr2 = immutable(arr)

    const result = lift(arr).dropRight(2).value()
    const result2 = lift(arr2).dropRight(2).value()

    // Type assertion
    const _result: Array<string> = result
    const _result2: ReadonlyArray<string> = result2

    expect(result).toEqual(['a', 'b'])
    expect(lift(arr).dropRight(100).value()).toEqual([])
  })

  it('can be converted to a Set-like object', () => {
    const arr = ['a', 'b', 'c', 'd']
    const arr2 = immutable(arr)

    const result = lift(arr).toSet().value()
    const result2 = lift(arr2).toSet().value()

    expect(result).toEqual(new Set(['a', 'b', 'c', 'd']))

    const arr3 = [1, 2, 3, 4]
    const result3 = lift(arr3).toSet().value()
    expect(result3).toEqual(new Set([1, 2, 3, 4]))

    // Type assertion
    const _result: Set<string> = result
    const _result2: ReadonlySet<string> = result2
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
    const result2 = lift(arr).pipe(_arr => ({ a: 1, b: 2 }))
    expect(result2.value()).toEqual({ a: 1, b: 2 })

    // Array -> string
    const result3 = lift(arr).pipe(_ => 'ohoh')
    expect(result3).toBe('ohoh')

    // Object -> Array
    const result4 = lift({ a: 1, b: 2 }).pipe(obj => lift(obj).keys().sort().value())
    expect(result4.value()).toEqual(['a', 'b'])

    // Object -> ArrayWrapper
    const result5 = lift({ a: 1, b: 2 }).pipe(obj => lift(obj).keys().sort())
    expect(result5.value()).toEqual(['a', 'b'])

    // Type assertion
    const _result: number[] = result
    const _result2: { a: number; b: number } = result2.value()
    const _result3: string = result3
    const _result4: Array<string> = result4.value()
    const _result5: Array<string> = result5.value()
  })
})
