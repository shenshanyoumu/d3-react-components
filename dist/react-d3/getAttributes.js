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
        global.getAttributes = mod.exports;
    }
})(this, function (exports, _toCamelCase) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (attributesObject, node) {
        var attributes = {};
        for (var key in attributesObject) {
            if (!isNaN(key)) {
                // transform 'class' to 'className'
                if (attributesObject[key].localName === 'class') {
                    attributes['className'] = attributesObject[key].nodeValue;
                } else if (attributesObject[key].localName.indexOf('-') > -1) {

                    // transform xx-yy to xxYy
                    var reactKey = (0, _toCamelCase2.default)(attributesObject[key].localName);
                    attributes[reactKey] = attributesObject[key].nodeValue;
                } else {
                    attributes[attributesObject[key].localName] = attributesObject[key].nodeValue;
                }
            }
        }

        // if in-memory node has below attributes
        if (node['data-react-d3-id']) {
            attributes['data-react-d3-id'] = node['data-react-d3-id'];
        }

        if (node['__transition__']) {
            attributes['__transition__'] = node['__transition__'];
        }

        // becarful,key in node may be '__transition__'
        // and key may be '__data__'
        for (var _key in node) {
            if (_key.slice(0, 2) === '__') {
                attributes[_key] = node[_key];
            }
        }

        return attributes;
    };

    var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
});