(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../utils/toCamelCase'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../utils/toCamelCase'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.toCamelCase);
        global.getStyles = mod.exports;
    }
})(this, function (exports, _toCamelCase) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (styleObject) {
        var styles = {};

        // convert style string in d3 code into key-value array
        if (typeof styleObject === 'string') {
            var styleArray = styleObject.split(';');
            styleArray.pop();
            styleArray.forEach(function (style) {
                var indexOfColon = style.indexOf(':');
                var key = (0, _toCamelCase2.default)(style.slice(0, indexOfColon));
                var value = style.slice(indexOfColon + 1);
                value = isNaN(value) ? value.trim() : Number(value);
                styles[key.trim()] = value;
            });
        } else {
            for (var key in styleObject) {
                if (!isNaN(key)) {
                    styles[styleObject[key]] = styleObject[styleObject[key]];
                }
            }
        }
        return styles;
    };

    var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
});