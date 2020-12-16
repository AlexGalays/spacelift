import { createUnion } from '../src/union'

describe('union', () => {
  test('can create an union', () => {
    const noArg = () => ({})

    const stopLight = createUnion({
      green: noArg,
      orange: noArg,
      red: noArg,
      broken: (cause: string) => ({ cause })
    })

    // We can use the derived type for the overall union
    type StopLight = typeof stopLight.T

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
    if (stopLight.is('broken')(broken)) {
      broken.cause
    } else {
      fail()
    }

    if (stopLight.is('broken')(greenUnion)) {
      greenUnion.cause
      fail()
    }
  })
})
