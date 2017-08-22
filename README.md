**space-lift**  
"Lift your values into space for infinite possibilities"  

![](http://i.imgur.com/DWrI2JY.gif?noredirect)


# Rich Array/Object wrapper, Option, Result monads

Design goals  
- 100% immutable, no magic, no overwhelming polymorphism or dynamic operators
- Fun to use
- Correctness and proper typescript typings
- Tiny and performant
- Small set of functions, configurable with lambdas
- Cover 95% of frontend data transformation needs without becoming a bloated lib just to cover the remaining 5%
- The Array/Object wrappers use an OO style as it's the most convenient without an `|>` operator directly in the language


* [How to use](#howtouse)
* [Examples](#examples)
* [Auto unwrap](#autounwrap)
* [API](#api)
  * [Array](#api.array)
  * [Object](#api.object)
  * [Function](#api.function)
  * [Option](#api.option)
  * [Result](#api.result)


<a name="howtouse"></a>
# How to use

Here's everything that can be imported from `space-lift`:  

```ts
import lift, { Option, Some, None, Result, Ok, Err, update, deepUpdate, DELETE, range, Set, memoize, is } from 'space-lift'
```

`lift` is a generic function that can wrap an Array or Object and give it extra functionalities  
`update`, `deepUpdate`, `DELETE` come from [immupdate](https://github.com/AlexGalays/immupdate)  
`Option`, `Some`, `None` are used to work with optional values  
`Result`, `Ok`, `Err` are used to work with computation that may fail  
`range` is a factory function for Arrays of numbers
`Set` is a factory function for objects acting as Sets
`is` is a helper used to determine if an instance is of a particular type (e.g `is.array([]) === true`)

By default, the library provides no operators to the Wrapped Arrays/Objects at all. You get to choose what to import.

The fastest way is to install everything in a single import (probably in your main file):  

```ts
import 'space-lift/es/all' // For bundlers who work more efficiently with ECMAScript modules

import 'space-lift/commonjs/all' // To use the legacy commonjs modules
```

But you can also choose exactly what to import:  

```ts
import 'space-lift/es/array/map'
import 'space-lift/es/object/mapValues'
```

Note: When using typescript, don't forget to enable (at least) these two flags for better type-safety: `noImplicitAny`, `strictNullChecks`



<a name="examples"></a>
# Examples  

## Update an object inside an Array

```ts
import lift, { update } from 'space-lift'
// or import _ from 'space-lift'  ʘ‿ʘ

const people = [
  { id: 1, name: 'jon' },
  { id: 2, name: 'sarah' },
  { id: 3, name: 'nina' }
]

const updatedPeople = lift(people)
  .findIndex(p => p.id === 2)
  .map(index => lift(people).updateAt(index, person => update(person, { name: 'Nick' })))
  .getOrElse(people)
```

## Sort on two fields

```ts
import lift from 'space-lift'

const people = [
  { first: 'jon',   last: 'haggis' },
  { first: 'sarah', last: 'john' },
  { first: 'nina',  last: 'pedro' }
]

// This will result in an Array sorted by first name, then by last name
const sortedPeople = lift(people)
  .sort({ by: p => p.last })
  .sort({ by: p => p.first })
  .value()
```

<a name="autounwrap"></a>
# Auto unwrap

Most of the time, you will have to call `.value()` to read your value back (or `.get()` for options, although it is recommended to use `map`/`getOrElse`/etc instead)  
Because it's distracting to write `.value()` more than once per chain, some operators will automatically unwrap values returned from their iterators (like Promise->then).  
These operators are:  

- `Option.map`
- `Array.map`
- `Array.flatMap`
- `Array.updateAt`
- `transform`


<a name="api"></a>
# API



<a name="api.array"></a>
## Array

* [lift(array)](#lift.array)
* [append](#array.append)
* [appendAll](#array.appendAll)
* [compact](#array.compact)
* [count](#array.count)
* [distinct](#array.distinct)
* [drop](#array.drop)
* [dropRight](#array.dropRight)
* [every](#array.every)
* [filter](#array.filter)
* [find](#array.find)
* [findIndex](#array.findIndex)
* [first](#array.first)
* [flatMap](#array.flatMap)
* [flatten](#array.flatten)
* [fold](#array.fold)
* [foldRight](#array.foldRight)
* [fromArrayLike](#array.fromArrayLike)
* [get](#array.get)
* [groupBy](#array.groupBy)
* [insert](#array.insert)
* [insertAll](#array.insertAll)
* [join](#array.join)
* [last](#array.last)
* [map](#array.map)
* [range](#array.range)
* [removeAt](#array.removeAt)
* [reverse](#array.reverse)
* [some](#array.some)
* [sort](#array.sort)
* [take](#array.take)
* [takeRight](#array.takeRight)
* [toSet](#array.toSet)
* [updateAt](#array.updateAt)

TODO: Detail and examples


<a name="api.object"></a>
## Object

* [lift(object)](#lift.object)
* [add](#object.add)
* [filter](#object.filter)
* [get](#object.get)
* [is](#object.is)
* [keys](#object.keys)
* [mapValues](#object.mapValues)
* [remove](#object.remove)
* [set](#object.set)
* [toArray](#object.toArray)
* [values](#object.values)

TODO: Detail and examples



<a name="api.function"></a>
## Function

### memoize

```ts
import { memoize } from 'space-lift'

function multiply(a: number, b: number) {
  return a * b
}

// Using reference equality on every arg
const memoizedMultiply = memoize(multiply)


const myObj = { id: 10 }

// Using memo keys
const memoized = memoize(
  (a: number, b: typeof myObj): {} => ({ x: a, y: b }),
  { key: (a, b) => `${a}_${b.id}` }
)

```


<a name="api.option"></a>
## Option 

* [Option()](#Option())
* [Option.all()](#Option.all)
* [Option.isOption](#Option.isOption)
* [None](#option.None)
* [map](#option.map)
* [flatMap](#option.flatMap)
* [filter](#option.filter)
* [fold](#option.fold)
* [orElse](#option.orElse)
* [isDefined](#option.isDefined)
* [get](#option.get)
* [getOrElse](#option.getOrElse)
* [forEach](#option.forEach)
* [toArray](#option.toArray)


### Creating an Option

<a name="Option()"></a>
#### Option(x)

Creates an Option from a value.
If the value is null or undefined, it will create a None, else a Some.

```ts
const some = Option(33) // some === Some(33)
const none = Option(null) // none === None
```

If you already know the value is defined for sure (not nullable) or not, you can create a `Some` or `None` directly:  

```ts
const some = Some(33) // Some(null | undefined) wouldn't compile.
const none = None
```


<a name="Option.all"></a>
#### Option.all(...optionsOrValues)

Creates a new Option holding the tuple of all the passed values if they were all Some or non null/undefined values,  
else returns None

```ts
const some = Option.all(
  Option(10),
  20,
  Option(5)
)
// some === Some([10, 20, 5])

const none = Option.all(
  Option(10),
  None,
  Option(5),
  null
)
// none === None
```

<a name="Option.isOption"></a>
#### Option.isOption

Returns whether the passed instance in an Option, and refines its type

```ts
import { Option, Some } from 'space-lift'
Option.isOption(Some(33)) // true
```


<a name="option.None"></a>
#### None

The Option constant representing no value.

```ts
import { None } from 'space-lift'
```


### Transforming an Option

<a name="option.map"></a>
#### map

Maps the value contained in this Some, else returns None.
Depending on the map function return value, a Some could be tranformed into a None, as a Some is guaranteed to never contain a null or undefined value.

```ts
const some = Option(33).map(x => x * 2)
// some === Some(66)
```

<a name="option.flatMap"></a>
#### flatMap

Maps the value contained in this Some to a new Option, else returns None.

```ts
const some = Option(33).flatMap(_ => Option(44))
// some === Some(44)
```

<a name="option.filter"></a>
#### filter

If this Option is a Some and the predicate returns true, keep that Some.
In all other cases, return None.

```ts
const some = Option(33).filter(x => x > 32)
// some === Some(33)
```

<a name="option.fold"></a>
#### fold

Applies the first function if this is a None, else applies the second function.  
Note: Since this method creates 2 functions everytime it runs, don't use in tight loops; use isDefined() instead.

```ts
const count = Option(10).fold(
  () => 100, // None
  count => count * 10 // Some
)
```

<a name="option.toArray"></a>
#### toArray

Transforms this option into an Array or either 1 or 0 element.


<a name="option.orElse"></a>
#### orElse

Returns this Option unless it's a None, in which case the provided alternative is returned.

```ts
const some = Option(null).orElse(() => Option(33))
// some === Some(33)
```

### Misc

<a name="option.get"></a>
#### get

`Some` instances return their value, whereas `None` always return `undefined`.  
This method never throws.

```ts
const value = Some(33).get()
// value === 33
```

<a name="option.isDefined"></a>
#### isDefined

Returns whether this Option has a defined value (i.e, it's a Some(value))  
Note: this refines the type of the Option to be a Some so it's guaranteed its value is not null/undefined.


<a name="option.getOrElse"></a>
#### getOrElse

Returns this Option's value if it's a Some, else return the provided alternative

```ts
const value = Option(undefined).getOrElse(33)

// value === 33
```


<a name="option.forEach"></a>
#### forEach

Applies the given procedure to the option's value, if it is non empty.

```ts
Option(33).forEach(x => console.log(x))
```





<a name="api.result"></a>
## Result

* [Result, Ok, Err](#Result)
* [Result.isResult](#Result.isResult)
* [Result.all](#Result.all)
* [isOk](#result.isOk)
* [map](#result.map)
* [mapError](#result.mapError)
* [flatMap](#result.flatMap)
* [fold](#result.fold)


A `Result` is the result of a computation that may fail. An `Ok` represents a successful computation, while an `Err` represent the error case.  


<a name="Result"></a>
### Importing Result

Here's everything that can be imported to use Results:  

```ts
import { Result, Ok, Err } from 'space-lift'

const ok = Ok(10)
const err = Err('oops')
```

<a name="Result.isResult"></a>
### Result.isResult

Returns whether this instance is a Result (either an Ok or a Err) and refines its type

```ts
import { Result, Ok } from 'space-lift'

Result.isResult(Ok(10)) // true
```

<a name="Result.all"></a>
### Result.all

Creates a new Ok Result holding the tuple of all the passed values if they were all Ok,
else returns the first encountered Err.

```ts
import { Result, Ok, Err } from 'space-lift'

const result = Result.all(
  Ok(20),
  Err('nooo'),
  Ok(200),
  Err('oops')
) // Err('nooo')
```


<a name="result.isOk"></a>
### isOk

Returns whether this is an instance of Ok

```ts
import { Result, Ok, Err } from 'space-lift'

Ok(10).isOk() // true
```


<a name="result.map"></a>
### map

Maps the value contained in this Result if it's an Ok, else propagates the Error.

```ts
import { Result, Ok, Err } from 'space-lift'

Ok(10).map(x => x * 2) // Ok(20)
Err(10).map(x => x * 2) // Err(10)
```


<a name="result.mapError"></a>
### mapError

Maps the Error contained in this Result if it's an Err, else propagates the Ok.

```ts
import { Result, Ok, Err } from 'space-lift'

Ok(10).mapError(x => x * 2) // Ok(10)
Err(10).mapError(x => x * 2) // Err(20)
```


<a name="result.flatMap"></a>
### flatMap

Maps the value contained in this Result with another Result if it's an Ok, else propagates the Error.
Note: It is allowed to return a Result with a different Error type.

```ts
import { Result, Ok, Err } from 'space-lift'

Ok(10).flatMap(x => Ok(x * 2)) // Ok(20)
Ok(10).flatMap(x => Err(x * 2)) // Err(20)
```


<a name="result.fold"></a>
### fold

Applies the first function if this is an Err, else applies the second function.
Note: Don't use in tight loops; use isOk() instead.


```ts
import { Result, Ok, Err } from 'space-lift'

Ok(10).fold(
  err => console.error(err),
  num => num * 2
) // 20
```

