(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("difflib"), require("vkbeautify"), require("x2js"));
	else if(typeof define === 'function' && define.amd)
		define("jasmine-snapshot", ["difflib", "vkbeautify", "x2js"], factory);
	else if(typeof exports === 'object')
		exports["jasmine-snapshot"] = factory(require("difflib"), require("vkbeautify"), require("x2js"));
	else
		root["jasmine-snapshot"] = factory(root["difflib"], root["vkbeautify"], root["x2js"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var difflib_1 = __webpack_require__(0);
var vkbeautify_1 = __webpack_require__(1);
var X2JS = __webpack_require__(2);
var currentSpec = "";
jasmine.getEnv().addReporter({
    specStarted: function (result) {
        currentSpec = result.fullName;
    }
});
var nativeWarn = window.console.warn;
window.console.warn = function () {
    if ((arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("[xmldom ") !== -1)) {
        return;
    }
    ;
    nativeWarn.apply(window.console, arguments);
};
var nativeError = window.console.error;
window.console.error = function () {
    if ((arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("entity not found") !== -1)) {
        return;
    }
    ;
    nativeError.apply(window.console, arguments);
};
exports.KeyExceptionList = ["typeof"];
function ResetExceptionList() {
    exports.KeyExceptionList = ["typeof"];
}
exports.ResetExceptionList = ResetExceptionList;
function MatchesSnapshot(snapshot, actual) {
    if (actual !== snapshot) {
        var diff = difflib_1.default.unifiedDiff(snapshot.split("\n"), actual.split("\n"));
        var diff_string_1 = "\n*************************************************************\n";
        diff_string_1 += "* Snapshot did not match Actual. Here is the diff ***********\n";
        diff_string_1 += "*************************************************************\n";
        diff_string_1 += currentSpec + "\n\n";
        diff.forEach(function (d) { return diff_string_1 += d + "\n"; });
        diff_string_1 += "\n";
        var one_line_actual = actual.replace(/\n/g, "").replace(/\t/g, "");
        while (one_line_actual.indexOf("  ") !== -1) {
            one_line_actual = one_line_actual.replace(/(  )/g, " ");
        }
        diff_string_1 += "*************************************************************\n";
        diff_string_1 += "* If the Actual is valid, update the snapshot with this     *\n";
        diff_string_1 += "*************************************************************\n\n";
        diff_string_1 += " ----- Formatted ------\n" + actual + "\n\n ----- Single Line ------\n" + one_line_actual;
        console.error(diff_string_1);
        fail("Actual does not match snapshot. See above. ");
    }
}
exports.MatchesSnapshot = MatchesSnapshot;
function MatchesXMLSnapshot(snapshot, actual) {
    expectxml(actual).toMatchSnapshot(snapshot);
}
exports.MatchesXMLSnapshot = MatchesXMLSnapshot;
function MatchesJSONSnapshot(snapshot, actual) {
    var prettyActual = actual ? vkbeautify_1.json(actual) : actual;
    var prettySnapshot = snapshot ? vkbeautify_1.json(snapshot) : snapshot;
    MatchesSnapshot(prettySnapshot, prettyActual);
}
exports.MatchesJSONSnapshot = MatchesJSONSnapshot;
function MatchesJSSnapshot(snapshot, actual) {
    expectjs(actual).toMatchSnapshot(snapshot);
}
exports.MatchesJSSnapshot = MatchesJSSnapshot;
function expectjs(actual) {
    return new SnapshotJSInner(actual);
}
exports.expectjs = expectjs;
function expectxml(xml_actual) {
    return new SnapshotXMLInner(xml_actual);
}
exports.expectxml = expectxml;
var SnapshotInner = (function () {
    function SnapshotInner(actual) {
        this.actual = actual;
    }
    SnapshotInner.prototype.afterApplying = function (transformFunction) {
        this.actual = transformFunction(this.actual);
        return this;
    };
    return SnapshotInner;
}());
var SnapshotJSInner = (function (_super) {
    __extends(SnapshotJSInner, _super);
    function SnapshotJSInner(actual) {
        var _this = _super.call(this, actual) || this;
        _this.parsed_values = new Array();
        _this.actual = actual;
        return _this;
    }
    SnapshotJSInner.prototype.toMatchSnapshot = function (snapshot) {
        var prettyActual = this.actual ? vkbeautify_1.json(this.getOrderedStringifyAndClean()) : this.actual;
        var prettySnapshot = snapshot ? vkbeautify_1.json(snapshot) : snapshot;
        MatchesSnapshot(prettySnapshot, prettyActual);
    };
    SnapshotJSInner.prototype.getOrderedStringifyAndClean = function () {
        var keys = this.collectAllKeysAndRemoveCircular(this.actual);
        return JSON.stringify(this.actual, keys);
    };
    SnapshotJSInner.prototype.collectAllKeysAndRemoveCircular = function (js_object) {
        var _this = this;
        var allKeys = new Array();
        var json = JSON.stringify(js_object, function (key, val) {
            if (_this.isIEPooOrCurcularReferences(key, val)) {
                return;
            }
            allKeys.push(key);
            return val;
        });
        this.actual = JSON.parse(json);
        return allKeys.sort(function (a, b) { return (a > b) ? 1 : -1; });
    };
    SnapshotJSInner.prototype.isIEPooOrCurcularReferences = function (key, value) {
        if (typeof key === "string" && exports.KeyExceptionList.some(function (ex) { return key.indexOf(ex) !== -1; })) {
            return true;
        }
        else if (this.IsCurcularDependency(value)) {
            return true;
        }
        return false;
    };
    SnapshotJSInner.prototype.IsCurcularDependency = function (value) {
        if (value && typeof value === "object") {
            if (this.parsed_values.indexOf(value) === -1) {
                this.parsed_values.push(value);
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    };
    return SnapshotJSInner;
}(SnapshotInner));
exports.SnapshotJSInner = SnapshotJSInner;
var SnapshotXMLInner = (function (_super) {
    __extends(SnapshotXMLInner, _super);
    function SnapshotXMLInner(xml_actual) {
        var _this = _super.call(this, xml_actual) || this;
        _this.actual = xml_actual;
        return _this;
    }
    SnapshotXMLInner.prototype.toMatchSnapshot = function (snapshot) {
        var X2JS2 = X2JS;
        var x2js = new X2JS2();
        var js_actual = x2js.xml2js(this.actual);
        expectjs(js_actual).toMatchSnapshot(snapshot);
    };
    return SnapshotXMLInner;
}(SnapshotInner));
exports.SnapshotXMLInner = SnapshotXMLInner;


/***/ })
/******/ ]);
});
//# sourceMappingURL=jasmine-snapshot.js.map