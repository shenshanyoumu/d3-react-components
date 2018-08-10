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
        global.mountD3Functions = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (state, rd3Id, that) {
        if (state[rd3Id]['__onmount']) {
            var callback = state[rd3Id]['__onmount'].bind(that);
            setTimeout(function () {
                callback();
            }, 0);
        }
    };
});