define(["require", "exports"], function (require, exports) {
    /// <reference path="typings/com.ibm.domino.d.ts" />
    /// <reference path="typings/java.d.ts" />
    "use amd";
    var _debug = false;
    exports._Object = function () { };
    function instanceOf(o, c) {
        if (o === null && c === null) {
            return true;
        }
        if (o === undefined && c === undefined) {
            return true;
        }
        if (o === null || c === null) {
            return false;
        }
        if (o === undefined || c === undefined) {
            return false;
        }
        if (o === c)
            return true;
        if (o.constructor && o.constructor === c)
            return true;
        if (o instanceof c)
            return true;
        return instanceOf(o.prototype, c);
    }
    exports.instanceOf = instanceOf;
    function encodeURIComponent(s) {
        var result = java.net.URLEncoder.encode(s, "UTF-8") + "";
        return result.replace("+", "%20").replace("%21", "!").replace("%27", "'").replace("%28", "(").replace("%29", ")").replace("%7E", "~");
    }
    exports.encodeURIComponent = encodeURIComponent;
    function decodeURIComponent(s) {
        return java.net.URLDecoder.decode(s, "UTF-8") + "";
    }
    exports.decodeURIComponent = decodeURIComponent;
});
