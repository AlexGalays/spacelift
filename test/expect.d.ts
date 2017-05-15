
declare module expect {

    export interface IExpectation<TExpected> {
        /**
         * Asserts the given object is truthy.
         */
        toExist(message?: string): this;

        /**
         * Asserts the given object is falsy.
         */
        toNotExist(message?: string): this;

        /**
         * Asserts that object is strictly equal to value using ===.
         */
        toBe(value: TExpected, message?: string): this;

		/**
		* Asserts that object is strictly not equal to value using !==.
		*/
        toNotBe(value: TExpected, message?: string): this;

        /**
         * Asserts that the given object equals value using is-equal.
         */
        toEqual(value: TExpected, message?: string): this;

        /**
         * Asserts that the given object is not equal to value using is-equal.
         */
        toNotEqual(value: TExpected, message?: string): this;


    }
	
	export interface IObjectExpectation<TExpected extends Object> extends IExpectation<TExpected> {
		/**
         * Asserts the given object is an instanceof constructor.
         * or
         * Asserts the typeof the given object is string.
         */
        toBeA(constructor: Function | string, message?: string): this;

        /**
         * Asserts the given object is not an instanceof constructor.
         * or
         * Asserts the typeof the given object not the string.
         */
        toNotBeA(constructor: Function | string, message?: string): this;

        /**
         * Asserts the given object is an instanceof constructor.
         * or
         * Asserts the typeof the given object is string.
         */
        toBeAn(constructor: Function | string, message?: string): this;


        /**
         * Asserts the given object is an instanceof constructor.
         * or
         * Asserts the typeof the given object is string.
         */
        toNotBeAn(constructor: Function | string, message?: string): this;
	}

    export interface IFunctionExpectation<TExpected extends Function> extends IExpectation<TExpected> {
        /**
         * Asserts that the given block throws an error. The error argument may be a constructor (to test using instanceof), or a string/RegExp to test against error.message.
         */
        toThrow(error?: string | RegExp | Function, message?: string): this;

        /**
         * Asserts that the given block throws an error when called with args. The error argument may be a constructor (to test using instanceof), or a string/RegExp to test against error.message.
         */
        withArgs(...args: any[]): this;

        /**
         * Asserts that the given block throws an error when called in the given context. The error argument may be a constructor (to test using instanceof), or a string/RegExp to test against error.message.
         */
        withContext(context: any): this;

        /**
         * Asserts that the given block does not throw.
         */
        toNotThrow(message?: string): this; 
    }

    export interface IStringExpectation extends IExpectation<string> {
        /**
         * Asserts the given string matches pattern, which must be a RegExp.
         */
        toMatch(pattern: RegExp, message?: string): this;

        /**
         * Asserts the given string contains value.
         */
        toInclude(value: string, message?: string): this;

        /**
         * Asserts the given string contains value.
         */
        toContain(value: string, message?: string): this;

        /**
         * Asserts the given string does not contain value.
         */
        toExclude(value: string, message?: string): this;

        /**
         * Asserts the given string does not contain value.
         */
        toNotContain(value: string, message?: string): this;
    }

    export interface INumberExpectation extends IExpectation<number> {
        /**
         * Asserts the given number is less than value.
         */
        toBeLessThan(value: number, message?: string): this;

        /**
         * Asserts the given number is greater than value.
         */
        toBeGreaterThan(value: number, message?: string): this;

    }

    export interface IArrayExpectation<TElement> extends IExpectation<TElement[]> {
        /**
         * Asserts the given array contains value. The comparator function, if given, should compare two objects and either return false or throw if they are not equal. It defaults to assert.deepEqual. 
         * */
        toInclude(value: TElement, comparator?: IComparator<TElement>, message?: string): this;

        /**
         * Asserts the given array contains value. The comparator function, if given, should compare two objects and either return false or throw if they are not equal. It defaults to assert.deepEqual. 
         * */
        toContain(value: TElement, comparator?: IComparator<TElement>, message?: string): this;

        /**
         * Asserts the given array contains value. The comparator function, if given, should compare two objects and either return false or throw if they are not equal. It defaults to assert.deepEqual. 
         * */
        toExclude(value: TElement, comparator?: IComparator<TElement>, message?: string): this;

        /**
         * Asserts the given array contains value. The comparator function, if given, should compare two objects and either return false or throw if they are not equal. It defaults to assert.deepEqual. 
         * */
        toNotContain(value: TElement, comparator?: IComparator<TElement>, message?: string): this;
    }

    export interface IComparator<TElement> {
        (comparer: TElement, comparee: TElement): boolean;
    }

    export interface ISpyExpectation extends IExpectation<ISpy> {
        /**
         * Has the spy been called?
         */
        toHaveBeenCalled(message?: string): this;
		
		toNotHaveBeenCalled(message?: string): this;

        /**
         * Has the spy been called with these arguments.
         */
        toHaveBeenCalledWith(...args: any[]): this;
    }

    export interface ISpy {
        calls: ICall[];

        /**
         * Restores a spy originally created with expect.spyOn()
         */
        restore: () => void;

        /**
         * Makes the spy invoke a function fn when called.
         */
        andCall(fn: Function): this;

        /**
         * Makes the spy call the original function it's spying on.
         */
        andCallThrough(): this;

        /**
         * Makes the spy return a value;
         */
        andReturn(object: any): this;

        /**
         * Makes the spy throw an error when called.
         */
        andThrow(error: Error): this;
    }

    export interface ICall {
        context: any;

        arguments: any[];
    }

	/**
	 * This is my best attempt at emulating the typing required for expect extend.
	 * Unfortunately you'll still have to extend with IExpect interface or one of the 
	 * Expectation interfaces to 
	 */
	export interface IExtension {
		[assertionMethod: string]: Function;
	}

    export interface IExpect {
        (compare: number): INumberExpectation;
        (compare: string): IStringExpectation;
		(spy: ISpy): ISpyExpectation;
        <TExpected extends Function>(block: TExpected): IFunctionExpectation<TExpected>;
		<TExpected extends Object>(object: TExpected): IObjectExpectation<TExpected>;        
        <TExpected>(compare: TExpected): IExpectation<TExpected>;

        /**
         * Creates a spy function.
        */
		//Probably could do more by typings the ISpy object with the generic type TFunc 
        createSpy<TFunc>(): ISpy & TFunc;

        /**
         * Replaces the method in target with a spy.
         */
        spyOn(target: any, method: string): ISpy;

        /**
         * Restores all spies created with expect.spyOn(). This is the same as calling spy.restore() on all spies created.
         */
        restoreSpies():void;

        /**
         * Determins if the object is a spy.
         */
        isSpy(object: any): boolean;

        /**
         * Does an assertion
         */
        assert(passed: boolean, message: string, actual: any):void;

        /**
         * You can add your own assertions using expect.extend and expect.assert
		 * A note here is that you'll have to extend the IExpect interface or one of the IExpectation interfaces have a look at
		 * typings-expect-element lib for an example 
         * @example
         * expect.extend({
         *   toBeAColor() {
         *    expect.assert(
         *     this.actual.match(/^#[a-fA-F0-9]{6}$/),
         *     'expected %s to be an HTML color',
         *     this.actual
         *   )
         *  }
         * })
         * expect('#ff00ff').toBeAColor()
         */
        extend(extension: IExtension | Object) : any;
    }
}

declare module "expect"{
	let expect: expect.IExpect;
	export = expect;	
}