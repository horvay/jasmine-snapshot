(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("difflib"), require("vkbeautify"));
	else if(typeof define === 'function' && define.amd)
		define("jasmine-snapshot", ["difflib", "vkbeautify"], factory);
	else if(typeof exports === 'object')
		exports["jasmine-snapshot"] = factory(require("difflib"), require("vkbeautify"));
	else
		root["jasmine-snapshot"] = factory(root["difflib"], root["vkbeautify"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var difflib_1 = __webpack_require__(0);
var vkbeautify_1 = __webpack_require__(1);
exports.KeyExceptionList = ["typeof"];
exports.MatchesSnapshot = function (snapshot, actual) {
    if (actual !== snapshot) {
        var diff = difflib_1.default.unifiedDiff(snapshot.split("\n"), actual.split("\n"));
        diff.forEach(function (d) { return console.error(d); });
        fail("See diff above. Consider updating snapshot (if valid) to:\n\n" + actual);
    }
};
exports.MatchesXMLSnapshot = function (snapshot, actual) {
    var prettyActual = vkbeautify_1.xml(actual);
    var prettySnapshot = vkbeautify_1.xml(snapshot);
    exports.MatchesSnapshot(prettySnapshot, prettyActual);
};
exports.MatchesJSONSnapshot = function (snapshot, actual) {
    var prettyActual = vkbeautify_1.json(actual);
    var prettySnapshot = vkbeautify_1.json(snapshot);
    exports.MatchesSnapshot(prettySnapshot, prettyActual);
};
var parsed_values = new Array();
var IsCurcularDependency = function (value) {
    if (typeof value === "object" && value) {
        if (parsed_values.indexOf(value) === -1) {
            parsed_values.push(value);
            return false;
        }
        else {
            return true;
        }
    }
    return false;
};
exports.MatchesJSSnapshot = function (snapshot, actual) {
    var removeIEPoo = function (key, value) {
        if (typeof key === "string" && exports.KeyExceptionList.some(function (ex) { return key.indexOf(ex) > 0; })) {
            return;
        }
        else if (IsCurcularDependency(value)) {
            return;
        }
        return value;
    };
    parsed_values = new Array();
    var prettyActual = vkbeautify_1.json(JSON.stringify(actual, removeIEPoo));
    var prettySnapshot = vkbeautify_1.json(snapshot);
    exports.MatchesSnapshot(prettySnapshot, prettyActual);
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=jasmine-snapshot.js.map