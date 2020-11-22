import { createEnum } from '../src/enum'

describe('enum', () => {
  test('can create an enum from an array of strings', () => {
    const enumeration = createEnum('green', 'orange', 'red')

    // We can use the derived type
    type StopLightColor = typeof enumeration.T

    // We can list all enum values as a Set
    expect(enumeration.values).toEqual(new Set(['green', 'orange', 'red']))

    const setTypeAssertion: ReadonlySet<string> = enumeration.values

    // We can access each value of the enum directly
    const color = enumeration.enum

    const redish: StopLightColor = 'red'
    const greenish: StopLightColor = color.green
    const orange: 'orange' = color.orange
    expect(orange).toBe('orange')
  })
})
