/// <reference path="typings/com.ibm.domino.d.ts" />
/// <reference path="typings/apache-commons-codec.d.ts" />
/// "use amd"
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "std"], function (require, exports, std) {
    //var _cache: { [key: string]: Summary} = {};
    (function (CounterType) {
        CounterType[CounterType["SUM"] = 0] = "SUM";
        CounterType[CounterType["UNIQUE"] = 1] = "UNIQUE";
    })(exports.CounterType || (exports.CounterType = {}));
    var CounterType = exports.CounterType;
    var SummaryCounter = (function (_super) {
        __extends(SummaryCounter, _super);
        function SummaryCounter(key, label, type) {
            if (label === void 0) { label = key; }
            if (type === void 0) { type = CounterType.SUM; }
            _super.call(this);
            this.key = key;
            this.label = label;
            this.type = type;
            this.uniques = {};
            this.value = 0;
        }
        SummaryCounter.prototype.go = function (keyOrValue, uniueLabel) {
            if (uniueLabel === void 0) { uniueLabel = keyOrValue; }
            if (this.type == CounterType.UNIQUE) {
                if (!this.uniques.hasOwnProperty(keyOrValue)) {
                    return (this.uniques[keyOrValue] = { key: keyOrValue, label: uniueLabel });
                }
                else {
                    return this.uniques[keyOrValue];
                }
            }
            else if (this.type == CounterType.SUM) {
                return (this.value += keyOrValue);
            }
        };
        SummaryCounter.prototype.getValue = function () {
            return this.value;
        };
        SummaryCounter.prototype.getUniquesArray = function (sort) {
            var tArr = [];
            for (var key in this.uniques) {
                tArr.push(this.uniques[key]);
            }
            if (sort) {
                var tArr2 = tArr.sort(function (x, y) {
                    return x.label.compareToIgnoreCase(y.label);
                });
                tArr = [];
                for (var i = 0; i < tArr2.length; i++) {
                    tArr.push(tArr2[i].key);
                }
            }
            return tArr;
        };
        SummaryCounter.prototype.getUniques = function () {
            return this.uniques;
        };
        SummaryCounter.prototype.getUniquesCount = function () {
            return this.getUniquesArray().length;
        };
        return SummaryCounter;
    })(std._Object);
    var Summary = (function (_super) {
        __extends(Summary, _super);
        function Summary(key, label) {
            if (key === void 0) { key = ""; }
            if (label === void 0) { label = key; }
            _super.call(this);
            this.key = key;
            this.label = label;
            this.uniques = {};
            this.sums = {};
            this.summaries = {};
            this.ready = false;
        }
        Summary.prototype.addUnique = function (key, label) {
            if (label === void 0) { label = key; }
            this.ready = true;
            if (!this.uniques.hasOwnProperty(key)) {
                this.uniques[key] = new SummaryCounter(key, label, CounterType.UNIQUE);
            }
        };
        Summary.prototype.addSum = function (key, label) {
            if (label === void 0) { label = key; }
            this.ready = true;
            if (!this.sums.hasOwnProperty(key)) {
                this.sums[key] = new SummaryCounter(key, label, CounterType.SUM);
            }
        };
        Summary.prototype.addSummary = function (key, label) {
            if (label === void 0) { label = key; }
            this.ready = true;
            if (!this.summaries.hasOwnProperty(key)) {
                return (this.summaries[key] = new Summary(this.key + "/" + key, label));
            }
            else {
                return this.summaries[key];
            }
        };
        Summary.prototype.getItemLabel = function (key) {
            if (key === undefined)
                return "";
            var keys = key.split("/");
            var key0 = keys.shift();
            if (this.sums.hasOwnProperty(key0)) {
                return this.sums[key0].label;
            }
            else if (this.uniques.hasOwnProperty(key0)) {
                return this.uniques[key0].label;
            }
            else if (this.summaries.hasOwnProperty(key0)) {
                if (keys.length > 0)
                    return this.summaries[key0].getItemLabel(keys.join("/"));
                else
                    return this.summaries[key0].label;
            }
        };
        Summary.prototype.getRawItem = function (key) {
            if (key === undefined)
                return null;
            var keys = key.split("/");
            var key0 = keys.shift();
            if (this.sums.hasOwnProperty(key0)) {
                return this.sums[key0];
            }
            else if (this.uniques.hasOwnProperty(key0)) {
                return this.uniques[key0];
            }
            else if (this.summaries.hasOwnProperty(key0)) {
                if (keys.length > 0)
                    return this.summaries[key0].getRawItem(keys.join("/"));
                else
                    return this.summaries[key0];
            }
        };
        Summary.prototype.getItem = function (key) {
            if (key === undefined)
                return false;
            var keys = key.split("/");
            var key0 = keys.shift();
            if (this.sums.hasOwnProperty(key0)) {
                return this.sums[key0].getValue();
            }
            else if (this.uniques.hasOwnProperty(key0)) {
                return this.uniques[key0].getUniquesCount();
            }
            else if (this.summaries.hasOwnProperty(key0)) {
                if (keys.length > 0)
                    return this.summaries[key0].getItem(keys.join("/"));
                else
                    return this.summaries[key0];
            }
        };
        Summary.prototype.go = function (key, value, uniqueLabel) {
            if (uniqueLabel === void 0) { uniqueLabel = value; }
            if (key === undefined)
                return false;
            if (value === undefined)
                return false;
            var keys = key.split("/");
            var key0 = keys.shift();
            if (this.sums.hasOwnProperty(key0)) {
                this.sums[key0].go(value);
            }
            else if (this.uniques.hasOwnProperty(key0)) {
                this.uniques[key0].go(value, uniqueLabel);
            }
            else if (this.summaries.hasOwnProperty(key0)) {
                this.summaries[key0].go(keys.join("/"), value, uniqueLabel);
            }
        };
        return Summary;
    })(std._Object);
    exports.Summary = Summary;
});
