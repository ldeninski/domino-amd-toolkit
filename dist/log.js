define(["require", "exports"], function (require, exports) {
    /// <reference path="typings/com.ibm.domino.d.ts" />
    "use amd";
    (function (LOG_LEVEL) {
        LOG_LEVEL[LOG_LEVEL["DEBUG"] = 0] = "DEBUG";
        LOG_LEVEL[LOG_LEVEL["INFO"] = 1] = "INFO";
        LOG_LEVEL[LOG_LEVEL["WARNING"] = 2] = "WARNING";
        LOG_LEVEL[LOG_LEVEL["ERROR"] = 3] = "ERROR";
    })(exports.LOG_LEVEL || (exports.LOG_LEVEL = {}));
    var LOG_LEVEL = exports.LOG_LEVEL;
    var logLevel = LOG_LEVEL.ERROR;
    function setLevel(level) {
        logLevel = level;
    }
    exports.setLevel = setLevel;
    function getLevel() {
        return logLevel;
    }
    exports.getLevel = getLevel;
    function info(text) {
        if (logLevel >= 3) {
            print("INFO: " + text);
        }
    }
    exports.info = info;
    function warn(text) {
        if (logLevel >= 2) {
            print("WARN: " + text);
        }
    }
    exports.warn = warn;
    function err(text) {
        if (logLevel >= 1) {
            print("ERR: " + text);
        }
    }
    exports.err = err;
    function log(text) {
        print(text);
    }
    exports.log = log;
    function dump(param) {
        if (param === undefined) {
            log("param: undefined");
            return;
        }
        for (var k in param) {
            if (param.hasOwnProperty(k))
                log("param[" + k + "]: " + param[k]);
        }
    }
    exports.dump = dump;
});
