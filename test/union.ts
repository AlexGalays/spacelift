import { createUnion, empty } from '../src/union'

describe('union', () => {
  test('can create an union', () => {
    const union = createUnion({
      green: empty,
      orange: empty,
      red: empty,
      broken: (cause: string) => ({ cause })
    })

    const is = union.is
    const stopLight = union.factories

    // We can use the derived type for the overall union
    type StopLight = typeof union.T
    const orange: StopLight = stopLight.orange()

    // Or an individual derived type
    type Green = typeof stopLight.green.T
    const green: Green = stopLight.green()
    const greenUnion = green as StopLight

    const broken = stopLight.broken('oops')

    // factories are provided
    expect(stopLight.orange()).toEqual({
      type: 'orange'
    })
    expect(stopLight.broken('oops')).toEqual({
      type: 'broken',
      cause: 'oops'
    })

    // typeguards are provided
    if (is('broken')(broken)) {
      broken.cause
    } else {
      fail()
    }

    if (is('broken')(greenUnion)) {
      greenUnion.cause
      fail()
    }
  })
})
