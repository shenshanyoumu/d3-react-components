(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './extractData'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./extractData'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.extractData);
        global.d3DataToJSX = mod.exports;
    }
})(this, function (exports, _extractData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _extractData2 = _interopRequireDefault(_extractData);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = function (nodes) {

        // If nodes is a single element wrap it in an array for extractData to work properly
        if (!Array.isArray(nodes)) nodes = [nodes];

        // Extract all the relevant data for React createElement from each DOM node.
        var reactData = (0, _extractData2.default)(nodes);

        return reactData;
    };
});