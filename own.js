define(["require", "exports"], function (require, exports) {
    "use amd";
    var _key = "__OWN_NOTES_OBJECTS";
    function own(that) {
        var restParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            restParams[_i - 1] = arguments[_i];
        }
        var objects = that[_key] = that[_key] || [];
        for (var i = 0; i < restParams.length; i++) {
            objects.push(arguments[i]);
        }
    }
    exports.own = own;
    function clean(that) {
        var objects = that[_key] = that[_key] || [];
        while (objects.length > 0) {
            try {
                objects.pop().recycle();
            }
            catch (e) { }
        }
    }
    exports.clean = clean;
    function cleanAll(arr) {
        for (var i = 0; i < arr.length; i++) {
            clean(arr[i]);
        }
    }
    exports.cleanAll = cleanAll;
});
