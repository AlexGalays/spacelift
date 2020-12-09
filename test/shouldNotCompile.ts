import { lift } from '../src/lift'
import { update } from '../src/immupdate'

//--------------------------------------
//  lift + Array
//--------------------------------------

const arrOrUndefined = ([1, 2] as any) as ReadonlyArray<number> | undefined
// lifting a nullable Array @shouldNotCompile
lift(arrOrUndefined).drop(2)

const readonlyArray: ReadonlyArray<number> = [1, 2]
// getting an Array back from lift().value() and expecting it to now be writable @shouldNotCompile
lift(readonlyArray).value().push

//--------------------------------------
//  lift + Object
//--------------------------------------

const mapFromRecord = lift({ a: 1, b: 2 }).toMap().value()
// Trying to access a Map key that didn't exist in the original object @shouldNotCompile
mapFromRecord.get('c')

//--------------------------------------
//  lift + Map
//--------------------------------------

const mapOrUndefined = (new Map([[1, 2]]) as any) as ReadonlyMap<number, number> | undefined
// lifting a nullable Map @shouldNotCompile
lift(mapOrUndefined).get

const readonlyMap: ReadonlyMap<number, number> = new Map([[1, 2]])
// getting a Map back from lift().value() and expecting it to now be writable @shouldNotCompile
lift(readonlyMap).value().set

const mapWithObjectKeys: Map<{ id: number }, { id: number }> = new Map()
// toObject() on a map without string or number keys @shouldNotCompile
lift(mapWithObjectKeys).toObject().value()

//--------------------------------------
//  lift + Set
//--------------------------------------

const setOrUndefined = (new Set([1, 2]) as any) as ReadonlySet<number> | undefined
// lifting a nullable Set @shouldNotCompile
lift(setOrUndefined).get

const readonlySet: ReadonlySet<number> = new Set([1, 2])
// getting a Set back from lift().value() and expecting it to now be writable @shouldNotCompile
lift(readonlySet).value().add

//--------------------------------------
//  immuptate + Object
//--------------------------------------

// Updating with a non-object @shouldNotCompile
update('str', () => {})

// Updating with a nullable @shouldNotCompile
update(null, () => {})

// Updating an inner object with an array @shouldNotCompile
update({ a: { b: 1 } }, draft => {
  draft.a = []
})

//--------------------------------------
//  immuptate + Array
//--------------------------------------

const arr = immutable([{ a: 1 }, { a: 2 }])

// Returning a value (1) @shouldNotCompile
update(arr, draft => draft)

// Returning a value (2) @shouldNotCompile
update(arr, draft => {
  draft.updateIf(
    item => item.a === 1,
    item => item
  )
})

// Updating an array with an object @shouldNotCompile
update(arr, draft => {
  draft = {}
})

// Trying to update a tuple like an Array @shouldNotCompile
type Tuple = readonly [number, string]
update([1, 'a'] as Tuple, draft => {
  draft[1] = 2
})

// Trying to iterate an array and update readonly values (1) @shouldNotCompile
update(arr, draft => {
  draft.forEach(x => {
    x.a = 10
  })
})

// Trying to iterate an array and update readonly values (2) @shouldNotCompile
update(arr, draft => {
  for (let v of draft) {
    v.a = 10
  }
})

// Trying to iterate an array and update readonly values (3) @shouldNotCompile
update(arr, draft => {
  ;[...draft.entries()].forEach(([, x]) => {
    x.a = 10
  })
})

// Trying to iterate an array and update readonly values (4) @shouldNotCompile
update(arr, draft => {
  ;[...draft.values()].forEach(x => {
    x.a = 10
  })
})

//--------------------------------------
//  immuptate + Map
//--------------------------------------

const map = immutable(
  new Map([
    [{ id: 1 }, { id: 1, name: 'jon' }],
    [{ id: 2 }, { id: 2, name: 'Julia' }]
  ])
)

// Trying to iterate over a Map and assign to readonly properties (1) @shouldNotCompile
update(map, draft => {
  for (let [, v] of draft) {
    v.name = 'Mutated'
  }
})

// Trying to iterate over a Map and assign to readonly properties (2) @shouldNotCompile
update(map, draft => {
  for (let [, v] of draft.entries()) {
    v.name = 'Mutated'
  }
})

// Trying to iterate over a Map and assign to readonly properties (3) @shouldNotCompile
update(map, draft => {
  for (let k of draft.keys()) {
    k.id = 3
  }
})

// Trying to iterate over a Map and assign to readonly properties (4) @shouldNotCompile
update(map, draft => {
  for (let v of draft.values()) {
    v.name = 'Mutated'
  }
})

// Trying to iterate over a Map and assign to readonly properties (5) @shouldNotCompile
update(map, draft => {
  draft.forEach(v => {
    v.name = 'Mutated'
  })
})

//--------------------------------------
//  lift + update()
//--------------------------------------

// Returning a value (3) @shouldNotCompile
lift([]).update(draft => draft)

// Returning a value (4) @shouldNotCompile
lift({}).update(draft => draft)

// Returning a value (5) @shouldNotCompile
lift(new Map()).update(draft => draft)

// Returning a value (6) @shouldNotCompile
lift(new Set()).update(draft => draft)

//--------------------------------------
//  Utils
//--------------------------------------

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
