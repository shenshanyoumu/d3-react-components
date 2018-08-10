(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './d3Components/Component', './d3Components/PieChart', './d3Components/SankeyChart'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./d3Components/Component'), require('./d3Components/PieChart'), require('./d3Components/SankeyChart'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Component, global.PieChart, global.SankeyChart);
        global.index = mod.exports;
    }
})(this, function (exports, _Component, _PieChart, _SankeyChart) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Component2 = _interopRequireDefault(_Component);

    var _PieChart2 = _interopRequireDefault(_PieChart);

    var _SankeyChart2 = _interopRequireDefault(_SankeyChart);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = {
        Component: _Component2.default,
        PieChart: _PieChart2.default,
        SankeyChart: _SankeyChart2.default
    };
});