import * as expect from 'expect'
import '../commonjs/all'
import { Option, None, Some, ArrayOps } from '..'


suite('option', () => {

  // isDefined

  test('isDefined can help refine the type', () => {
    const value = 33 as (number | undefined)
    const some = Option(value)
    some.isDefined() && some.get().toFixed(10)
  })

  // Factory

  test('Creating a Some', () => {
    const some = Option(10)
    expect(some.isDefined()).toBe(true)
    expect(some.get()).toBe(10)
  })

  test('Creating a Some with an empty string', () => {
    const some = Option('')
    expect(some.isDefined()).toBe(true)
    expect(some.get()).toBe('')
  })

  test('Creating a None with null', () => {
    const none = Option(null)
    expect(!none.isDefined()).toBe(true)
    expect(none.get()).toBe(undefined)
  })

  test('Creating a None with undefined', () => {
    const none = Option(undefined)
    expect(none.isDefined()).toBe(false)
    expect(none.get()).toBe(undefined)
  })


  test('Manipulating a None', () => {
    const none = None
    const anOption: Option<number> = none

    const x: never = none.get()
    const y: number | undefined = anOption.get()

    x
    y
  })

  // forEach

  test('Some.forEach', () => {
    let state = 0
    Some(10).forEach(x => state = state + x)
    Option(10).forEach(x => state = state + x)
    expect(state).toBe(20)
  })

  test('None.forEach', () => {
    let state = 0
    Option(null).forEach(x => state = 10)
    expect(state).toBe(0)
  })


  // map

  test('Some.map -> Some', () => {
    const some = Option(10).map(x => x * 2)
    expect(some.isDefined() && some.get() === 20).toBe(true)
  })

  test('Some.map -> None', () => {
    const none = Option(10).map(x => undefined)
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })

  test('None.map -> None', () => {
    const value = undefined as (number | undefined)
    const none = Option(value).map(x => x * 2)
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })


  // flatMap

  test('Some.flatMap -> Some', () => {
    const some = Option(10).flatMap(x => Option(x * 2))
    expect(some.isDefined() && some.get() === 20).toBe(true)
  })

  test('Some.flatMap -> None', () => {
    const none = Option(10).flatMap(_ => None)
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })

  test('None.flatMap -> Some', () => {
    const none = Option(undefined).flatMap(_ => Option(10))
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })

  test('None.flatMap -> None', () => {
    const none = Option(undefined).flatMap(_ => None)
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })


  // filter

  test('Some.filter -> Some', () => {
    const some = Option(10).filter(x => x > 5)
    expect(some.isDefined() && some.get() === 10).toBe(true)
  })

  test('Some.filter -> None', () => {
    const none = Option(10).filter(x => x > 10)
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })

  test('None.filter -> true', () => {
    const none = Option(undefined).filter(_ => true)
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })

  test('None.filter -> false', () => {
    const none = Option(undefined).filter(_ => false)
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })


  // getOrElse

  test('Some getOrElse', () => {
    const result = Option('').getOrElse('alt')
    expect(result).toBe('')
  })

  test('None getOrElse', () => {
    const value = undefined as (number | undefined)
    const result = Option(value).getOrElse(20)
    expect(result).toBe(20)
  })


  // orElse

  test('Some.orElse Some', () => {
    const some = Option(10).orElse(() => Option(20))
    expect(some.isDefined() && some.get() === 10).toBe(true)
  })

  test('Some.orElse None', () => {
    const some = Option(10).orElse(() => None)
    expect(some.isDefined() && some.get() === 10).toBe(true)
  })

  test('None.orElse Some', () => {
    const value = undefined as (number | undefined)
    const some = Option(value).orElse(() => Option(20))
    expect(some.isDefined() && some.get() === 20).toBe(true)
  })

  test('None.orElse None', () => {
    const none = Option(undefined).orElse(() => None)
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })


  // fold

  test('Some.fold', () => {
    const some = Option(10)

    const result = some.fold(
      () => 999,
      x  => (x * 2).toString()
    )

    // test the compilation of the returned type: It should be a string | number
    if (typeof result === 'number') {
      result.toFixed()
    }
    else {
      result.charCodeAt(0)
    }

    expect(result).toBe('20')
  })

  test('None.fold', () => {
    const none = Option(null as number | null)
    const result = none.fold(
      () => '999',
      x  => (x * 2).toString()
    )
    expect(result).toBe('999')
  })


  // exists

  test('Some.exists', () => {
    expect(Some(10).exists(n => n == 10)).toBe(true)
    expect(Some([]).exists(arr => arr.length > 0)).toBe(false)
  })

  test('None.exists', () => {
    expect(Option(null).exists(_ => true)).toBe(false)
  })


  // toArray

  test('Some.toArray', () => {
    const result = Option(10).toArray()
    expect(result instanceof ArrayOps).toBe(true)
    expect(result.value()).toEqual([10])
  })

  test('None.toArray', () => {
    const result = Option(null).toArray()
    expect(result instanceof ArrayOps).toBe(true)
    expect(result.value()).toEqual([])
  })

  // toResult

  test('Some.toResult', () => {
    const result = Option(10).toResult(() => 'nope')
    expect(result.isOk() && result.get()).toBe(10)
  })

  test('None.toResult', () => {
    const result = Option(null).toResult(() => 'error')
    expect(!result.isOk() && result.get()).toBe('error')
  })


  // Option.all

  test('Option.all - 2 Some', () => {
    const some = Option.all([Option('a'), Option('b')])
    expect(some.isDefined() && some.get().join(',') === 'a,b').toBe(true)
  })

  test('Option.all - 1 Some, 1 defined value', () => {
    const some = Option.all([Option('a'), 'b'])
    expect(some.isDefined() && some.get().join(',') === 'a,b').toBe(true)
  })

  test('Option.all - 3 Some', () => {
    const some = Option.all([Option('a'), Option('b'), Option('c')])
    expect(some.isDefined() && some.get().join(',') === 'a,b,c').toBe(true)
  })

  test('Option.all - 1 Some, 1 None', () => {
    const none = Option.all([Option('a'), Option(undefined)])
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })

  test('Option.all - 1 Some, 1 undefined', () => {
    const none = Option.all([Option('a'), undefined])
    expect(!none.isDefined() && none.get() === undefined).toBe(true)
  })

  test('Option.all - values in the result tuple are refined to be non nullable', () => {
    const nullableString = 'a' as string | null | undefined

    Option.all([Option(nullableString), undefined, nullableString]).map(([a, b, c]) => {
      // Just testing the compilation here
      a.charCodeAt(10)
      c.charCodeAt(10)

      return 0
    })
  })

  test('Option.all - 10 Some', () => {
    const result = Option.all([Some(1), Some('2'), Some(3), Some('4'), Some(5), Some(true), Some(7), Some(8), Some(9), Some(10)])
    const result2 =  Option.all([Some(1), Some('2'), Some(3), Some('4'), Some(5), Some(true)])

    expect(result.isDefined() && result.get()[2] + result.get()[9] === 13).toBe(true)
    expect(result.get()).toEqual([1, '2', 3, '4', 5, true, 7, 8, 9, 10])

    expect(result2.isDefined() && result2.get()[0] + result2.get()[4] === 6).toBe(true)
  })


  // Option.allObject

  test('Option.allObject - 2 Some', () => {
    const some = Option.allObject({a: Some('a'), b: Some('b')});
    expect(some.isDefined()).toBe(true);
    expect(some.get()).toEqual({a: 'a', b: 'b'});
  });

  test('Option.allObject - 1 Some, 1 None', () => {
    const some = Option.allObject({a: Some('a'), b: None});
    expect(some).toEqual(None);
  });

  test('Option.allObject - values in the result have correct inference', () => {
    const some = Option.allObject({
      a: Some('a'),
      b: Some(2),
      c: Some([1, 2, 3]),
    });
    // Just testing typechecker here
    (some.getE().a as string);
    (some.getE().b as number);
    (some.getE().c as number[]);
  });


  // Option.isOption

  test('Option.isOption', () => {
    expect(Option.isOption(true)).toBe(false)
    expect(Option.isOption(false)).toBe(false)
    expect(Option.isOption('')).toBe(false)
    expect(Option.isOption([])).toBe(false)
    expect(Option.isOption(None)).toBe(true)
    expect(Option.isOption(Option(33))).toBe(true)
    expect(Option.isOption(Option(undefined))).toBe(true)
  })

  // toString

  test('Some toString', () => {
    const str = Option(10).toString()
    expect(str).toBe('Some(10)')

    const obj = { a: 1, toString() { return `{a:${this.a}}` } }
    const str2 = Option(obj).toString()
    expect(str2).toBe('Some({a:1})')
  })

  test('None toString', () => {
    const str = Option(undefined).toString()
    expect(str).toBe('None')
  })


  // implicit toJSON

  test('Some toJSON', () => {
    const obj = JSON.parse(JSON.stringify({ x: Option(10) }))
    expect(obj.x).toBe(10)
  })

  test('None toJSON', () => {
    const obj = JSON.parse(JSON.stringify({ x: Option(undefined) }))
    expect(obj.x).toBe(null)
  })


  // Perfs

  test('Measure the time needed to create a Some', () => {
    for (let i = 0; i < 10; i++) {
      console.time(`Creating a Some (${i})`)
      Option(i)
      console.timeEnd(`Creating a Some (${i})`)
    }
  })

})
