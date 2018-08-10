(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'lodash'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('lodash'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.lodash);
        global.camelCaseKeys = mod.exports;
    }
})(this, function (exports, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = camelCaseKeys;
    function camelCaseKeys(object) {
        if ((0, _lodash.isArray)(object)) {
            return object.map(function (val) {
                return camelCaseKeys(val);
            });
        } else if ((0, _lodash.isObject)(object)) {
            var obj = {};
            Object.keys(object).forEach(function (key) {
                obj[(0, _lodash.camelCase)(key)] = camelCaseKeys(object[key]);
            });
            return obj;
        }
        return object;
    }
});