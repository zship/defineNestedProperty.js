define(function(require){

	'use strict';


	var defineNestedProperty = require('defineNestedProperty');


	module('defineNestedProperty');


	test('Nested Accessors', function() {
		var called = false;
		var A = function() {
			this._data = {
				a: {
					b: 'init'
				}
			};
		};

		defineNestedProperty(A.prototype, 'a.b', {
			get: function() {
				return this._data.a.b;
			},
			set: function(val) {
				called = true;
				this._data.a.b = val;
			}
		});


		var obj = new A();
		strictEqual(obj.a.b, 'init', 'initial a.b');

		obj.a.b = 'foo';
		ok(called, 'a.b setter was called');
		called = false;
		strictEqual(obj.a.b, 'foo', 'change a.b, get a.b');
		strictEqual(obj._data.a.b, 'foo', 'change a.b, get a.b === _data.a.b');

		obj.a = {
			b: 'bar'
		};
		ok(called, 'a.b setter was called');
		called = false;
		strictEqual(obj.a.b, 'bar', 'changed a, get a.b');
		strictEqual(obj._data.a.b, 'bar', 'changed a, get a.b === _data.a.b');

		obj.a.b = 'baz';
		ok(called, 'a.b setter was called');
		called = false;
		strictEqual(obj.a.b, 'baz', 'changed a, set a.b');
		strictEqual(obj._data.a.b, 'baz', 'changed a, set a.b, a.b === _data.a.b');

		obj.a = {
			b: {
				c: 'foo'
			}
		};

		strictEqual(obj.a.b.c, 'foo', 'add a.b.c (more deeply-nested than original definition of a)');
		strictEqual(obj._data.a.b.c, 'foo', 'add a.b.c, a.b.c === _data.a.b.c');

		obj.a.b.c = 'bar';

		strictEqual(obj.a.b.c, 'bar', 'change a.b.c');
		strictEqual(obj._data.a.b.c, 'bar', 'change a.b.c, a.b.c === _data.a.b.c');

		obj.a.b = {
			c: 'baz'
		};

		strictEqual(obj.a.b.c, 'baz', 'change a.b, get a.b.c');
		strictEqual(obj._data.a.b.c, 'baz', 'change a.b, get a.b.c === _data.a.b.c');
	});


	test('Properties on prototypes are unique to instances', function() {
		var A = function() {
			this._data = {
				a: {
					b: 1
				}
			};
		};

		defineNestedProperty(A.prototype, 'a.b', {
			get: function() {
				return this._data.a.b;
			},
			set: function(val) {
				this._data.a.b = val;
			}
		});

		var first = new A();
		first.a.b = 1;
		var second = new A();
		second.a.b = 2;

		ok(first._data.a.b === 1 && second._data.a.b === 2);
	});

});
