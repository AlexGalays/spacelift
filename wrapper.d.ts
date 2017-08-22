
// This module is outside /src so that it can be referenced by both the commonjs and es packages.
// It ensures typescript picks the correct type definitions when it comes to interface augmentation.

export interface Wrapper<A> {
  _isLiftWrapper: boolean
  value(): A
}


export interface ArrayOpsConstructor {
  new<A>(value: A[]): ArrayOps<A>
  readonly prototype: ArrayOps<any>
}

export interface ArrayOps<A> extends Wrapper<A[]> {}


export interface ObjectOpsConstructor {
  new<A>(value: A): ObjectOps<A>
  readonly prototype: ObjectOps<any>
}

export interface ObjectOps<A> extends Wrapper<A> {}


export interface NumberOpsConstructor {
  new(value: number): NumberOps
  readonly prototype: NumberOps
}

export interface NumberOps extends Wrapper<number> {}


export interface StringOpsConstructor {
  new(value: string): StringOps
  readonly prototype: StringOps
}

export interface StringOps extends Wrapper<string> {}


export interface BoolOpsConstructor {
  new(value: boolean): BoolOps
  readonly prototype: BoolOps
}

export interface BoolOps extends Wrapper<boolean> {}


export interface DateOpsConstructor {
  new(value: Date): DateOps
  readonly prototype: DateOps
}

export interface DateOps extends Wrapper<Date> {}


