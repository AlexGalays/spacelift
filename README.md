# space-lift

Lift your values into space for infinite possibilities.  
Utils for Arrays, Objects  


Design goals  
- 100% immutable, no magic, no overwhelming polymorphism or dynamic operators
- Fun to use
- Correctness and proper typescript typings
- Tiny and performant
- Small set of functions, configurable with lambdas rather than a kitchen sink trying to cater for every single little variation


`space-lift` uses [immupdate](https://github.com/AlexGalays/immupdate) and [option.ts](https://github.com/AlexGalays/option.ts) for seamless chaining and type-safety.


# Examples  

## Update an object inside an Array

```ts
import lift from 'space-lift'
// or import _ from 'space-lift'  ʘ‿ʘ

const people = [
  { id: 1, name: 'jon' },
  { id: 2, name: 'sarah' },
  { id: 3, name: 'nina' }
]

const updatedPeople = lift(people)
  .findIndex(p => p.id === 2)
  .map(index => lift(people).updateAt(index, p => lift(p).update({ name: 'Nick' })))
  .getOrElse(people)
```

## Sort on two fields

```ts
import lift from 'space-lift'

const people = [
  { first: 'jon', last: 'haggis' },
  { first: 'sarah', last: 'john' },
  { first: 'nina', last: 'pedro' }
]

// This will result in an Array sorted by first name, then by last name
const sortedPeople = lift(people)
  .sort({ by: p => p.last })
  .sort({ by: p => p.first })
  .value()
```


# Install

By default, the library provides no operators at all. You get to choose what to import.

The easiest is to import everything in a single import (probably in your main file):  

```ts
import 'space-lift/all'
```

But you can also choose exactly what to import:  

```ts
import 'space-lift/array/map'
import 'space-lift/object/mapValues'
```

Note: When using typescript, don't forget to enable (at least) these two flags for better type-safety: `noImplicitAny`, `strictNullChecks`


# Auto unwrap

Most of the time, you will have to call `.value()` to read your value back (or just `()` for options (although it is recommended to use `map`/`getOrElse`/etc instead)  
Because it's distracting to write `.value()` more than once per chain, some operators will automatically unwrap values returned from their callback.  
These operators are:  

- `Option.map`
- `Array.updateAt`
