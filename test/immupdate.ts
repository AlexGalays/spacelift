import { update, toDraft } from '../src/immupdate'

describe('immupdate', () => {
  describe('Object', () => {
    it('supports doing nothing', () => {
      const lol = { a: { b: 10 } } as const

      const obj = immutable({ a: {}, b: {} })

      const updated = update(obj, _draft => {})

      expect(updated).toBe(obj)
      expect(updated.a).toBe(obj.a)
      expect(updated.b).toBe(obj.b)
    })

    it('should not modify the original object', () => {
      const obj = immutable({
        a: { b: 33 },
        c: { d: 88 }
      })

      const updated = update(obj, draft => {
        draft.a.b = 66
      })

      expect(updated).not.toBe(obj)
      expect(updated.a).not.toBe(obj.a)
      expect(updated.a.b).toBe(66)
      expect(updated.c).toBe(obj.c)
    })

    it('can add an object property', () => {
      const obj: Immutable<{ a: 1; b?: number }> = { a: 1 }

      const updated = update(obj, draft => {
        draft.b = 20
      })

      expect(updated).toEqual({ a: 1, b: 20 })
      expect(obj).toEqual({ a: 1 })
    })

    it('can delete a nullable object property', () => {
      const obj: Immutable<{ a: 1; b?: number }> = { a: 1, b: 20 }

      const updated = update(obj, draft => {
        delete draft.b
      })

      expect(updated).toEqual({ a: 1 })
      expect(obj).toEqual({ a: 1, b: 20 })
    })

    it('can update an union property', () => {
      type Union = { type: 'A'; value: number } | { type: 'B'; value: string }
      type Obj = { prop: Union }
      const obj: Obj = { prop: { type: 'A', value: 10 } }

      const updated = update(obj, draft => {
        draft.prop = { type: 'B', value: '10' }
      })

      expect(updated).toEqual({ prop: { type: 'B', value: '10' } })
      expect(obj).toEqual({ prop: { type: 'A', value: 10 } })
    })
  })

  describe('Array', () => {
    it('can replace an Array', () => {
      const obj = immutable({
        a: [1, 2]
      })

      const updated = update(obj, draft => {
        draft.a = toDraft([3, 4])
      })

      expect(updated).not.toBe(obj)
      expect(updated.a).toEqual([3, 4])
      expect(obj).toEqual({ a: [1, 2] })
    })

    it('can set an Array element', () => {
      const obj = immutable({
        arr: [1, 2]
      })

      const updated = update(obj, draft => {
        draft.arr[1] = 20

        expect(draft.arr[1]).toBe(20)
      })

      expect(updated).toEqual({ arr: [1, 20] })
      expect(obj).toEqual({ arr: [1, 2] })
    })

    it('can update a top level array', () => {
      const arr = immutable([{ a: 1 }, { b: 2 }])

      const updated = update(arr, draft => {
        draft[0]!.a = 10

        expect(draft[0]).toEqual({ a: 10 })
      })

      expect(updated).toEqual([{ a: 10 }, { b: 2 }])
      expect(updated).not.toBe(arr)
      expect(updated[0]).not.toBe(arr[0])
      expect(updated[1]).toBe(arr[1])
      expect(arr).toEqual([{ a: 1 }, { b: 2 }])
    })

    it("can access some of the original Array's methods", () => {
      update({ a: [1, 2] }, draft => {
        draft.a.indexOf
        draft.a.includes
        draft.a.some
        draft.a.every
        draft.a.findIndex
        draft.a.map
        draft.a.filter
      })
    })

    it("can iterate an Array but won't eagerly create drafts", () => {
      // Don't make it immutable to prove this is actually mutating the original values
      const arr = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
      ]

      const updated = update(arr, draft => {
        draft.forEach(item => {
          item.name = 'C'
        })

        for (let item of draft) {
          item.name = 'D'
        }

        ;[...draft.entries()].forEach(([_i, item]) => {
          item.name = 'C'
        })
        ;[...draft.values()].forEach(item => {
          item.name = 'D'
        })
      })

      expect(arr[0]).toBe(updated[0])
      expect(arr).toEqual([
        { id: 1, name: 'D' },
        { id: 2, name: 'D' }
      ])
      expect(updated).toEqual([
        { id: 1, name: 'D' },
        { id: 2, name: 'D' }
      ])
    })

    it('can add a new item at given index to the array', () => {
      const obj = immutable({ a: ['b', 'd'] })

      const updated = update(obj, draft => {
        draft.a.prepend('a')
        draft.a.append('e')
        draft.a.insert('c', 2)
      })

      expect(updated).toEqual({ a: ['a', 'b', 'c', 'd', 'e'] })
      expect(obj.a).not.toBe(updated.a)
    })

    it('can insert an item efficiently in a sorted number array', () => {
      const arr = immutable([1, 3, 8, 10, 30, 50, 80, 100, 120, 130])

      const updated = update(arr, draft => {
        draft.insertSorted(60)
        expect(draft).toEqual([1, 3, 8, 10, 30, 50, 60, 80, 100, 120, 130])
      })

      expect(updated).toEqual([1, 3, 8, 10, 30, 50, 60, 80, 100, 120, 130])
      expect(arr).toEqual([1, 3, 8, 10, 30, 50, 80, 100, 120, 130])
    })

    it('can insert an item efficiently in a sorted object array', () => {
      const arr = immutable([1, 3, 8, 10, 30, 50, 80, 100, 120, 130].map(id => ({ id })))

      const updated = update(arr, draft => {
        draft.insertSorted({ id: 60 }, item => item.id)
        expect(draft).toEqual([1, 3, 8, 10, 30, 50, 60, 80, 100, 120, 130].map(id => ({ id })))
      })

      expect(updated).toEqual([1, 3, 8, 10, 30, 50, 60, 80, 100, 120, 130].map(id => ({ id })))
      expect(arr).toEqual([1, 3, 8, 10, 30, 50, 80, 100, 120, 130].map(id => ({ id })))
    })

    it('can update an Array item', () => {
      const arr = immutable([
        { id: 1, name: 'Jon' },
        { id: 3, name: 'Julia' }
      ])

      const updated = update(arr, draft => {
        draft.updateIf(
          (item, index) => item.id === 3 && index === 1,
          item => {
            item.name = 'Bob'
          }
        )

        expect(draft).toEqual([
          { id: 1, name: 'Jon' },
          { id: 3, name: 'Bob' }
        ])
      })

      expect(updated).toEqual([
        { id: 1, name: 'Jon' },
        { id: 3, name: 'Bob' }
      ])

      expect(arr).toEqual([
        { id: 1, name: 'Jon' },
        { id: 3, name: 'Julia' }
      ])

      expect(updated[0]).toBe(arr[0])
      expect(updated[1]).not.toBe(arr[1])
    })

    it('can remove an Array item', () => {
      const obj = immutable({ arr: [1, 2, 3] })

      const updated = update(obj, draft => {
        draft.arr.removeIf((item, index) => item === 2 && index === 1)

        expect(draft).toEqual({ arr: [1, 3] })

        // Filter also works but isn't quite as efficient or consistent with the other APIs.
        draft.arr = draft.arr.filter(item => item === 1)

        expect(draft).toEqual({ arr: [1] })
      })

      expect(updated).toEqual({ arr: [1] })
      expect(obj).toEqual({ arr: [1, 2, 3] })
    })

    it('can remove all Array items', () => {
      const arr: ReadonlyArray<number> = [1, 2, 3]

      const updated = update(arr, draft => {
        draft.removeIf(() => true)

        expect(draft).toEqual([])
      })

      expect(updated).toEqual([])
    })

    it('can update a tuple', () => {
      type Tuple = readonly [number, string, {}]
      const obj: Tuple = [0, '1', {}]

      const updated = update(obj, draft => {
        draft[0] = 1
        draft[1] = '2'
        draft[2] = {}
      })

      expect(updated).toEqual([1, '2', {}])
      expect(obj).toEqual([0, '1', {}])
    })
  })

  describe('Map', () => {
    it('can set a key/value', () => {
      const map = immutable(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Julia' }]
        ])
      )

      const updated = update(map, draft => {
        draft.set(2, { id: 2, name: 'Bob' })

        expect(draft.get(2)).toEqual({ id: 2, name: 'Bob' })

        expect([...draft.entries()]).toEqual([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Bob' }]
        ])
      })

      expect(updated).toEqual(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Bob' }]
        ])
      )
      expect(updated.get(1)).toBe(map.get(1))
    })

    it('can call has()', () => {
      const map = new Map([
        [1, { id: 1, name: 'jon' }],
        [2, { id: 2, name: 'Julia' }]
      ])

      update(map, draft => {
        expect(draft.has(1)).toBe(true)
        expect(draft.has(2)).toBe(true)
        expect(draft.has(3)).toBe(false)
      })
    })

    it('can update a value directly inside a nested Map', () => {
      const obj = immutable({
        map: new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Julia' }]
        ])
      })

      const updated = update(obj, draft => {
        draft.map.set(2, { id: 2, name: 'Bob' })

        expect(draft.map.get(2)).toEqual({ id: 2, name: 'Bob' })

        // Just check the internals. expect() struggles with fake Map objects.
        expect([...draft.map.entries()]).toEqual([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Bob' }]
        ])
      })

      expect(updated.map instanceof Map).toBe(true)

      expect(updated).toEqual({
        map: new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Bob' }]
        ])
      })
      expect(updated.map.get(1)).toBe(obj.map.get(1))
    })

    it('can update a Map object value', () => {
      const map = immutable(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Julia' }]
        ])
      )

      const updated = update(map, draft => {
        draft.get(2)!.name = 'Bob'

        expect([...draft.entries()]).toEqual([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Bob' }]
        ])
      })

      expect(updated).toEqual(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Bob' }]
        ])
      )

      expect(map).toEqual(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Julia' }]
        ])
      )

      expect(updated.get(1)).toBe(map.get(1))
      expect(updated.get(2)).not.toBe(map.get(2))
    })

    it('can clear a Map', () => {
      const map = immutable(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Julia' }]
        ])
      )

      const updated = update(map, draft => {
        draft.clear()
        expect([...draft.entries()]).toEqual([])
      })

      expect(updated).toEqual(new Map())
      expect(map).toEqual(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Julia' }]
        ])
      )
    })

    it('can delete a key', () => {
      const map = immutable(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Julia' }]
        ])
      )

      const updated = update(map, draft => {
        expect(draft.size).toBe(2)
        draft.delete(2)
        expect([...draft.entries()]).toEqual([[1, { id: 1, name: 'jon' }]])
        expect(draft.size).toBe(1)
      })

      expect(updated).toEqual(new Map([[1, { id: 1, name: 'jon' }]]))
      expect(map).toEqual(
        new Map([
          [1, { id: 1, name: 'jon' }],
          [2, { id: 2, name: 'Julia' }]
        ])
      )
    })

    it('it can replace a Map', () => {
      const obj = immutable({
        map: new Map([[1, { id: 1, name: 'Jo' }]])
      })

      const updated = update(obj, draft => {
        draft.map = new Map()
        draft.map.set(1, { id: 1, name: 'John' })
        draft.map.get(1)!.name = 'Alicia'
      })

      expect(updated.map).toEqual(new Map([[1, { id: 1, name: 'Alicia' }]]))

      expect(obj.map).toEqual(new Map([[1, { id: 1, name: 'Jo' }]]))
    })
  })

  describe('Set', () => {
    it('can add an item', () => {
      const set = new Set([1, 2])

      const updated = update(set, draft => {
        draft.add(3)
        expect(draft.has(3)).toBe(true)
      })

      expect([...updated.values()]).toEqual([1, 2, 3])
      expect([...set.values()]).toEqual([1, 2])
    })

    it('can clear', () => {
      const obj = immutable({ set: new Set([{ name: 'A' }, { name: 'B' }]) })

      const updated = update(obj, draft => {
        draft.set.clear()
        expect([...draft.set.values()]).toEqual([])
      })

      expect([...updated.set.values()]).toEqual([])
      expect([...obj.set.values()]).toEqual([{ name: 'A' }, { name: 'B' }])
    })

    it('can be replaced by a new Set', () => {
      const obj = immutable({ set: new Set([{ name: 'A' }]) })

      const updated = update(obj, draft => {
        draft.set = new Set([{ name: 'B' }])
        expect([...draft.set.values()]).toEqual([{ name: 'B' }])
      })

      expect([...updated.set.values()]).toEqual([{ name: 'B' }])
      expect([...obj.set.values()]).toEqual([{ name: 'A' }])
    })

    it('can delete an item', () => {
      const set = new Set([1, 2])

      const updated = update(set, draft => {
        draft.delete(2)
        expect(draft.has(2)).toBe(false)
      })

      expect([...updated.values()]).toEqual([1])
      expect([...set.values()]).toEqual([1, 2])
    })

    it('can call has()', () => {
      const set = new Set([1, 2])

      update(set, draft => {
        expect(draft.has(2)).toBe(true)
        draft.delete(2)
        expect(draft.has(2)).toBe(false)
      })
    })
  })
})

function immutable<T>(obj: T): Immutable<T> {
  return obj as any
}

type ImmutablePrimitive = undefined | null | boolean | string | number | Function

type Immutable<T> = T extends ImmutablePrimitive
  ? T
  : T extends Array<infer U>
  ? ImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? ImmutableMap<K, V>
  : T extends Set<infer M>
  ? ImmutableSet<M>
  : ImmutableObject<T>

type ImmutableArray<T> = ReadonlyArray<Immutable<T>>
type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>
type ImmutableSet<T> = ReadonlySet<Immutable<T>>
type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> }
