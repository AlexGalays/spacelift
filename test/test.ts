import lift, {
  Option,
  Some,
  None,
  Ok,
  Err,
  update,
  deepUpdate,
  DELETE,
  range,
  memoize
} from '..'

describe('lift', () => {
  it('re-exports immupdate, Option, Result', () => {
    expect(Option).toBeTruthy()
    expect(Some).toBeTruthy()
    expect(None).toBeTruthy()
    expect(Ok).toBeTruthy()
    expect(Err).toBeTruthy()
    expect(update).toBeTruthy()
    expect(deepUpdate).toBeTruthy()
    expect(DELETE).toBeTruthy()
  })

  describe('functions', () => {
    it('can memoize a function of arity 0', () => {
      const memoized = memoize((): {} => ({ x: 33 }))
      const result1 = memoized()
      const result2 = memoized()

      expect(result1).toEqual({ x: 33 })
      expect(result2).toEqual({ x: 33 })
      expect(result1).toBe(result2)
    })

    it('can memoize a function of arity 1, by reference', () => {
      const memoized = memoize((a: number): {} => ({ x: a }))
      const result1 = memoized(1)
      const result2 = memoized(2)
      const result3 = memoized(1)
      const result4 = memoized(2)

      expect(result1).toEqual({ x: 1 })
      expect(result2).toEqual({ x: 2 })
      expect(result1).toBe(result3)
      expect(result2).toBe(result4)
    })

    it('can memoize a function of arity 2, by reference', () => {
      const memoized = memoize((a: number, b: {}): {} => ({ x: a, y: b }))
      const myObj = {}
      const result1 = memoized(1, myObj)
      const result2 = memoized(2, 3)
      const result3 = memoized(1, myObj)
      const result4 = memoized(2, 3)
      const result5 = memoized(1, 3)

      expect(result1).toEqual({ x: 1, y: myObj })
      expect(result2).toEqual({ x: 2, y: 3 })
      expect(result5).toEqual({ x: 1, y: 3 })
      expect(result1).toBe(result3)
      expect(result2).toBe(result4)
    })

    it('can memoize a function of arity 2, using a key function', () => {
      const myObj = { id: 10 }
      const memoized = memoize(
        (a: number, b: typeof myObj): {} => ({ x: a, y: b }),
        { key: (a, b) => `${a}_${b.id}` }
      )

      // There should be no interference from other memoize'd functions
      memoize((obj: typeof myObj) => obj)(myObj)

      const result1 = memoized(1, myObj)
      const result2 = memoized(2, { id: 20 })
      const result3 = memoized(1, myObj)
      const result4 = memoized(2, { id: 20 })

      expect(result1).toEqual({ x: 1, y: myObj })
      expect(result2).toEqual({ x: 2, y: { id: 20 } })
      expect(result1).toBe(result3)
      expect(result2).toBe(result4)
    })

    it('should have good perfs on a memoized function, even compared to a trivially simple function ', () => {
      const fn = (obj: {}, key: string, value: number) =>
        Object.assign({}, obj, { [key]: value })
      const memoized = memoize(fn)

      const obj = {}
      measureTime('normal function', () => fn(obj, 'key', 1))
      measureTime('memoized function', () => memoized(obj, 'key', 1))
    })
  })

  describe('README examples', () => {
    it('can run example #1', () => {
      const people = [
        { id: 1, name: 'jon' },
        { id: 2, name: 'sarah' },
        { id: 3, name: 'nina' }
      ]

      const updatedPeople = lift(people)
        .findIndex(p => p.id === 2)
        .map(index =>
          lift(people).updateAt(index, p => update(p, { name: 'Nick' }))
        )
        .getOrElse(people)

      expect(updatedPeople).toEqual([
        { id: 1, name: 'jon' },
        { id: 2, name: 'Nick' },
        { id: 3, name: 'nina' }
      ])
    })
  })

  describe('lift(primitive)', () => {
    it('is an iterable', () => {
      const acc = []
      const d = new Date()
      const obj = {}

      for (let i of lift(1)) {
        acc.push(i)
      }

      for (let i of lift('a')) {
        acc.push(i)
      }

      for (let i of lift(obj)) {
        acc.push(i)
      }

      for (let i of lift(d)) {
        acc.push(i)
      }

      expect(acc).toEqual([1, 'a', obj, d])
    })
  })
})

function measureTime(name: string, block: Function) {
  const iterations = 30
  const iterator = range(iterations).value()

  const before = process.hrtime()
  iterator.forEach(_ => block())
  const [secs, nanoSecs] = process.hrtime(before)
  const diffMs = (secs * 1e9 + nanoSecs) / 1e6 / iterations

  console.log(name, diffMs.toFixed(6))
}
