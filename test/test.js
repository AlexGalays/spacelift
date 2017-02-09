"use strict";
var option_ts_1 = require("option.ts");
var _1 = require("../");
var range_1 = require("../lib/array/range");
var set_1 = require("../lib/object/set");
var is = require("../lib/object/is");
require("../lib/all");
var expect = require('expect');
describe('lift', function () {
    it('can log every operation in a chain', function () {
    });
    describe('Array', function () {
        it('can be unwrapped', function () {
            var arr = [1, 2, 3];
            var unwrapped = _1["default"](arr).value();
            expect(unwrapped).toBe(arr);
            expect(arr instanceof Array).toBe(true);
        });
        it('can be mapped', function () {
            var arr = [1, 2, 3];
            var mapped = _1["default"](arr).map(function (x) { return x * 2; }).value();
            expect(mapped).toEqual([2, 4, 6]);
            expect(mapped instanceof Array).toBe(true);
            expect(mapped).toNotBe(arr);
        });
        it('can be filtered', function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var filtered = _1["default"](arr)
                .map(function (n) { return n * 2; })
                .filter(function (n) { return n > 6; })
                .value();
            expect(filtered).toEqual([8, 10, 12]);
            expect(filtered instanceof Array).toBe(true);
            expect(filtered).toNotBe(arr);
        });
        it('can append an item', function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var updated = _1["default"](arr).append(7).value();
            expect(updated).toEqual([1, 2, 3, 4, 5, 6, 7]);
            expect(updated).toNotBe(arr);
        });
        it('can append an Array of items', function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var updated = _1["default"](arr).appendAll([7, 8, 9, 10]).value();
            expect(updated).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            expect(updated).toNotBe(arr);
        });
        it('can insert an item', function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var updated = _1["default"](arr).insert(2, 300).value();
            expect(updated).toEqual([1, 2, 300, 3, 4, 5, 6]);
            expect(updated).toNotBe(arr);
        });
        it('can insert an Array of items', function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var updated = _1["default"](arr).insertAll(2, [300, 400]).value();
            expect(updated).toEqual([1, 2, 300, 400, 3, 4, 5, 6]);
            expect(updated).toNotBe(arr);
        });
        it('can replace an item at a given index', function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var updated = _1["default"](arr)
                .updateAt(2, function (n) { return _1["default"](n * 1000); }) // test that we can return a lifted value as well
                .updateAt(5, function (n) { return n * 100; })
                .updateAt(1000, function (n) { return n / 10; })
                .value();
            expect(updated).toEqual([1, 2, 3000, 4, 5, 600]);
            expect(updated).toNotBe(arr);
        });
        it('can remove an item at a given index', function () {
            var arr = ['a', 'b', 'c', 'd', 'e', 'f'];
            var updated = _1["default"](arr).removeAt(2).value();
            expect(updated).toEqual(['a', 'b', 'd', 'e', 'f']);
            expect(updated).toNotBe(arr);
        });
        it('can remove all falsy values', function () {
            var arr = [undefined, 'a', '', 'b', false, 'c', undefined, 'd', 'e', null, null, 'f', 0];
            var updated = _1["default"](arr).compact().value();
            expect(updated).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
            expect(updated).toNotBe(arr);
        });
        it('can find an item using a predicate', function () {
            var arr = [{ id: 11 }, { id: 22 }, { id: 33 }];
            var item = _1["default"](arr).find(function (user) { return user.id === 22; });
            expect(item.isDefined()).toBe(true); // Should be a Some()
            expect(item()).toEqual({ id: 22 });
            var missingItem = _1["default"](arr).find(function (user) { return user.id === 999; });
            expect(missingItem.isDefined()).toBe(false); // Should be a None
            expect(missingItem()).toEqual(undefined);
        });
        it('can find an item index using a predicate', function () {
            var arr = [{ id: 11 }, { id: 22 }, { id: 33 }];
            var maybeIndex = _1["default"](arr).findIndex(function (user) { return user.id === 22; });
            expect(maybeIndex.isDefined()).toBe(true); // Should be a Some()
            expect(maybeIndex()).toEqual(1);
            var noneIndex = _1["default"](arr).findIndex(function (user) { return user.id === 999; });
            expect(noneIndex.isDefined()).toBe(false); // Should be a None
            expect(noneIndex()).toEqual(undefined);
        });
        it('can be flattened', function () {
            var arr = [[1, 2], option_ts_1.Option(3), option_ts_1.None, [4, 5, 6], option_ts_1.Option(null)];
            var result = _1["default"](arr).flatten().value();
            expect(result).toEqual([1, 2, 3, 4, 5, 6]);
        });
        it('can count items satisfying a predicate', function () {
            var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3];
            var count = _1["default"](arr).count(function (n) { return n > 3; }).value();
            expect(count).toBe(7);
        });
        it('can keep only the first ocurrence of any encountered item', function () {
            var arr = [{ id: 10 }, { id: 20 }, { id: 10 }, { id: 30 }, { id: 40 }, { id: 40 }];
            var result = _1["default"](arr).distinct(function (u) { return u.id; }).value();
            expect(result).toEqual([{ id: 10 }, { id: 20 }, { id: 30 }, { id: 40 }]);
            expect(result[0]).toBe(arr[0]);
            expect(result[1]).toBe(arr[1]);
            expect(result[2]).toBe(arr[3]);
            expect(result[3]).toBe(arr[4]);
            var arr2 = ['7', 1, 2, 2, 1, '3', '7', '2', '3'];
            var result2 = _1["default"](arr2).distinct().value();
            expect(result2).toEqual(['7', 1, 2, '3', '2']);
        });
        it('can join() its items', function () {
            var arr = ['a', 'b', 'c'];
            var str = _1["default"](arr).join(', ').value();
            expect(str).toBe('a, b, c');
        });
        it('can be sliced from the left', function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var result = _1["default"](arr).take(3).value();
            expect(result).toEqual([1, 2, 3]);
        });
        it('can be sliced from the right', function () {
            var arr = [1, 2, 3, 4, 5, 6];
            var result = _1["default"](arr).takeRight(3).value();
            expect(result).toEqual([4, 5, 6]);
        });
        it('can create an object, grouping all items by key', function () {
            var arr = [
                { age: 10, name: 'jon' },
                { age: 30, name: 'momo' },
                { age: 10, name: 'kiki' },
                { age: 28, name: 'jesus' },
                { age: 29, name: 'frank' },
                { age: 30, name: 'michel' }
            ];
            var result = _1["default"](arr).groupBy(function (p) { return p.age; }).value();
            expect(result).toEqual({
                10: [{ age: 10, name: 'jon' }, { age: 10, name: 'kiki' }],
                30: [{ age: 30, name: 'momo' }, { age: 30, name: 'michel' }],
                28: [{ age: 28, name: 'jesus' }],
                29: [{ age: 29, name: 'frank' }]
            });
        });
        it('can be reversed', function () {
            var arr = [1, 2, 3, 4];
            var result = _1["default"](arr).reverse().value();
            expect(result).toEqual([4, 3, 2, 1]);
        });
        it('allows its first item to be read', function () {
            var arr = [1, 2, 3, 4];
            var one = _1["default"](arr).first()();
            expect(one).toBe(1);
            expect(_1["default"]([]).first()()).toBe(undefined);
        });
        it('allows its last item to be read', function () {
            var arr = [1, 2, 3, 4];
            var four = _1["default"](arr).last()();
            expect(four).toBe(4);
            expect(_1["default"]([]).last()()).toBe(undefined);
        });
        it('allows an item to be read by index', function () {
            var arr = [1, 2, 3, 4];
            var item = _1["default"](arr).get(2);
            expect(item.isDefined()).toBe(true);
            expect(item()).toBe(3);
            expect(_1["default"](arr).get(999).isDefined()).toBe(false);
            expect(_1["default"](arr).get(999)()).toBe(undefined);
        });
        it('can be sorted', function () {
            var sorted, arr;
            // Numbers
            arr = [5, 4, 1, 6, 2, 4, 3];
            sorted = _1["default"](arr).sort().value();
            expect(sorted).toNotBe(arr);
            expect(sorted).toEqual([1, 2, 3, 4, 4, 5, 6]);
            // Default case sensitive String sort
            arr = ['e', 'c', 'ca', 'A', 'F', 'd', 'b'];
            sorted = _1["default"](arr).sort().value();
            expect(sorted).toEqual(['A', 'F', 'b', 'c', 'ca', 'd', 'e']);
            // String sort using localeCompare
            arr = 'ä ba bb bä bz a e è é aa ae b ss sz sa st ß'.split(' ');
            sorted = _1["default"](arr).sort({ localeCompare: true }).value();
            expect(sorted.join(' ')).toBe('a ä aa ae b ba bä bb bz e é è sa ss ß st sz');
            // String sort + ignoreCase
            arr = ['e', 'c', 'ca', 'A', 'F', 'd', 'b'];
            sorted = _1["default"](arr).sort({ ignoreCase: true }).value();
            expect(sorted).toEqual(['A', 'b', 'c', 'ca', 'd', 'e', 'F']);
            // Reverse
            arr = ['e', 'c', 'ca', 'A', 'F', 'd', 'b'];
            sorted = _1["default"](arr).sort({ reverse: true, ignoreCase: true }).value();
            expect(sorted).toEqual(['F', 'e', 'd', 'ca', 'c', 'b', 'A']);
            // Falsy values (Except 0) should be in tail position
            arr = ['e', 'c', '', undefined, 'ca', null, 'A', undefined, 'F', null, 'd', 'b'];
            sorted = _1["default"](arr).sort().value();
            expect(sorted).toEqual(['A', 'F', 'b', 'c', 'ca', 'd', 'e', '', undefined, null, undefined, null]);
            // By
            var people = [
                { name: 'Jesse', creationDate: 2 },
                { name: 'Walt', creationDate: 1 },
                { name: 'Mike', creationDate: 4 },
                { name: 'Skyler', creationDate: 3 }
            ];
            sorted = _1["default"](people)
                .sort({ by: function (p) { return p.creationDate; } })
                .map(function (p) { return p.name; })
                .value();
            expect(sorted).toEqual(['Walt', 'Jesse', 'Skyler', 'Mike']);
            // Double-sort
            var people2 = [
                { name: 'Jesse', age: 44 },
                { name: 'Walt', age: 18 },
                { name: 'Mike', age: 20 },
                { name: 'Skyler', age: 37 },
                { name: 'Walt', age: 100 },
                { name: 'Tonton', age: 18 },
                { name: 'Jesse', age: 20 }
            ];
            sorted = _1["default"](people2)
                .sort({ by: function (p) { return p.age; } })
                .sort({ by: function (p) { return p.name; } })
                .value();
            expect(sorted).toEqual([
                { name: 'Jesse', age: 20 },
                { name: 'Jesse', age: 44 },
                { name: 'Mike', age: 20 },
                { name: 'Skyler', age: 37 },
                { name: 'Tonton', age: 18 },
                { name: 'Walt', age: 18 },
                { name: 'Walt', age: 100 }
            ]);
        });
        it('can tell whether at least one item satisfy a predicate', function () {
            var arr = [1, 2, 3, 4];
            var result = _1["default"](arr).some(function (n) { return n > 2; }).value();
            expect(result).toBe(true);
            var result2 = _1["default"](arr).some(function (n) { return n > 1000; }).value();
            expect(result2).toBe(false);
        });
        it('can tell whether all items satisfy a predicate', function () {
            var arr = [1, 2, 3, 4];
            var result = _1["default"](arr).every(function (n) { return n > 2; }).value();
            expect(result).toBe(false);
            var result2 = _1["default"](arr).every(function (n) { return n < 1000; }).value();
            expect(result2).toBe(true);
        });
        it('can fold its items', function () {
            var arr = ['a', 'b', 'c', 'd'];
            var result = _1["default"](arr).fold('zzz', function (acc, value) { return acc + value; }).value();
            expect(result).toBe('zzzabcd');
            expect(_1["default"]([]).fold('zzz', function (acc, value) { return acc + value; }).value()).toBe('zzz');
            var arr2 = [1, 2, 3];
            var seed2 = [];
            var result2 = _1["default"](arr2).fold(seed2, function (acc, value) { return acc.concat(value); });
            expect(result2 instanceof _1.ArrayOps).toBe(true);
            expect(result2.value()).toEqual([1, 2, 3]);
        });
        it('can fold its items from the right', function () {
            var arr = ['a', 'b', 'c', 'd'];
            var result = _1["default"](arr).foldRight('zzz', function (acc, value) { return acc + value; }).value();
            expect(result).toBe('zzzdcba');
            expect(_1["default"]([]).foldRight('zzz', function (acc, value) { return acc + value; }).value()).toBe('zzz');
            var arr2 = [1, 2, 3];
            var seed2 = [];
            var result2 = _1["default"](arr2).foldRight(seed2, function (acc, value) { return acc.concat(value); });
            expect(result2 instanceof _1.ArrayOps).toBe(true);
            expect(result2.value()).toEqual([3, 2, 1]);
        });
        it('can drop some items', function () {
            var arr = ['a', 'b', 'c', 'd'];
            var result = _1["default"](arr).drop(2).value();
            expect(result).toEqual(['c', 'd']);
            expect(_1["default"](arr).drop(100).value()).toEqual([]);
        });
        it('can drop some items from its right side', function () {
            var arr = ['a', 'b', 'c', 'd'];
            var result = _1["default"](arr).dropRight(2).value();
            expect(result).toEqual(['a', 'b']);
            expect(_1["default"](arr).dropRight(100).value()).toEqual([]);
        });
        it('can be converted to a Set-like object', function () {
            var arr = ['a', 'b', 'c', 'd'];
            var result = _1["default"](arr).toSet().value();
            expect(result).toEqual({ a: true, b: true, c: true, d: true });
            var arr2 = [1, 2, 3, 4];
            var result2 = _1["default"](arr2).toSet().value();
            expect(result2).toEqual({ 1: true, 2: true, 3: true, 4: true });
        });
        it('can create a range', function () {
            var singleArgRange = range_1["default"](5).value();
            expect(singleArgRange).toEqual([0, 1, 2, 3, 4]);
            var rangeWithoutStep = range_1["default"](1, 4).value();
            expect(rangeWithoutStep).toEqual([1, 2, 3, 4]);
            var rangeWithStepOfOne = range_1["default"](1, 4, 1).value();
            expect(rangeWithStepOfOne).toEqual([1, 2, 3, 4]);
            var rangeWithStepOfFive = range_1["default"](0, 15, 5).value();
            expect(rangeWithStepOfFive).toEqual([0, 5, 10, 15]);
            var rangeWithNegativeStep = range_1["default"](2, -4, -1).value();
            expect(rangeWithNegativeStep).toEqual([2, 1, 0, -1, -2, -3, -4]);
        });
        it('can be arbitrarily transformed', function () {
            var arr = [1, 2, 3];
            var result = _1["default"](arr)
                .transform(function (arr) {
                return arr.map(function (n) { return n * 2; });
            })
                .value();
            expect(result).toEqual([2, 4, 6]);
            // transform will use the correct wrapper depending on the return type. Array -> Object
            var result2 = _1["default"](arr).transform(function (arr) { return ({ a: 1, b: 2 }); });
            expect(result2 instanceof _1.ObjectOps).toBe(true);
            expect(result2.value()).toEqual({ a: 1, b: 2 });
            // transform will use the correct wrapper depending on the return type. Array -> string
            var result3 = _1["default"](arr).transform(function (arr) { return 'ohoh'; });
            expect(result3 instanceof _1.StringOps).toBe(true);
            expect(result3.value()).toBe('ohoh');
        });
    });
    describe('Object', function () {
        it('can read the value associated to a key', function () {
            var obj = { a: 1, b: '2', c: { d: 10 } };
            var result = _1["default"](obj).get('b');
            expect(result()).toBe('2');
            var map = { a: 1, b: 2, c: 3 };
            var result2 = _1["default"](map).get('d').map(function (x) { return x.toFixed(3); }); // toFixed to prove we got an Option<number> back
            expect(result2()).toBe(undefined);
        });
        it('can set a value', function () {
            var obj = { a: 1, b: 2, c: 22 };
            var result = _1["default"](obj)
                .add('b', 3)
                .add('c', 222)
                .add('newKey', 10)
                .value();
            expect(result).toNotBe(obj);
            expect(result).toEqual({ a: 1, b: 3, c: 222, newKey: 10 });
        });
        it('can update an object', function () {
            var obj = { a: 1, b: 2, c: '3' };
            var result = _1["default"](obj)
                .update({ a: 10, c: '33' })
                .update({ c: '333' })
                .value();
            expect(result).toNotBe(obj);
            expect(result).toEqual({ a: 10, b: 2, c: '333' });
        });
        it('can map the values of an object', function () {
            var obj = { a: 1, b: 2, c: 3 };
            var result = _1["default"](obj).mapValues(function (key, value) { return value * 2; }).value();
            expect(result).toNotBe(obj);
            expect(result).toEqual({ a: 2, b: 4, c: 6 });
        });
        it('can be converted to an Array', function () {
            var obj = { a: 1, b: 2, c: 3 };
            var result = _1["default"](obj)
                .toArray()
                .sort({ by: function (_a) {
                    var k = _a[0], v = _a[1];
                    return k;
                } })
                .value();
            expect(result).toNotBe(obj);
            expect(result).toEqual([['a', 1], ['b', 2], ['c', 3]]);
        });
        it('can convert is keys to an Array', function () {
            var obj = { a: 1, b: 2, c: 3 };
            var result = _1["default"](obj).keys().sort().value();
            expect(result).toNotBe(obj);
            expect(result).toEqual(['a', 'b', 'c']);
        });
        it('can convert is values to an Array', function () {
            var obj = { a: 1, b: 2, c: 3 };
            var result = _1["default"](obj).values().sort().value();
            expect(result).toNotBe(obj);
            expect(result).toEqual([1, 2, 3]);
        });
        it('can remove a key', function () {
            var obj = { a: 1, b: 2, c: 3 };
            var result = _1["default"](obj).remove('a', 'c').value();
            expect(result).toNotBe(obj);
            expect(result).toEqual({ b: 2 });
        });
        it('can be created as a Set-like object', function () {
            var obj = set_1["default"]('a', 'b', 'c').value();
            expect(obj).toEqual({ a: true, b: true, c: true });
        });
        it('can determine whether an object is of a certain type', function () {
            expect(is.array(null)).toBe(false);
            expect(is.array(undefined)).toBe(false);
            expect(is.array([])).toBe(true);
            expect(is.func({})).toBe(false);
            expect(is.func(function () { })).toBe(true);
        });
    });
    describe('README examples', function () {
        it('can run example #1', function () {
            var people = [
                { id: 1, name: 'jon' },
                { id: 2, name: 'sarah' },
                { id: 3, name: 'nina' }
            ];
            var updatedPeople = _1["default"](people)
                .findIndex(function (p) { return p.id === 2; })
                .map(function (index) { return _1["default"](people).updateAt(index, function (p) { return _1["default"](p).update({ name: 'Nick' }); }); })
                .getOrElse(people);
            expect(updatedPeople).toEqual([
                { id: 1, name: 'jon' },
                { id: 2, name: 'Nick' },
                { id: 3, name: 'nina' }
            ]);
        });
    });
});
