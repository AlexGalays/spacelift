**space-lift**
"Lift your values into space for infinite possibilities"

![](http://i.imgur.com/DWrI2JY.gif?noredirect)

Note: Starting from version `1.0.0`, `space-lift` no longer contains the `Option` and `Result` monads. You can find these at [space-monad](https://github.com/AlexGalays/space-monad)


# Rich Array, Object, Map, Set wrapper

Design goals
- 100% immutable, no magic, no overwhelming polymorphism or dynamic operators
- Fun to use
- Correctness and first-class typescript typings
- Tiny and performant
- Small set of functions, configurable with lambdas
- Cover 95% of frontend data transformation needs without becoming a bloated lib just to cover the remaining 5%

* [How to use](#howtouse)
* [Examples](#examples)
* [API](#api)
  * [Array](#api.array)
  * [Object](#api.object)
  * [Map](#api.map)
  * [Set](#api.set)
  * [update](#api.update)
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
- `Immutable` a type that will recursively make a tree `Readonly`.


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

* [clone](#array.clone)
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
* [fold](#array.fold)
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
* [update](#array.update)
* [updateAt](#array.updateAt)
* [pipe](#array.pipe)

<a name="array.clone"></a>
### Array.clone




<a name="api.object"></a>
## Object

* [lift(object)](#lift.object)
* [add](#object.add)
* [assoc](#object.assoc)
* [contains](#object.contains)
* [dissoc](#object.dissoc)
* [filter](#object.filter)
* [get](#object.get)
* [is](#object.is)
* [isEmpty](#object.isEmpty)
* [keys](#object.keys)
* [mapValues](#object.mapValues)
* [remove](#object.remove)
* [set](#object.set)
* [toArray](#object.toArray)
* [values](#object.values)

TODO: Detail and examples


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