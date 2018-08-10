'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = camelCaseKeys;

var _lodash = require('lodash');

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