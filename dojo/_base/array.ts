/// <reference path="../../typings/com.ibm.domino.d.ts" />
"use amd";


var cache = {}, u;

function buildFn(fn){
	return cache[fn] = new Function("item", "index", "array", fn); // Function
}

function everyOrSome(some){
	var every = !some;
	return function(a, fn, o){
		var i = 0, l = a && a.length || 0, result;
		if(l && typeof a == "string") a = a.split("");
		if(typeof fn == "string") fn = cache[fn] || buildFn(fn);
		if(o){
			for(; i < l; ++i){
				result = !fn.call(o, a[i], i, a);
				if(some ^ result){
					return !result;
				}
			}
		}else{
			for(; i < l; ++i){
				result = !fn(a[i], i, a);
				if(some ^ result){
					return !result;
				}
			}
		}
		return every; // Boolean
	};
}

// indexOf, lastIndexOf

function index(up){
	var delta = 1, lOver = 0, uOver = 0;
	if(!up){
		delta = lOver = uOver = -1;
	}
	return function(a, x, from, last?){
		if(last && delta > 0){
			// TODO: why do we use a non-standard signature? why do we need "last"?
			return lastIndexOf(a, x, from);
		}
		var l = a && a.length || 0, end = up ? l + uOver : lOver, i;
		if(from === u){
			i = up ? lOver : l + uOver;
		}else{
			if(from < 0){
				i = l + from;
				if(i < 0){
					i = lOver;
				}
			}else{
				i = from >= l ? l + uOver : from;
			}
		}
		if(l && typeof a == "string") a = a.split("");
		for(; i != end; i += delta){
			if(a[i] == x){
				return i; // Number
			}
		}
		return -1; // Number
	};
}

export var every = everyOrSome(false);
export var some = everyOrSome(true);
export var indexOf = index(true);
export var lastIndexOf = index(false);

export function forEach(arr, callback, thisObject?){
	// summary:
	//		for every item in arr, callback is invoked. Return values are ignored.
	//		If you want to break out of the loop, consider using array.every() or array.some().
	//		forEach does not allow breaking out of the loop over the items in arr.
	// arr:
	//		the array to iterate over. If a string, operates on individual characters.
	// callback:
	//		a function is invoked with three arguments: item, index, and array
	// thisObject:
	//		may be used to scope the call to callback
	// description:
	//		This function corresponds to the JavaScript 1.6 Array.forEach() method, with one difference: when
	//		run over sparse arrays, this implementation passes the "holes" in the sparse array to
	//		the callback function with a value of undefined. JavaScript 1.6's forEach skips the holes in the sparse array.
	//		For more details, see:
	//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach
	// example:
	//	| // log out all members of the array:
	//	| array.forEach(
	//	|		[ "thinger", "blah", "howdy", 10 ],
	//	|		function(item){
	//	|			console.log(item);
	//	|		}
	//	| );
	// example:
	//	| // log out the members and their indexes
	//	| array.forEach(
	//	|		[ "thinger", "blah", "howdy", 10 ],
	//	|		function(item, idx, arr){
	//	|			console.log(item, "at index:", idx);
	//	|		}
	//	| );
	// example:
	//	| // use a scoped object member as the callback
	//	|
	//	| var obj = {
	//	|		prefix: "logged via obj.callback:",
	//	|		callback: function(item){
	//	|			console.log(this.prefix, item);
	//	|		}
	//	| };
	//	|
	//	| // specifying the scope function executes the callback in that scope
	//	| array.forEach(
	//	|		[ "thinger", "blah", "howdy", 10 ],
	//	|		obj.callback,
	//	|		obj
	//	| );
	//	|
	//	| // alternately, we can accomplish the same thing with lang.hitch()
	//	| array.forEach(
	//	|		[ "thinger", "blah", "howdy", 10 ],
	//	|		lang.hitch(obj, "callback")
	//	| );
	// arr: Array|String
	// callback: Function|String
	// thisObject: Object?

	var i = 0, l = arr && arr.length || 0;
	if(l && typeof arr == "string") arr = arr.split("");
	if(typeof callback == "string") callback = cache[callback] || buildFn(callback);
	if(thisObject){
		for(; i < l; ++i){
			callback.call(thisObject, arr[i], i, arr);
		}
	}else{
		for(; i < l; ++i){
			callback(arr[i], i, arr);
		}
	}
}


export function map(arr, callback, thisObject?, Ctr?){
	// summary:
	//		applies callback to each element of arr and returns
	//		an Array with the results
	// arr: Array|String
	//		the array to iterate on. If a string, operates on
	//		individual characters.
	// callback: Function|String
	//		a function is invoked with three arguments, (item, index,
	//		array),	 and returns a value
	// thisObject: Object?
	//		may be used to scope the call to callback
	// returns: Array
	// description:
	//		This function corresponds to the JavaScript 1.6 Array.map() method, with one difference: when
	//		run over sparse arrays, this implementation passes the "holes" in the sparse array to
	//		the callback function with a value of undefined. JavaScript 1.6's map skips the holes in the sparse array.
	//		For more details, see:
	//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
	// example:
	//	| // returns [2, 3, 4, 5]
	//	| array.map([1, 2, 3, 4], function(item){ return item+1 });

	// TODO: why do we have a non-standard signature here? do we need "Ctr"?
	var i = 0, l = arr && arr.length || 0, out = new (Ctr || Array)(l);
	if(l && typeof arr == "string") arr = arr.split("");
	if(typeof callback == "string") callback = cache[callback] || buildFn(callback);
	if(thisObject){
		for(; i < l; ++i){
			out[i] = callback.call(thisObject, arr[i], i, arr);
		}
	}else{
		for(; i < l; ++i){
			out[i] = callback(arr[i], i, arr);
		}
	}
	return out; // Array
}

export function filter(arr, callback, thisObject){
	// summary:
	//		Returns a new Array with those items from arr that match the
	//		condition implemented by callback.
	// arr: Array
	//		the array to iterate over.
	// callback: Function|String
	//		a function that is invoked with three arguments (item,
	//		index, array). The return of this function is expected to
	//		be a boolean which determines whether the passed-in item
	//		will be included in the returned array.
	// thisObject: Object?
	//		may be used to scope the call to callback
	// returns: Array
	// description:
	//		This function corresponds to the JavaScript 1.6 Array.filter() method, with one difference: when
	//		run over sparse arrays, this implementation passes the "holes" in the sparse array to
	//		the callback function with a value of undefined. JavaScript 1.6's filter skips the holes in the sparse array.
	//		For more details, see:
	//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
	// example:
	//	| // returns [2, 3, 4]
	//	| array.filter([1, 2, 3, 4], function(item){ return item>1; });

	// TODO: do we need "Ctr" here like in map()?
	var i = 0, l = arr && arr.length || 0, out = [], value;
	if(l && typeof arr == "string") arr = arr.split("");
	if(typeof callback == "string") callback = cache[callback] || buildFn(callback);
	if(thisObject){
		for(; i < l; ++i){
			value = arr[i];
			if(callback.call(thisObject, value, i, arr)){
				out.push(value);
			}
		}
	}else{
		for(; i < l; ++i){
			value = arr[i];
			if(callback(value, i, arr)){
				out.push(value);
			}
		}
	}
	return out; // Array
}