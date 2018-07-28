"use strict";
exports.__esModule = true;
var expect = require("expect");
require("../commonjs/all");
var __1 = require("..");
suite('option', function () {
    // isDefined
    test('isDefined can help refine the type', function () {
        var value = 33;
        var some = __1.Option(value);
        some.isDefined() && some.get().toFixed(10);
    });
    // Factory
    test('Creating a Some', function () {
        var some = __1.Option(10);
        expect(some.isDefined()).toBe(true);
        expect(some.get()).toBe(10);
    });
    test('Creating a Some with an empty string', function () {
        var some = __1.Option('');
        expect(some.isDefined()).toBe(true);
        expect(some.get()).toBe('');
    });
    test('Creating a None with null', function () {
        var none = __1.Option(null);
        expect(!none.isDefined()).toBe(true);
        expect(none.get()).toBe(undefined);
    });
    test('Creating a None with undefined', function () {
        var none = __1.Option(undefined);
        expect(none.isDefined()).toBe(false);
        expect(none.get()).toBe(undefined);
    });
    test('Manipulating a None', function () {
        var none = __1.None;
        var anOption = none;
        var x = none.get();
        var y = anOption.get();
        x;
        y;
    });
    // forEach
    test('Some.forEach', function () {
        var state = 0;
        __1.Some(10).forEach(function (x) { return state = state + x; });
        __1.Option(10).forEach(function (x) { return state = state + x; });
        expect(state).toBe(20);
    });
    test('None.forEach', function () {
        var state = 0;
        __1.Option(null).forEach(function (x) { return state = 10; });
        expect(state).toBe(0);
    });
    // map
    test('Some.map -> Some', function () {
        var some = __1.Option(10).map(function (x) { return x * 2; });
        expect(some.isDefined() && some.get() === 20).toBe(true);
    });
    test('Some.map -> None', function () {
        var none = __1.Option(10).map(function (x) { return undefined; });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    test('None.map -> None', function () {
        var value = undefined;
        var none = __1.Option(value).map(function (x) { return x * 2; });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    // flatMap
    test('Some.flatMap -> Some', function () {
        var some = __1.Option(10).flatMap(function (x) { return __1.Option(x * 2); });
        expect(some.isDefined() && some.get() === 20).toBe(true);
    });
    test('Some.flatMap -> None', function () {
        var none = __1.Option(10).flatMap(function (_) { return __1.None; });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    test('None.flatMap -> Some', function () {
        var none = __1.Option(undefined).flatMap(function (_) { return __1.Option(10); });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    test('None.flatMap -> None', function () {
        var none = __1.Option(undefined).flatMap(function (_) { return __1.None; });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    // filter
    test('Some.filter -> Some', function () {
        var some = __1.Option(10).filter(function (x) { return x > 5; });
        expect(some.isDefined() && some.get() === 10).toBe(true);
    });
    test('Some.filter -> None', function () {
        var none = __1.Option(10).filter(function (x) { return x > 10; });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    test('None.filter -> true', function () {
        var none = __1.Option(undefined).filter(function (_) { return true; });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    test('None.filter -> false', function () {
        var none = __1.Option(undefined).filter(function (_) { return false; });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    // getOrElse
    test('Some getOrElse', function () {
        var result = __1.Option('').getOrElse('alt');
        expect(result).toBe('');
    });
    test('None getOrElse', function () {
        var value = undefined;
        var result = __1.Option(value).getOrElse(20);
        expect(result).toBe(20);
    });
    // orElse
    test('Some.orElse Some', function () {
        var some = __1.Option(10).orElse(function () { return __1.Option(20); });
        expect(some.isDefined() && some.get() === 10).toBe(true);
    });
    test('Some.orElse None', function () {
        var some = __1.Option(10).orElse(function () { return __1.None; });
        expect(some.isDefined() && some.get() === 10).toBe(true);
    });
    test('None.orElse Some', function () {
        var value = undefined;
        var some = __1.Option(value).orElse(function () { return __1.Option(20); });
        expect(some.isDefined() && some.get() === 20).toBe(true);
    });
    test('None.orElse None', function () {
        var none = __1.Option(undefined).orElse(function () { return __1.None; });
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    // fold
    test('Some.fold', function () {
        var some = __1.Option(10);
        var result = some.fold(function () { return 999; }, function (x) { return (x * 2).toString(); });
        // test the compilation of the returned type: It should be a string | number
        if (typeof result === 'number') {
            result.toFixed();
        }
        else {
            result.charCodeAt(0);
        }
        expect(result).toBe('20');
    });
    test('None.fold', function () {
        var none = __1.Option(null);
        var result = none.fold(function () { return '999'; }, function (x) { return (x * 2).toString(); });
        expect(result).toBe('999');
    });
    // toArray
    test('Some.toArray', function () {
        var result = __1.Option(10).toArray();
        expect(result instanceof __1.ArrayOps).toBe(true);
        expect(result.value()).toEqual([10]);
    });
    test('None.toArray', function () {
        var result = __1.Option(null).toArray();
        expect(result instanceof __1.ArrayOps).toBe(true);
        expect(result.value()).toEqual([]);
    });
    // toResult
    test('Some.toResult', function () {
        var result = __1.Option(10).toResult(function () { return 'nope'; });
        expect(result.isOk() && result.get()).toBe(10);
    });
    test('None.toResult', function () {
        var result = __1.Option(null).toResult(function () { return 'error'; });
        expect(!result.isOk() && result.get()).toBe('error');
    });
    // Option.all
    test('Option.all - 2 Some', function () {
        var some = __1.Option.all([__1.Option('a'), __1.Option('b')]);
        expect(some.isDefined() && some.get().join(',') === 'a,b').toBe(true);
    });
    test('Option.all - 1 Some, 1 defined value', function () {
        var some = __1.Option.all([__1.Option('a'), 'b']);
        expect(some.isDefined() && some.get().join(',') === 'a,b').toBe(true);
    });
    test('Option.all - 3 Some', function () {
        var some = __1.Option.all([__1.Option('a'), __1.Option('b'), __1.Option('c')]);
        expect(some.isDefined() && some.get().join(',') === 'a,b,c').toBe(true);
    });
    test('Option.all - 1 Some, 1 None', function () {
        var none = __1.Option.all([__1.Option('a'), __1.Option(undefined)]);
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    test('Option.all - 1 Some, 1 undefined', function () {
        var none = __1.Option.all([__1.Option('a'), undefined]);
        expect(!none.isDefined() && none.get() === undefined).toBe(true);
    });
    test('Option.all - values in the result tuple are refined to be non nullable', function () {
        var nullableString = 'a';
        __1.Option.all([__1.Option(nullableString), undefined, nullableString]).map(function (_a) {
            var a = _a[0], b = _a[1], c = _a[2];
            // Just testing the compilation here
            a.charCodeAt(10);
            c.charCodeAt(10);
            return 0;
        });
    });
    test('Option.all - 10 Some', function () {
        var result = __1.Option.all([__1.Some(1), __1.Some('2'), __1.Some(3), __1.Some('4'), __1.Some(5), __1.Some(true), __1.Some(7), __1.Some(8), __1.Some(9), __1.Some(10)]);
        var result2 = __1.Option.all([__1.Some(1), __1.Some('2'), __1.Some(3), __1.Some('4'), __1.Some(5), __1.Some(true)]);
        expect(result.isDefined() && result.get()[2] + result.get()[9] === 13).toBe(true);
        expect(result.get()).toEqual([1, '2', 3, '4', 5, true, 7, 8, 9, 10]);
        expect(result2.isDefined() && result2.get()[0] + result2.get()[4] === 6).toBe(true);
    });
    // Option.allObject
    test('Option.allObject - 2 Some', function () {
        var some = __1.Option.allObject({ a: __1.Some('a'), b: __1.Some('b') });
        expect(some.isDefined()).toBe(true);
        expect(some.get()).toEqual({ a: 'a', b: 'b' });
    });
    test('Option.allObject - 1 Some, 1 None', function () {
        var some = __1.Option.allObject({ a: __1.Some('a'), b: __1.None });
        expect(some).toEqual(__1.None);
    });
    test('Option.allObject - values in the result have correct inference', function () {
        var some = __1.Option.allObject({
            a: __1.Some('a'),
            b: __1.Some(2),
            c: __1.Some([1, 2, 3])
        });
        // Just testing typechecker here
        some.getE().a;
        some.getE().b;
        some.getE().c;
    });
    // Option.isOption
    test('Option.isOption', function () {
        expect(__1.Option.isOption(true)).toBe(false);
        expect(__1.Option.isOption(false)).toBe(false);
        expect(__1.Option.isOption('')).toBe(false);
        expect(__1.Option.isOption([])).toBe(false);
        expect(__1.Option.isOption(__1.None)).toBe(true);
        expect(__1.Option.isOption(__1.Option(33))).toBe(true);
        expect(__1.Option.isOption(__1.Option(undefined))).toBe(true);
    });
    // toString
    test('Some toString', function () {
        var str = __1.Option(10).toString();
        expect(str).toBe('Some(10)');
    });
    test('None toString', function () {
        var str = __1.Option(undefined).toString();
        expect(str).toBe('None');
    });
    // implicit toJSON
    test('Some toJSON', function () {
        var obj = JSON.parse(JSON.stringify({ x: __1.Option(10) }));
        expect(obj.x).toBe(10);
    });
    test('None toJSON', function () {
        var obj = JSON.parse(JSON.stringify({ x: __1.Option(undefined) }));
        expect(obj.x).toBe(null);
    });
    // Perfs
    test('Measure the time needed to create a Some', function () {
        for (var i = 0; i < 10; i++) {
            console.time("Creating a Some (" + i + ")");
            __1.Option(i);
            console.timeEnd("Creating a Some (" + i + ")");
        }
    });
});
