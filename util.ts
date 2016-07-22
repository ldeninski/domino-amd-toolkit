/// <reference path="typings/com.ibm.domino.d.ts" />
"use amd";

export var ext2mime = {
	gif: "image/gif",
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg"
}

interface SimpleCallback {
	(e: any): any;
}

export function uuid() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return "{" + uuid + "}";
};

export function unid() {
	var d = new Date().getTime();
	var unid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return r.toString(16);
	});
	return unid;
};

export function getMimeType(filename:string):string {
	var ext = filename.split(".").pop().toLowerCase();
	if(!!ext2mime[ext]) {
		return ext2mime[ext];
	} else {
		return "octet/stream";
	}
}

export function tryGetDoc(db: NotesDatabase, unid: string): NotesDocument {
	try {
		return db.getDocumentByUNID(unid);
	} catch (e) {
		return null;
	}
}

export function isRecycled(obj: any) {
	try {
		return (!obj || obj.toString() === "" || (obj instanceof NotesDatabase ? !!obj.getFilePath() : !!obj.toString()))
	} catch(e) {
		return true;
	}
}

export function repeat(count: number, proc: any, param1: any = null) {
	var p1 = param1;
	for(var i = 0; i < count; i++) {
		p1 = proc(p1);
	}
	return p1;
}

export function mkstring(c:string, count:number) {
	var tArr:string[] = [];
	for(var i = 0; i < count; i++) {
		tArr.push(c);
	}
	return tArr.join("");
}

export function padleft(inVar: any, len: number, c: string, permissive: boolean = false): string {
	inVar = inVar + "";
	if(permissive && inVar.length >= len) {
		return inVar;
	} else {
		return (repeat(4, function(p1) {return p1 + "" + c}, "") + inVar).substr(len*(-1))
	}
}

export function map(arr: { [key: string]: any }, callback: SimpleCallback, thisArg?: any)
export function map(arr: any[], callback: SimpleCallback, thisArg?: any) {
	if (arr instanceof Array) {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = callback.call(thisArg, arr[i]);
		}
	} else {
		for (var key in arr) {
			arr[key] = callback.call(thisArg, arr[key]);
		}
	}

	return arr
}

export function forEach(obj: { [key: string]: any }, callback: SimpleCallback, thisArg?: any)
export function forEach(arr: any[] | java.util.Vector<any>, callback: SimpleCallback, thisArg?: any) {
	if (typeof (arr) === "string") {
		callback.call(thisArg, arr);
	} else if (arr instanceof Array) {
		for (var i = 0; i < arr.length; i++) {
			callback.call(thisArg, arr[i]);
		}
	} else if (arr instanceof java.util.Vector) {
		for (var i = 0; i < arr.size(); i++) {
			callback.call(thisArg, arr.get(i));
		}
	} else {
		for (var key in arr) {
			callback.call(thisArg, arr[key]);
		}
	}
}

export function vector2array(v: java.util.Vector<any>): any[] {
	var tArr = [];

	for (var i = 0; i < v.size(); i++) {
		tArr.push(v.get(i));
	}
	return tArr
}

export function arguments2array(args): any[] {
	var tArr:any[] = [];
	for(var k in args) {
		if(!isNaN(parseInt(k)))
			tArr.push(args[k]);
	}
	return tArr
}


export function isString(it): boolean {
	// summary:
	//		Return true if it is a String
	// it: anything
	//		Item to test.
	return (typeof it == "string" || it instanceof String); // Boolean
}

export function isArray(it): boolean {
	// summary:
	//		Return true if it is an Array.
	//		Does not work on Arrays created in other windows.
	// it: anything
	//		Item to test.
	return it && (it instanceof Array || typeof it == "array"); // Boolean
}

export function isFunction(it): boolean {
	// summary:
	//		Return true if it is a Function
	// it: anything
	//		Item to test.
	return it.toString() === "[object Function]" || it instanceof Function;
}

export function isObject(it): boolean {
	// summary:
	//		Returns true if it is a JavaScript object (or an Array, a Function
	//		or null)
	// it: anything
	//		Item to test.
	return it !== undefined &&
		(it === null || typeof it == "object" || isArray(it) || isFunction(it)); // Boolean
}

export function isAlien(it): boolean {
	// summary:
	//		Returns true if it is a built-in function or some other kind of
	//		oddball that *should* report as a function but doesn't
	return it && !isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
}

export function docToObject(doc: NotesDocument): { [name: string]: any } {
	if (!doc.isValid()) throw "Cannot convert doc to object: invalid document";
	var ret: { [name: string]: any } = {};

	var items = doc.getItems().toArray()
	for (var i = 0; i < items.length; i++) {
		let item = items[i];
		let itemType = item.getType();

		if (
			itemType == NotesItem.TYPE.TEXT ||
			itemType == NotesItem.TYPE.NUMBERS ||
			itemType == NotesItem.TYPE.DATETIMES
		) {
			let itemValues: any = item.getValues()
			if (!!itemValues) {
				itemValues = vector2array(itemValues)
			} else {
				itemValues = ""
			}
			if (itemType == NotesItem.TYPE.DATETIMES) {
				let tArr: Date[] = [];
				for (var k = 0; k < itemValues.length; k++) {
					if (!!itemValues[i]) tArr.push((<NotesDateTime>itemValues[i]).toJavaDate());
				}
				ret[item.getName().toLowerCase()] = tArr;
			} else {
				ret[item.getName().toLowerCase()] = itemValues;
			}
		}
	}

	return ret;
}