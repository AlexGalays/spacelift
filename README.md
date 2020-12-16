**space-lift**
"Lift your values into space for infinite possibilities"

![](http://i.imgur.com/DWrI2JY.gif?noredirect)

Note: Starting from version `1.0.0`, `space-lift` no longer contains the `Option` and `Result` monads. You can find these at [space-monad](https://github.com/AlexGalays/space-monad)


# Rich Array, Object, Map, Set wrapper

Design goals
- 100% immutable, no magic, no overwhelming polymorphism or dynamic operators
- Fun to use
- Correctness and first-class typescript typings
- Tiny and performant (`space-lift` weights `8.2 kB` minified for roughly the same scope as `lodash` (`70.0 kB`) AND `immerjs` (`15.6 kB`)) and no amount of tree shaking can save you from heavy abstractions imported by all modules.  
- Small set of functions, configurable with lambdas
- Cover 95% of frontend data transformation needs without becoming a bloated lib just to cover the remaining 5%

![spacelift lib size](https://user-images.githubusercontent.com/5928836/101669317-0923c300-3a52-11eb-89b7-1b607f7a243b.png)

* [How to use](#howtouse)
* [Examples](#examples)
* [API](#api)
  * [Array](#api.array)
  * [Object](#api.object)
  * [Map](#api.map)
  * [Set](#api.set)
  * [update](#api.update)
    * [update for Object](#api.update.object)
    * [update for Map](#api.update.map)
    * [update for Set](#api.update.set)
    * [update for Array](#api.update.array)
  * [createEnum](#api.enum)
  * [createUnion](#api.union)
  * [Result](#api.result)
* [Auto unwrap](#autounwrap)


<a name="howtouse"></a>
# How to use

Here's everything that can be imported from `space-lift`:

```ts
import {
  lift,
  update,
  range,
  is,
  createUnion,
  createEnum,
  identity,
  noop,
  Result,
  Ok,
  Err,
  Immutable
} from 'space-lift'
```

- `lift` is the main attraction and is used to wrap an Array, Object, Map or Set to give it extra functionalities  
- `update` can update an Object, Array, Map or Set without modifying the original  
- `range` is a factory function for Arrays of numbers  
- `is` is a helper used to determine if an instance is of a particular type (e.g `is.array([]) === true`)  
- `createUnion` creates a bunch  of useful things when working with discriminated unions.  
- `createEnum` creates a bunch of useful things when working with a string based enum.  
- `identity` the identity function
- `noop` a function that does nothing
- `Result`, `Ok`, `Err` are used to work with computation that may fail  
- `Immutable` a helper type that will recursively make a tree `Readonly`.


<a name="examples"></a>
# Some Examples

## Update an object inside an Array

```ts
import { update } from 'space-lift'

const people = [
  { id: 1, name: 'jon' },
  { id: 2, name: 'sarah' },
  { id: 3, name: 'nina' }
]

const updatedPeople = update(people, draft => {
  draft.updateIf(
    p => p.id === 2,
    personDraft => {personDraft.name = 'Nick'})
})
```

## Sort on two fields

```ts
import lift from 'space-lift'

const people = [
  { first: 'jon',   last: 'haggis' },
  { first: 'sarah', last: 'john' },
  { first: 'nina',  last: 'pedro' }
]

// This will create an Array sorted by first name, then by last name
const sortedPeople = lift(people)
  .sort(p => p.first, p => p.last)
  .value()
```

<a name="api"></a>
# API

<a name="api.array"></a>
## Array

* [append](#array.append)
* [appendAll](#array.appendAll)
* [compact](#array.compact)
* [count](#array.count)
* [collect](#array.collect)
* [distinct](#array.distinct)
* [drop](#array.drop)
* [dropRight](#array.dropRight)
* [filter](#array.filter)
* [first](#array.first)
* [flatMap](#array.flatMap)
* [flatten](#array.flatten)
* [reduce](#array.reduce)
* [get](#array.get)
* [groupBy](#array.groupBy)
* [insert](#array.insert)
* [last](#array.last)
* [map](#array.map)
* [removeAt](#array.removeAt)
* [reverse](#array.reverse)
* [sort](#array.sort)
* [take](#array.take)
* [takeRight](#array.takeRight)
* [toSet](#array.toSet)
* [updateAt](#array.updateAt)
* [pipe](#array.pipe)


<a name="array.append"></a>
### Array.append

Appends one item at the end of the Array.  

```ts
import {lift} from 'space-lift'
const updated = lift([1, 2, 3]).append(4).value() // [1, 2, 3, 4]
```

<a name="array.appendAll"></a>
### Array.appendAll

Appends an Iterable of items at the end of the Array.  

```ts
import {lift} from 'space-lift'
const updated = lift([1, 2, 3]).appendAll([4, 5]).value() // [1, 2, 3, 4, 5]
```

<a name="array.compact"></a>
### Array.compact

Filters all the falsy elements out of this Array.  
All occurences of false, null, undefined, 0, "" will be removed.  

```ts
import {lift} from 'space-lift'
const updated = lift([1, null, 2, 3, undefined]).compact().value() // [1, 2, 3]
```

<a name="array.count"></a>
### Array.count

Counts the items satisfying a predicate.  

```ts
import {lift} from 'space-lift'
const count = lift([1, 2, 3]).count(n => n > 1) // 2
```

<a name="array.collect"></a>
### Array.collect

Maps this Array's items, unless void or undefined is returned, in which case the item is filtered.  
This is effectively a `filter` + `map` combined in one.  

```ts
import {lift} from 'space-lift'
const count = lift([1, 2, 3]).collect(n => {
  if (n === 1) return;
  return `${n*10}`
}).value() // ['20', '30']
```

<a name="array.distinct"></a>
### Array.distinct

Creates an array without any duplicate item.  
If a key function is passed, items will be compared based on the result of that function;  
if not, they will be compared using strict equality.  

```ts
import {lift} from 'space-lift'

const people = [{id: 1, name: 'Alexios'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Alessia'}]

// [{id: 1, name: 'Alexios'}, {id: 2, name: 'Bob'}]
const deduped = lift(people).distinct(p => p.id).value()
```

<a name="array.drop"></a>
### Array.drop

Drops the first 'count' items from this Array.  

```ts
import {lift} from 'space-lift'
const updated = lift([1, 2, 3]).drop(2).value() // [3]
```

<a name="array.dropRight"></a>
### Array.dropRight

Drops the last 'count' items from this Array.  

```ts
import {lift} from 'space-lift'
const updated = lift([1, 2, 3]).dropRight(2).value() // [1]
```

<a name="array.filter"></a>
### Array.filter

Filters this array by aplying a predicate to all items and refine its type.  

```ts
import {lift} from 'space-lift'
const filtered = lift([1, 2, 3]).filter(n => n > 1).value() // [2, 3]
```

<a name="array.first"></a>
### Array.first

Returns the first element in this Array or undefined.  

```ts
import {lift} from 'space-lift'
const first = lift([1, 2, 3]).first() // 1
```

<a name="array.flatMap"></a>
### Array.flatMap

Maps this Array to an Array of Array | ArrayWrapper using a mapper function then flattens it.  

```ts
import {lift} from 'space-lift'
const mapped = lift([1, 2, 3]).flatMap(n => [n + 1, n + 2]).value() // [2, 3, 3, 4, 4, 5]
```

<a name="array.flatten"></a>
### Array.flatten

Flattens this Array of Arrays.  

```ts
import {lift} from 'space-lift'
const flattened = lift([1, [2], [3, 4]]).flatten().value() // [1, 2, 3, 4]
```

<a name="array.reduce"></a>
### Array.reduce

Reduces this Array into a single value, using a starting value.  

```ts
import {lift} from 'space-lift'
const count = lift([1, 2, 3).reduce(0, (count, n) => count + n) // 6
```

<a name="array.get"></a>
### Array.get

Returns the item found at the provided index or undefined.  

```ts
import {lift} from 'space-lift'
const secondItem = lift([1, 2, 3).get(1) // 2
```

<a name="array.groupBy"></a>
### Array.groupBy

Creates a Map where keys are the results of running each element through a discriminator function.  
The corresponding value of each key is an array of the elements responsible for generating the key.  

```ts
import {lift} from 'space-lift'
const people = [
  { age: 10, name: 'jon' },
  { age: 30, name: 'momo' },
  { age: 10, name: 'kiki' },
  { age: 28, name: 'jesus' },
  { age: 29, name: 'frank' },
  { age: 30, name: 'michel' }
]

// Map<number, Array<{age: number, name: string}>>
const peopleByAge = lift(people).groupBy(p => p.age).value()
```

<a name="array.insert"></a>
### Array.insert

Inserts an item at a specified index.  

```ts
import {lift} from 'space-lift'
const updated = lift(['1', '2', '3').insert(1, '20').value() // [1, 20, 2, 3]
```

<a name="array.last"></a>
### Array.last

Returns the item found at the last index or undefined.  

```ts
import {lift} from 'space-lift'
const last = lift(['1', '2', '3').last() // '3'
```

<a name="array.map"></a>
### Array.map

Maps this Array using a mapper function.  

```ts
import {lift} from 'space-lift'
const mapped = lift(['1', '2', '3']).map(str => '0' + str).value() // ['01', '02', '03']
```

<a name="array.removeAt"></a>
### Array.removeAt

Removes the item found at the specified index.  

```ts
import {lift} from 'space-lift'
const updated = lift(['1', '2', '3').removeAt(1).value() // ['1', '3']
```

<a name="array.reverse"></a>
### Array.reverse

Reverses the Array.  

```ts
import {lift} from 'space-lift'
const updated = lift(['1', '2', '3').reverse().value() // ['3', '2', '1']
```

<a name="array.sort"></a>
### Array.sort

Sorts the Array in ascending order, using one or more iterators specifying which field to compare.  
For strings, localCompare is used.  
The sort is stable if the browser uses a stable sort (all modern engines do)  

```ts
import {lift} from 'space-lift'

const people = [
  { name: 'Jesse', creationDate: 2 },
  { name: 'Walt', creationDate: 1 },
  { name: 'Mike', creationDate: 4 },
  { name: 'Skyler', creationDate: 3 }
]

const sorted = lift(people)
  .sort(p => p.creationDate)
  .map(p => p.name)
  .value() // ['Walt', 'Jesse', 'Skyler', 'Mike']
```

<a name="array.take"></a>
### Array.take

Takes the first 'count' items from this Array.  

```ts
import {lift} from 'space-lift'
const updated = lift(['1', '2', '3').take(2).value() // ['1', '2']
```

<a name="array.takeRight"></a>
### Array.takeRight

Takes the last 'count' items from this Array.  

```ts
import {lift} from 'space-lift'
const updated = lift(['1', '2', '3').takeRight(2).value() // ['2', '3']
```

<a name="array.toSet"></a>
### Array.toSet

Converts this Array to a Set.  

```ts
import {lift} from 'space-lift'
const set = lift(['1', '2', '2', '3').toSet().value() // Set(['1', '2', '3'])
```

<a name="array.updateAt"></a>
### Array.updateAt

Updates an item at the specified index.  

```ts
import {lift} from 'space-lift'
const updated = lift(['1', '2', '2', '3').updateAt(1, '20').value() // ['1', '20', '2', '3']
```

<a name="array.pipe"></a>
### Array.pipe

Pipes this Array with an arbitrary transformation function.  

```ts
import {lift} from 'space-lift'
const updated = lift([1, 0, 3]).pipe(JSON.stringify) // '[1, 0, 3]'
```

<a name="api.object"></a>
## Object

* [add](#object.add)
* [isEmpty](#object.isEmpty)
* [keys](#object.keys)
* [mapValues](#object.mapValues)
* [pipe](#object.pipe)
* [remove](#object.remove)
* [values](#object.values)
* [toArray](#object.toArray)
* [toMap](#object.toMap)

<a name="object.add"></a>
### Object.add

Adds a new key/value to this object. This creates a new type.  
To add a nullable key to an object while preserving its type, use [update](#api.update) instead.  

```ts
import {lift} from 'space-lift'

const updated = lift({a: 1, b: 2}).add(c, 3).value() // {a: 1, b: 2, c: 3}
```

<a name="object.isEmpty"></a>
### Object.isEmpty

Returns whether this object contains no keys.

```ts
import {lift} from 'space-lift'

const isEmpty = lift({a: 1, b: 2}).isEmpty() // false
```

<a name="object.keys"></a>
### Object.keys

Creates an Array of all this object's keys, in no particular order.  
If the keys are a subtype of string, the Array will be typed with the proper key union type.  

```ts
import {lift} from 'space-lift'

const isEmpty = lift({a: 1, b: 2}).keys().value() // ['a', 'b']
```

<a name="object.mapValues"></a>
### Object.mapValues

Maps this Object values using a mapper function.  
This is mostly useful for objects with a single value type.  

```ts
import {lift} from 'space-lift'

const mappedValues = lift({
  chan1: [1, 2, 3],
  chan2: [10, 11, 12]
})
.mapValues(numbers => numbers.map(n => n * 2))
.value() // { chan1: [2, 4, 6], chan2: [20, 22, 24] }
```

<a name="object.pipe"></a>
### Object.pipe

Pipes this Object with an arbitrary transformation function.  

```ts
import {lift} from 'space-lift'

const updated = lift({a: 1}).pipe(JSON.stringify) // '{"a": 1}'
```

<a name="object.remove"></a>
### Object.remove

Removes a key/value from this object and return a new object (and type)  
To delete a (nullable) key from an object while preserving its type, use "update()" instead.  

```ts
import {lift} from 'space-lift'

const updated = lift({a: 1, b: 2, c: 3}).add('c').value() // {a: 1, b: 2}
```

<a name="object.values"></a>
### Object.values

Creates an Array with all these object's values.  

```ts
import {lift} from 'space-lift'

const updated = lift({a: 1, b: 2, c: 3}).values().value() // [1, 2, 3]
```

<a name="object.toArray"></a>
### Object.toArray

Converts this Object to an Array of tuples.  
Similar to Object.entries() but retains the type of keys.  

```ts
import {lift} from 'space-lift'

const updated = lift({a: 1, b: 2, c: 3}).toArray().value() // [['a', 1], ['b', 2], ['c', 3]]
```

<a name="object.toMap"></a>
### Object.toMap

Transforms this Object to a Map where the keys are the string typed keys of this Object.  

```ts
import {lift} from 'space-lift'

const updated = lift({a: 1, b: 2, c: 3}).toMap().value() // Map([['a', 1], ['b', 2], ['c', 3]])
```



<a name="api.map"></a>
## Map

* [set](#map.set)
* [delete](#map.delete)
* [collect](#map.collect)
* [filter](#map.filter)
* [first](#map.first)
* [last](#map.last)
* [mapValues](#map.mapValues)
* [pipe](#map.pipe)
* [toArray](#map.toArray)
* [toObject](#map.toObject)

<a name="map.set"></a>
### Map.set

Sets a new key/value.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

const updated = lift(map).set('c', 3).value() // Map([['a', 1], ['b', 2], ['c', 3]])
```

<a name="map.delete"></a>
### Map.delete

Deletes a key/value.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

const updated = lift(map).delete('b').value() // Map([['a', 1]])
```

<a name="map.collect"></a>
### Map.collect

Maps this Map's keys and values, unless void or undefined is returned, in which case the entry is filtered.  
This is effectively a `filter` + `map` combined in one.  

```ts
import {lift, update} from 'space-lift'

const map = new Map([
  [1, { id: 1, name: 'aa' }],
  [2, { id: 2, name: 'bb' }]
])

const updated = lift(map).collect((key, value) => {
  if (key === 2) return
  return [
    key * 10,
    update(value, v => { v.name = `${v.name}$` })
  ]
}).value() // Map([[10, {id: 2, name: 'bb$'}]])
```

<a name="map.filter"></a>
### Map.filter

Filters this Map's keys and values by aplying a predicate to all values and refine its type.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

const updated = lift(map).filter((key, value) => key === 1).value() // Map([['a', 1]])
```

<a name="map.first"></a>
### Map.first

Returns the first element in this Map or undefined.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  [1, { id: 1, name: 'Walter' }],
  [2, { id: 2, name: 'Jesse' }]
])

const first = lift(map).first() // { id: 1, name: 'Walter' }
```

<a name="map.last"></a>
### Map.last

Returns the last element in this Map or undefined.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  [1, { id: 1, name: 'Walter' }],
  [2, { id: 2, name: 'Jesse' }]
])

const first = lift(map).last() // { id: 2, name: 'Jesse' }
```

<a name="map.mapValues"></a>
### Map.mapValues

Maps this map's values.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

const updated = lift(map).filter(value => value * 2).value() // Map([['a', 2], ['b', 4]])
```

<a name="map.pipe"></a>
### Map.pipe

Pipes this Map with an arbitrary transformation function.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

const yay = lift(map).pipe(m => m.toString()) // '[object Map]' 
```

<a name="map.toArray"></a>
### Map.toArray

Transforms this Map into an Array of [key, value] tuples.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

const array = lift(map).toArray().value() // [ ['a', 1], ['b', 2] ]
```

<a name="map.toObject"></a>
### Map.toObject

Transforms this Map into an Object.  
Only available if this Map's keys are a subtype of string or number.  

```ts
import {lift} from 'space-lift'

const map = new Map([
  ['a', 1],
  ['b', 2]
])

const array = lift(map).toObject().value() // { 'a': 1, 'b': 2 }
```

<a name="api.set"></a>
## Set

* [add](#set.add)
* [addAll](#set.addAll)
* [delete](#set.delete)
* [collect](#set.collect)
* [filter](#set.filter)
* [intersection](#set.intersection)
* [difference](#set.difference)
* [pipe](#set.pipe)
* [toArray](#set.toArray)

<a name="set.add"></a>
### Set.add

Adds a new value to this Set.  

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])

const updated = lift(set).add(4).add(3).value() // Set([1, 2, 3, 4])
```

<a name="set.addAll"></a>
### Set.addAll

Adds all items from the passed iterable to this Set.   

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])

const updated = lift(set).addAll([4, 5, 3]).value() // Set([1, 2, 3, 4, 5])
```

<a name="set.delete"></a>
### Set.delete

Deletes one value from this Set.  

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])

const updated = lift(set).delete(2).value() // Set([1, 3])
```

<a name="set.collect"></a>
### Set.collect

Maps this Set's items, unless void or undefined is returned, in which case the item is filtered.  
This is effectively a `filter` + `map` combined in one.  

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])

const updated = lift(set).collect(num => {
  if (num === 2) return
  return num * 2
}).value() // Set([2, 6])
```

<a name="set.filter"></a>
### Set.filter

Filters this Set's items by aplying a predicate to all values and refine its type.  

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])

const updated = lift(set).filter(num => num !== 2).value() // Set([1, 3])
```

<a name="set.intersection"></a>
### Set.intersection

Returns the Set of all items of this Set that are also found in the passed Set.  

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])
const otherSet = new Set([2, 3, 4])

const intersection = lift(set).intersection(otherSet).value() // Set([2, 3])
```

<a name="set.difference"></a>
### Set.difference

Returns the Set of all items of this Set that are not found in the passed Set.  

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])
const otherSet = new Set([2, 3, 4])

const diff = lift(set).difference(otherSet).value() // Set([1])
```

<a name="set.pipe"></a>
### Set.pipe

Pipes this Set with an arbitrary transformation function.  

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])

const yay = lift(set).pipe(s => s.toString()) // '[object Set]' 
```

<a name="set.toArray"></a>
### Set.toArray

Transforms this Set into an Array. The insertion order is kept.  

```ts
import {lift} from 'space-lift'

const set = new Set([1, 2, 3])

const array = lift(set).toArray().value() // [1, 2, 3]
```



<a name="api.update"></a>
## update

`update` is your go-to function to perform immutable updates on your `Objects`, `Array`, `Map` and `Set`, using a mutable API. If you know [immerjs](https://immerjs.github.io/immer/docs/introduction), it's very similar (great idea!) but with different design constraints in mind:  

- Tiny implementation (The entirety of `space-lift` is way smaller than `immerjs`)
- The `Array` draft has special methods to update it as the traditional mutable Array API in JavaScript is awful.
- Instead of eagerly creating tons of costly `Proxies` (also called `drafts`), they are created only when strictly needed (look for: **will create a draft** in the documentation below).
- `drafts` are only created for values of type `Object`, `Array`, `Map` or `Set`.
- `update` should never have a returned value and will prevent it at the type level.
- Remember that if you iterate through keys, values, etc drafts will **NOT** be created by default. Call one of the draft creating methods within the loop to perform the updates conditionally.
- As long as you keep accessing drafts, the update can be done at any level of a tree.

<a name="api.update.object"></a>
### update for Object

Accessing a draft object property is the only `Object` operation that **will create a draft**

#### Adding/updating an Object property

```ts
import {update} from 'space-lift'

const obj: { a: 1; b?: number } = { a: 1 }

const updated = update(obj, draft => {
  draft.b = 20
})
```

#### Deleting an Object property

```ts
import {update} from 'space-lift'

const obj: { a: 1; b?: number } = { a: 1, b: 20 }

const updated = update(obj, draft => {
  delete draft.b
})
```

<a name="api.update.map"></a>
### update for Map

All regular methods are available.  
`get` is the only `Map` draft method that **will create a draft** for the returned value.  

#### Map - Updating an existing value

```ts
import {update} from 'space-lift'

const map = new Map([
  [1, { id: 1, name: 'jon' }],
  [2, { id: 2, name: 'Julia' }]
])

const updated = update(map, draft => {
  const value = draft.get(2)
  if (value) return
  
  value.name = 'Bob'
})
```

<a name="api.update.set"></a>
### update for Set

All regular `Set` methods are available.  
None of the `Set` draft methods **will create a draft** as a `Set` never hands value over.  
Still, it's useful to update an immutable `Set` whether it's found nested in a tree or not and Sets are most of the time only useful for primitives values that wouldn't be drafted.  

<a name="api.update.array"></a>
### update for Array

Most Array methods are available but some are removed to make working with Arrays more pleasant:  

- `splice`: Replaced by `insert`, `removeIf`.
- `unshift`: Replaced by `preprend`.
- `shift`: Replaced by `removeIf`.
- `pop`: Replaced by `removeIf`.
- `push`: Replaced by `append`.
- `map` is not removed but `updateIf` is added as the conceptual, mutable equivalent.

As a result, the interface of a draft Array is not fully compatible with `Array`/`ReadonlyArray` and you must use `toDraft` if you want to assign a regular Array to a draft Array:  

```ts
import {update, toDraft} from 'space-lift'

const updated = update({arr: [1, 2, 3]}, draft => {
  draft.arr = toDraft([4, 5, 6])
})
```

- Accessing an Array element by index **will create a draft** (be careful with this if you somehow end up manually iterating the Array)
- `updateIf` **will create a draft** for each item satisfying its predicate.  

#### Array - using updateIf

```ts
import {update} from 'space-lift'

const arr = [
  { id: 1, name: 'Jon' },
  { id: 3, name: 'Julia' }
]

const updated = update(arr, draft => {
  draft.updateIf(
    (item, index) => item.id === 3,
    item => {
      item.name = 'Bob'
    }
  )
})
```

<a name="api.enum"></a>
## createEnum

Creates a type safe string enumeration from a list of strings, providing:  
the list of all possible values, an object with all enum keys and the derived type of the enum in a single declaration.

```ts
  import { createEnum } from 'space-lift/es/enum'

  const enumeration = createEnum('green', 'orange', 'red')

  // We can use the derived type
  type StopLightColor = typeof enumeration.T

  // We can list all enum values as a Set.
  enumeration.values // Set(['green', 'orange', 'red'])

  // We can access each value of the enum directly
  const color = enumeration.enum

  const redish: StopLightColor = 'red'
  const greenish: StopLightColor = color.green
  const orange: 'orange' = color.orange
  orange // 'orange'
```

<a name="api.union"></a>
## createUnion

Creates a type-safe union, providing: derived types, factories and type-guards in a single declaration.

```ts
  import { createUnion } from 'space-lift'

  // Let's take the example of a single input Form that can send a new message or edit an existing one.
  // createUnion() gives you 3 tools:
  // T: the derived type for the overall union
  // is: a typeguard function for each state
  // Lastly, the returned object has a key acting as a factory for each union member
  const formState = createUnion({
    creating: () => ({}),
    editing: (msgId: string) => ({ msgId }),
    sendingCreation: () => ({}),
    sendingUpdate: (msgId: string) => ({ msgId }),
  });

  // The initial form state is 'creating'
  let state: typeof formState.T = formState.creating() // { type: 'creating' }

  // If the user wants to edit an existing message, we have to store the edited message id. Lets update our state.
  onClickEdit(msgId: string) {
    state = formState.editing(msgId) // { type: 'editing', msgId: 'someId' }
  }

  // In edition mode, we could want to get the message and change the send button label
  if (formState.is('editing')(state)) {
    getMessage(state.msgId) // thanks to the typeguard function, we know msgId is available in the state
    buttonLabel = 'Update message'
  }

  // If needed, we can also access the derived type of a given state
  type EditingType = typeof formState.editing.T
  const editingObj: EditingType = formState.editing('someId')
```



<a name="api.result"></a>
## Result

A `Result` is the result of a computation that may fail. An `Ok` represents a successful computation, while an `Err` represent the error case.


<a name="Result"></a>
### Importing Result

Here's everything that can be imported to use Results:

```ts
import { Result, Ok, Err } from 'space-lift'

const ok = Ok(10) // {ok: true, value: 10}
const err = Err('oops') // {ok: false, error: 'oops'}
```


<a name="autounwrap"></a>
# Auto unwrap

Most of the time, you will have to call `.value()` to read your value back.  
Because it's distracting to write `.value()` more than once per chain, some operators will automatically unwrap values returned from their iterators (like Promise->then).
These operators are:

- `Array.map`
- `Array.flatMap`
- `Array.updateAt`
- `pipe`
