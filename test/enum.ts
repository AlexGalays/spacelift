import { createEnum } from '../src/enum'

describe('enum', () => {

  test('can create an enum from an array of strings', () => {
    const enumeration = createEnum('green', 'orange', 'red')

    // We can use the derived type
    type StopLightColor = typeof enumeration.T

    // We can list all enum values as an Array
    expect(enumeration.values).toEqual(['green', 'orange', 'red'])

    // We can access each value of the enum directly
    const color = enumeration.enum

    const redish: StopLightColor = 'red'
    const greenish: StopLightColor = color.green
    const orange: 'orange' = color.orange
    expect(orange).toBe('orange')
  })

})