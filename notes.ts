"use amd";

var _key:string = "__OWN_NOTES_OBJECTS"
declare type kvstore = { [key: string]: any };

export function own(that: kvstore, ...restParams:any[]): void {
	var objects = that[_key] = that[_key] || []

	for (var i = 0; i < restParams.length; i++) {
		objects.push(arguments[i])
	}
}

export function clean(that: kvstore): void {
	var objects = that[_key] = that[_key] || []

	while (objects.length > 0) {
		try {
			objects.pop().recycle()
		} catch (e) { }
	}
}
