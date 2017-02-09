import { ArrayOps } from '../'


/*
* Returns a number[] wrapper with all numbers from start to stop (inclusive),
* incremented or decremented by step.
*/
export default function range(start: number, stop?: number, step?: number): ArrayOps<number> {
  if (arguments.length === 1) {
    stop = arguments[0] - 1
    start = 0
  }

  step = step || 1

  const result: number[] = []
  const increasing = step > 0
  let next = start

  while ((increasing && next <= stop!) || (!increasing && next >= stop!)) {
    result.push(next)
    next = next + step
  }

  return new ArrayOps(result)
}
