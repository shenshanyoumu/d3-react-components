(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.applyChartData = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (reactD3Elements, state, rd3Id, i) {
        if (state[rd3Id]['__chart__']) {
            reactD3Elements[i]['__chart__'] = state[rd3Id]['__chart__'];
        }
    };
});