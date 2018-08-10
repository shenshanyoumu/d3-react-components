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
        global.registerOnListeners = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (reactD3Elements, state, rd3Id, i) {

        if (state[rd3Id]['__on']) {
            reactD3Elements[i]['__on'] = state[rd3Id]['__on'];
            for (var j = 0; j < state[rd3Id]['__on'].length; j++) {
                reactD3Elements[i].addEventListener(state[rd3Id]['__on'][j]["type"], state[rd3Id]['__on'][j]["listener"], state[rd3Id]['__on'][j]["capture"]);
            }
        }
    };
});