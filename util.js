define(["require", "exports"], function (require, exports) {
    /// <reference path="typings/com.ibm.domino.d.ts" />
    "use amd";
    exports.ext2mime = {
        gif: "image/gif",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg"
    };
    function uuid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return "{" + uuid + "}";
    }
    exports.uuid = uuid;
    ;
    function unid() {
        var d = new Date().getTime();
        var unid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return r.toString(16);
        });
        return unid;
    }
    exports.unid = unid;
    ;
    function getMimeType(filename) {
        var ext = filename.split(".").pop().toLowerCase();
        if (!!exports.ext2mime[ext]) {
            return exports.ext2mime[ext];
        }
        else {
            return "octet/stream";
        }
    }
    exports.getMimeType = getMimeType;
    function tryGetDoc(db, unid) {
        try {
            return db.getDocumentByUNID(unid);
        }
        catch (e) {
            return null;
        }
    }
    exports.tryGetDoc = tryGetDoc;
    function isRecycled(obj) {
        try {
            return (!!!obj || obj.toString() === "" || (obj instanceof NotesDatabase ? obj.getReplicaID().length() > 0 : obj.toString() === ""));
        }
        catch (e) {
            return true;
        }
    }
    exports.isRecycled = isRecycled;
    function repeat(count, proc, param1) {
        if (param1 === void 0) { param1 = null; }
        var p1 = param1;
        for (var i = 0; i < count; i++) {
            p1 = proc(p1);
        }
        return p1;
    }
    exports.repeat = repeat;
    function mkstring(c, count) {
        var tArr = [];
        for (var i = 0; i < count; i++) {
            tArr.push(c);
        }
        return tArr.join("");
    }
    exports.mkstring = mkstring;
    function padleft(inVar, len, c, permissive) {
        if (permissive === void 0) { permissive = false; }
        inVar = inVar + "";
        if (permissive && inVar.length >= len) {
            return inVar;
        }
        else {
            return (repeat(4, function (p1) { return p1 + "" + c; }, "") + inVar).substr(len * (-1));
        }
    }
    exports.padleft = padleft;
    function map(arr, callback, thisArg) {
        if (arr instanceof Array) {
            for (var i = 0; i < arr.length; i++) {
                arr[i] = callback.call(thisArg, arr[i]);
            }
        }
        else {
            for (var key in arr) {
                arr[key] = callback.call(thisArg, arr[key]);
            }
        }
        return arr;
    }
    exports.map = map;
    function forEach(arr, callback, thisArg) {
        if (typeof (arr) === "string") {
            callback.call(thisArg, arr);
        }
        else if (arr instanceof Array) {
            for (var i = 0; i < arr.length; i++) {
                callback.call(thisArg, arr[i]);
            }
        }
        else if (arr instanceof java.util.Vector) {
            for (var i = 0; i < arr.size(); i++) {
                callback.call(thisArg, arr.get(i));
            }
        }
        else {
            for (var key in arr) {
                callback.call(thisArg, arr[key]);
            }
        }
    }
    exports.forEach = forEach;
    function vector2array(v) {
        var tArr = [];
        for (var i = 0; i < v.size(); i++) {
            tArr.push(v.get(i));
        }
        return tArr;
    }
    exports.vector2array = vector2array;
    function arguments2array(args) {
        var tArr = [];
        for (var k in args) {
            if (!isNaN(parseInt(k)))
                tArr.push(args[k]);
        }
        return tArr;
    }
    exports.arguments2array = arguments2array;
    function isString(it) {
        // summary:
        //		Return true if it is a String
        // it: anything
        //		Item to test.
        return (typeof it == "string" || it instanceof String); // Boolean
    }
    exports.isString = isString;
    function isArray(it) {
        // summary:
        //		Return true if it is an Array.
        //		Does not work on Arrays created in other windows.
        // it: anything
        //		Item to test.
        return it && (it instanceof Array || typeof it == "array"); // Boolean
    }
    exports.isArray = isArray;
    function isFunction(it) {
        // summary:
        //		Return true if it is a Function
        // it: anything
        //		Item to test.
        return it.toString() === "[object Function]" || it instanceof Function;
    }
    exports.isFunction = isFunction;
    function isObject(it) {
        // summary:
        //		Returns true if it is a JavaScript object (or an Array, a Function
        //		or null)
        // it: anything
        //		Item to test.
        return it !== undefined &&
            (it === null || typeof it == "object" || isArray(it) || isFunction(it)); // Boolean
    }
    exports.isObject = isObject;
    function isAlien(it) {
        // summary:
        //		Returns true if it is a built-in function or some other kind of
        //		oddball that *should* report as a function but doesn't
        return it && !isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
    }
    exports.isAlien = isAlien;
    function getUniversalID(o) {
        try {
            switch (typeof o) {
                case "NotesXspViewEntry":
                    return o.getUniversalID();
                case "NotesDocument":
                    return o.getUniversalID();
                default:
                    return o.getUniversalID();
            }
        }
        catch (e) {
            return null;
        }
        ;
    }
    exports.getUniversalID = getUniversalID;
    function docToObject(doc) {
        if (!doc.isValid())
            throw "Cannot convert doc to object: invalid document";
        var ret = {};
        var items = doc.getItems().toArray();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemType = item.getType();
            if (itemType == 1280 /* TEXT */ ||
                itemType == 768 /* NUMBERS */ ||
                itemType == 1024 /* DATETIMES */) {
                var itemValues = item.getValues();
                if (!!itemValues) {
                    itemValues = vector2array(itemValues);
                }
                else {
                    itemValues = "";
                }
                if (itemType == 1024 /* DATETIMES */) {
                    var tArr = [];
                    for (var k = 0; k < itemValues.length; k++) {
                        if (!!itemValues[i])
                            tArr.push(itemValues[i].toJavaDate());
                    }
                    ret[item.getName().toLowerCase()] = tArr;
                }
                else {
                    ret[item.getName().toLowerCase()] = itemValues;
                }
            }
        }
        return ret;
    }
    exports.docToObject = docToObject;
});
