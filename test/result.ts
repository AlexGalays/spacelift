import * as expect from 'expect'
import '../all'
import { Result, Ok, Err } from '..'


suite('option', () => {

  // Type checking

  test('An Ok can be assigned to any Result with a compatible Ok type', () => {
    const result: Result<{ iAmAnError: string }, number> = Ok(10)
    const result2: Result<string, number> = Ok(10)

    function getResult(): Result<{ code: string }, number> {
      return Math.random() > 0.4 ? Ok(33) : Err({ code: 'oops' })
    }
  })

  test('An Err can be assigned to any Result with a compatible Err type', () => {
    const result: Result<number, { iAmAValue: string }> = Err(10)
    const result2: Result<number, number> = Err(10)

    function getError(): Result<{ code: string }, number> {
      return Err({ code: 'oops' })
    }
  })


  // isOk

  test('Ok.isOk', () => {
    const ok = Ok(10)
    expect(ok.isOk() && ok.get() === 10).toBe(true)
  })

  test('Err.isOk', () => {
    const err = Err(10)
    expect(!err.isOk() && err.get() === 10).toBe(true)
  })


  // map

  test('Ok.map', () => {
    const ok = Ok(10).map(x => x * 2)
    expect(ok.type === 'ok' && ok.get() === 20).toBe(true)
  })

  test('Err.map', () => {
    const err = Err(10).map(x => 10)
    expect(err.type === 'err' && err.get() === 10).toBe(true)
  })


  // mapError

  test('Ok.mapError', () => {
    const ok: Result<number, number> = Ok(10)
    const result = ok.mapError(e => e * 10)
    expect(result.type === 'ok' && result.get() === 10).toBe(true)
  })

  test('Err.mapError', () => {
    const err: Result<number, number> = Err(10)
    const result = err.mapError(e => e * 10)
    expect(result.type === 'err' && result.get() === 100).toBe(true)
  })


  // flatMap

  test('Ok.flatMap -> Ok', () => {
    const ok = Ok(10).flatMap(x => Ok(String(x * 2)))
    expect(ok.get()).toBe('20')
  })

  test('Ok.flatMap -> Err', () => {
    const err = Ok(10).flatMap(_ => Err('oops'))
    expect(err.get()).toBe('oops')
  })

  test('Err.flatMap -> Ok', () => {
    const err = Err('oops').flatMap(_ => Ok(10))
    expect(err.get()).toBe('oops')
  })

  test('Err.flatMap -> Err', () => {
    const err = Err('oops').flatMap(_ => Err(10))
    expect(err.get()).toBe('oops')
  })

  test('Err.flatMap -> Err | Ok', () => {
    type ErrT = { tonton: string }
    type OkT = { tata: boolean }

    const err = Err('oops').flatMap<ErrT, OkT>(_ =>
      Math.random() > 0.5
        ? Ok({ tata: true })
        : Err({ tonton: 'oops' })
    )

    expect(err.get()).toBe('oops')
  })


  // fold

  test('Ok.fold', () => {
    const ok = Ok(10).fold(
      err => 20,
      val => 30
    )
    expect(ok).toBe(30)
  })

  test('Err.fold', () => {
    const err = Err(10).fold(
      err => 20,
      val => 30
    )
    expect(err).toBe(20)
  })


  // Result.all

  test('Result.all - 2 Ok', () => {
    const result = Result.all(
      Ok(10),
      Ok('20')
    )
    expect(result.isOk()).toBe(true)
    expect(result.get()).toEqual([10, '20'])
  })

  test('Result.all - 1 Ok, 1 Err', () => {
    const result = Result.all(
      Ok(10),
      Err('20')
    )
    expect(result.isOk()).toBe(false)
    expect(result.get()).toEqual('20')
  })

  test('Result.all - 1 Ok, 2 Err', () => {
    const result = Result.all(
      Ok(10),
      Err('20'),
      Err({ error: 'oops' })
    )
    expect(result.isOk()).toBe(false)
    expect(result.get()).toEqual('20')
  })


  // test('should not compile', () => {
  //   const test1 = Ok(10).flatMap(x => Ok(String(x * 2)))
  //   test1.get().lol

  //   const test11: Result<{ err: string }, string> = Ok('')
  //   test11.get().toLowerCase()

  //   const test2 = Ok('') as Result<{ err: string }, string>
  //   test2.get().toLowerCase()

  //   const test3 = Ok('').flatMap(x => Err(10))
  //   test3.get().lol
  // })

})