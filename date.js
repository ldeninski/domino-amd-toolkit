define(["require", "exports", "util"], function (require, exports, util) {
    /// <reference path="typings/com.ibm.domino.d.ts" />
    "use amd";
    function add(date) {
        throw "Not implemented";
    }
    exports.add = add;
    function format(date, format) {
        var _a = [date.getDate(), date.getMonth() + 1, date.getFullYear()], d = _a[0], m = _a[1], y = _a[2];
        return util.map(format.split(""), function (el) {
            switch (el) {
                case "d":
                    return d + "";
                case "D":
                    return util.padleft(d, 2, "0");
                case "m":
                    return m + "";
                case "M":
                    return util.padleft(m, 2, "0");
                case "y":
                    return y + "";
                case "Y":
                    return util.padleft(y, 4, "0");
                default:
                    return el + "";
            }
        }).join("");
    }
    exports.format = format;
});
