export class ArrayOps<T> {
  constructor(private _value: ReadonlyArray<T>) {}

  private _isLiftWrapper = true

  value() {
    return this._value
  }
}
