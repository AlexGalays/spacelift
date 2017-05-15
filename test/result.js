"use strict";
exports.__esModule = true;
var expect = require("expect");
require("../all");
var __1 = require("..");
suite('option', function () {
    // Type checking
    test('An Ok can be assigned to any Result with a compatible Ok type', function () {
        var result = __1.Ok(10);
        var result2 = __1.Ok(10);
        function getResult() {
            return Math.random() > 0.4 ? __1.Ok(33) : __1.Err({ code: 'oops' });
        }
    });
    test('An Err can be assigned to any Result with a compatible Err type', function () {
        var result = __1.Err(10);
        var result2 = __1.Err(10);
        function getError() {
            return __1.Err({ code: 'oops' });
        }
    });
    // isOk
    test('Ok.isOk', function () {
        var ok = __1.Ok(10);
        expect(ok.isOk() && ok.get() === 10).toBe(true);
    });
    test('Err.isOk', function () {
        var err = __1.Err(10);
        expect(!err.isOk() && err.get() === 10).toBe(true);
    });
    // map
    test('Ok.map', function () {
        var ok = __1.Ok(10).map(function (x) { return x * 2; });
        expect(ok.type === 'ok' && ok.get() === 20).toBe(true);
    });
    test('Err.map', function () {
        var err = __1.Err(10).map(function (x) { return 10; });
        expect(err.type === 'err' && err.get() === 10).toBe(true);
    });
    // mapError
    test('Ok.mapError', function () {
        var ok = __1.Ok(10);
        var result = ok.mapError(function (e) { return e * 10; });
        expect(result.type === 'ok' && result.get() === 10).toBe(true);
    });
    test('Err.mapError', function () {
        var err = __1.Err(10);
        var result = err.mapError(function (e) { return e * 10; });
        expect(result.type === 'err' && result.get() === 100).toBe(true);
    });
    // flatMap
    test('Ok.flatMap -> Ok', function () {
        var ok = __1.Ok(10).flatMap(function (x) { return __1.Ok(String(x * 2)); });
        expect(ok.get()).toBe('20');
    });
    test('Ok.flatMap -> Err', function () {
        var err = __1.Ok(10).flatMap(function (_) { return __1.Err('oops'); });
        expect(err.get()).toBe('oops');
    });
    test('Err.flatMap -> Ok', function () {
        var err = __1.Err('oops').flatMap(function (_) { return __1.Ok(10); });
        expect(err.get()).toBe('oops');
    });
    test('Err.flatMap -> Err', function () {
        var err = __1.Err('oops').flatMap(function (_) { return __1.Err(10); });
        expect(err.get()).toBe('oops');
    });
    test('Err.flatMap -> Err | Ok', function () {
        var err = __1.Err('oops').flatMap(function (_) {
            return Math.random() > 0.5
                ? __1.Ok({ tata: true })
                : __1.Err({ tonton: 'oops' });
        });
        expect(err.get()).toBe('oops');
    });
    // fold
    test('Ok.fold', function () {
        var ok = __1.Ok(10).fold(function (err) { return 20; }, function (val) { return 30; });
        expect(ok).toBe(30);
    });
    test('Err.fold', function () {
        var err = __1.Err(10).fold(function (err) { return 20; }, function (val) { return 30; });
        expect(err).toBe(20);
    });
    // Result.all
    test('Result.all - 2 Ok', function () {
        var result = __1.Result.all(__1.Ok(10), __1.Ok('20'));
        expect(result.isOk()).toBe(true);
        expect(result.get()).toEqual([10, '20']);
    });
    test('Result.all - 1 Ok, 1 Err', function () {
        var result = __1.Result.all(__1.Ok(10), __1.Err('20'));
        expect(result.isOk()).toBe(false);
        expect(result.get()).toEqual('20');
    });
    test('Result.all - 1 Ok, 2 Err', function () {
        var result = __1.Result.all(__1.Ok(10), __1.Err('20'), __1.Err({ error: 'oops' }));
        expect(result.isOk()).toBe(false);
        expect(result.get()).toEqual('20');
    });
    // test('should not compile', () => {
    //   const test1 = Ok(10).flatMap(x => Ok(String(x * 2)))
    //   test1.get().lol
    //   const test11: Result<{ err: string }, string> = Ok('')
    //   test11.get().toLowerCase()
    //   const test2 = Ok('') as Result<{ err: string }, string>
    //   test2.get().toLowerCase()
    //   const test3 = Ok('').flatMap(x => Err(10))
    //   test3.get().lol
    // })
});
