(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("difflib"), require("vkbeautify"), require("x2js"));
	else if(typeof define === 'function' && define.amd)
		define("jasmine-snapshot", ["difflib", "vkbeautify", "x2js"], factory);
	else if(typeof exports === 'object')
		exports["jasmine-snapshot"] = factory(require("difflib"), require("vkbeautify"), require("x2js"));
	else
		root["jasmine-snapshot"] = factory(root["difflib"], root["vkbeautify"], root["x2js"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var nativeWarn = window.console.warn;
window.console.warn = function () {
    if ((arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("[xmldom ") !== -1)) {
        return;
    }
    nativeWarn.apply(window.console, arguments);
};
var nativeError = window.console.error;
window.console.error = function () {
    if ((arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("entity not found") !== -1)) {
        return;
    }
    nativeError.apply(window.console, arguments);
};


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
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
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
var difflib = __webpack_require__(1);
var vkbeautify_1 = __webpack_require__(2);
var X2JS = __webpack_require__(3);
__webpack_require__(0);
var current_snapshot_object = {};
function registerSnapshots(snapshot_object, name) {
    current_snapshot_object = snapshot_object;
    current_suite = new AutoSnapshotSuite(current_level, name);
}
exports.registerSnapshots = registerSnapshots;
var AutoSnapshot = (function () {
    function AutoSnapshot() {
    }
    return AutoSnapshot;
}());
var auto_snapshot_siute_history = new Array();
var AutoSnapshotSuite = (function () {
    function AutoSnapshotSuite(snapshot_level, suite_name) {
        this.snapshots = Array();
        this.level = 0;
        this.fail_counter_for_autosnapshot = 0;
        this.last_automagic_snapshot_spec = "";
        this.last_automagic_snapshot_number = 0;
        this.level = snapshot_level;
        this.name = suite_name;
    }
    AutoSnapshotSuite.prototype.getSnapshotAutomagically_saveActual = function (actual) {
        var auto_snapshot = new AutoSnapshot();
        if (current_spec === this.last_automagic_snapshot_spec) {
            this.last_automagic_snapshot_number++;
        }
        else {
            this.last_automagic_snapshot_number = 1;
            this.last_automagic_snapshot_spec = current_spec;
        }
        auto_snapshot.key = create_one_liner(current_spec + " " + this.last_automagic_snapshot_number);
        auto_snapshot.text = create_one_liner(actual);
        this.snapshots.push(auto_snapshot);
        var snapshot = current_snapshot_object[auto_snapshot.key];
        return snapshot ? snapshot : "";
    };
    AutoSnapshotSuite.prototype.hasFailure = function () {
        return this.fail_counter_for_autosnapshot > 0;
    };
    AutoSnapshotSuite.prototype.reportFailure = function (diff) {
        this.snapshots[this.snapshots.length - 1].diff = diff;
        this.fail_counter_for_autosnapshot++;
    };
    AutoSnapshotSuite.prototype.getText = function () {
        var snapshot_file_text = "\n**** If actual is valid, update your snapshot with the following ****\n{";
        var has_snapshots = false;
        for (var _i = 0, _a = this.snapshots; _i < _a.length; _i++) {
            var snapshot = _a[_i];
            has_snapshots = true;
            snapshot_file_text += "\n\t\"" + snapshot.key + "\": `" + snapshot.text + "`,";
        }
        if (has_snapshots) {
            snapshot_file_text = snapshot_file_text.slice(0, snapshot_file_text.length - 1);
            snapshot_file_text += "\n}\n\n";
        }
        return snapshot_file_text;
    };
    AutoSnapshotSuite.prototype.pushToHistory = function () {
        auto_snapshot_siute_history.push(this);
    };
    AutoSnapshotSuite.prototype.getHTML = function () {
        document.body.style.fontFamily = "Courier New";
        document.body.style.whiteSpace = "nowrap";
        if (!this.name) {
            throw "name not defined for snapshot suite";
        }
        if (!this.hasFailure()) {
            return "<p style=\"color: green; font-size: 25px; font-weight: bold;\">===Auto snapshot suite, " + this.name + ", has no problems!===</p>";
        }
        var snapshot_file_html = "<p style=\"color: red; font-size: 25px; font-weight: bold;\">===Suite, " + this.name + ", had problems===</p>";
        this.snapshots.forEach(function (snapshot) {
            if (snapshot.diff) {
                snapshot_file_html += "<div>>Test: \"" + snapshot.key + "\" did not match the snapshot:</div><br //>";
                snapshot.diff.forEach(function (d) {
                    if (d.length >= 3 && (d.slice(0, 3) === "---" || d.slice(0, 3) === "+++") || d.slice(0, 2) === "@@") {
                        return;
                    }
                    else if (d.charAt(0) === "-") {
                        snapshot_file_html += "<span style=\"color: red\">" + d.replace(/&nbsp;/g, "&amp;nbsp;").replace(/ /g, "&nbsp;") + "</span><br //>";
                    }
                    else if (d.charAt(0) === "+") {
                        snapshot_file_html += "<span style=\"color: green\">" + d.replace(/&nbsp;/g, "&amp;nbsp;").replace(/ /g, "&nbsp;") + "</span><br //>";
                    }
                    else {
                        snapshot_file_html += d.replace(/&nbsp;/g, "&amp;nbsp;").replace(/ /g, "&nbsp;") + "<br //>";
                    }
                });
            }
        });
        snapshot_file_html += "<p style=\"text-decoration: underline; font-weight: bold;\">If actual is valid, update your snapshot with the following <//p>";
        snapshot_file_html += "<div style='color: blue;'>{";
        var has_snapshots = false;
        for (var _i = 0, _a = this.snapshots; _i < _a.length; _i++) {
            var snapshot = _a[_i];
            has_snapshots = true;
            snapshot_file_html += "<br //>&nbsp;&nbsp;&nbsp;&nbsp;\"" + snapshot.key + "\": `" + snapshot.text.replace(/&nbsp;/g, "&amp;nbsp;") + "`,";
        }
        if (has_snapshots) {
            snapshot_file_html = snapshot_file_html.slice(0, snapshot_file_html.length - 1);
            snapshot_file_html += "<br //>}</div></p>";
        }
        return snapshot_file_html;
    };
    return AutoSnapshotSuite;
}());
var current_suite;
var current_spec = "";
var current_level = 0;
jasmine.getEnv().addReporter({
    suiteStarted: function (result) {
        current_level++;
    },
    specStarted: function (result) {
        current_spec = result.fullName;
    },
    suiteDone: function (result) {
        current_level--;
        if (current_suite && current_level < current_suite.level) {
            if (current_suite.hasFailure) {
            }
            current_suite.pushToHistory();
            current_suite = null;
        }
    },
    jasmineDone: function (results) {
        if (current_suite) {
            if (current_suite.hasFailure) {
            }
            current_suite.pushToHistory();
            current_suite = null;
        }
        if (auto_snapshot_siute_history.length === 0) {
            return;
        }
        var html_summary = auto_snapshot_siute_history.reduce(function (prev_html, curr_suite) {
            return prev_html + "<br //>" + curr_suite.getHTML();
        }, "");
        document.body.innerHTML = html_summary + document.body.innerHTML;
    }
});
exports.KeyExceptionList = ["typeof"];
function ResetExceptionList() {
    exports.KeyExceptionList = ["typeof"];
}
exports.ResetExceptionList = ResetExceptionList;
function MatchesSnapshot(snapshot, actual, automagic) {
    if (actual !== snapshot) {
        var diff = difflib.unifiedDiff(snapshot.split("\n"), actual.split("\n"));
        if (automagic) {
            if (!current_suite) {
                throw "autoagic snapshot with no registered snapshot object";
            }
            current_suite.reportFailure(diff);
        }
        var diff_string_1 = "\n";
        diff_string_1 += "**** " + current_spec + " diff *****\n\n";
        diff.forEach(function (d) {
            if (d !== "--- \n" && d !== "+++ \n" &&
                !(d.length > 5 && d.slice(0, 2) === "@@")) {
                diff_string_1 += d + "\n";
            }
        });
        diff_string_1 += "\n";
        if (!automagic) {
            var one_line_actual = create_one_liner(actual);
            diff_string_1 += "**** If the Actual is valid, update the snapshot with this ****\n";
            diff_string_1 += " ----- Formatted ------\n" + actual + "\n\n ----- Single Line ------\n" + one_line_actual;
        }
        console.error(diff_string_1);
        fail("Actual does not match snapshot. See above. ");
    }
}
exports.MatchesSnapshot = MatchesSnapshot;
function create_one_liner(actual) {
    var one_line_actual = actual.replace(/\n/g, "").replace(/\t/g, "").replace(/\\"/g, "\\\\\\\"");
    while (one_line_actual.indexOf("  ") !== -1) {
        one_line_actual = one_line_actual.replace(/(  )/g, " ");
    }
    return one_line_actual;
}
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
        var prettyActual = this.actual ? vkbeautify_1.json(this.getOrderedStringifyAndClean()) : "";
        var prettySnapshot = snapshot;
        var use_autosnapshot = false;
        if (snapshot === null || snapshot === undefined) {
            if (!current_suite) {
                throw "Use of autosnapshot without registering snapshot object";
            }
            use_autosnapshot = true;
            var auto_snapshot = current_suite.getSnapshotAutomagically_saveActual(prettyActual);
            prettySnapshot = auto_snapshot ? vkbeautify_1.json(auto_snapshot) : "";
        }
        else {
            prettySnapshot = snapshot ? vkbeautify_1.json(snapshot) : snapshot;
        }
        MatchesSnapshot(prettySnapshot, prettyActual, use_autosnapshot);
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