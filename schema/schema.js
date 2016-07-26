var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    /// <reference path="../typings/com.ibm.domino.d.ts" />
    // added some notes fields - id: UNID;
    "use amd";
    var Schema;
    (function (Schema) {
        var Thing = (function () {
            function Thing() {
            }
            return Thing;
        })();
        Schema.Thing = Thing;
        var Intangible = (function (_super) {
            __extends(Intangible, _super);
            function Intangible() {
                _super.call(this);
            }
            ;
            return Intangible;
        })(Thing);
        Schema.Intangible = Intangible;
        var Action = (function (_super) {
            __extends(Action, _super);
            function Action() {
                _super.call(this);
            }
            ;
            return Action;
        })(Thing);
        Schema.Action = Action;
        var Event = (function (_super) {
            __extends(Event, _super);
            function Event() {
                _super.call(this);
            }
            ;
            return Event;
        })(Thing);
        Schema.Event = Event;
        var Organization = (function (_super) {
            __extends(Organization, _super);
            function Organization() {
                _super.call(this);
            }
            ;
            return Organization;
        })(Thing);
        Schema.Organization = Organization;
        var Person = (function (_super) {
            __extends(Person, _super);
            function Person() {
                _super.call(this);
            }
            ;
            return Person;
        })(Thing);
        Schema.Person = Person;
        var Offer = (function (_super) {
            __extends(Offer, _super);
            function Offer() {
                _super.call(this);
            }
            ;
            return Offer;
        })(Intangible);
        Schema.Offer = Offer;
    })(Schema = exports.Schema || (exports.Schema = {}));
});
