define(function(require) {

	'use strict';


	var set = require('mout/object/set');
	var clone = require('mout/lang/clone');
	var forOwn = require('mout/object/forOwn');


	var ObjectProxy = function(graph, context) {
		Object.keys(graph).forEach(function(key) {
			if (!graph[key].isLeaf) {
				this.__props = this.__props || {};
				this.__props[key] = new ObjectProxy(graph[key], context);
				Object.defineProperty(this, key, {
					get: function() {
						return this.__props[key];
					},

					set: function(val) {
						Object.keys(val).forEach(function(childKey) {
							this[key][childKey] = val[childKey];
						}.bind(this));
					},

					configurable: true
				});
			}
			else {
				var descriptor = clone(graph[key].descriptor);
				if (descriptor.get) {
					descriptor.get = descriptor.get.bind(context);
				}
				if (descriptor.set) {
					descriptor.set = descriptor.set.bind(context);
				}
				this.__props = this.__props || {};
				this.__props[key] = descriptor;
				Object.defineProperty(this, key, descriptor);
			}
		}.bind(this));
	};


	var defineNestedProperty = function(obj, key, descriptor) {
		obj.__nestedProperties = obj.__nestedProperties || {};
		set(obj.__nestedProperties, key, {
			isLeaf: true,
			descriptor: descriptor
		});

		forOwn(obj.__nestedProperties, function(graph, key) {
			Object.defineProperty(obj, key, {
				get: function() {
					this.__props = this.__props || {};
					this.__props[key] = this.__props[key] || new ObjectProxy(graph, this);
					return this.__props[key];
				},
				set: function(val) {
					this.__props = this.__props || {};
					this.__props[key] = this.__props[key] || new ObjectProxy(graph, this);
					Object.keys(val).forEach(function(childKey) {
						this.__props[key][childKey] = val[childKey];
					}.bind(this));
				}
			});
		});
	};


	return defineNestedProperty;

});
