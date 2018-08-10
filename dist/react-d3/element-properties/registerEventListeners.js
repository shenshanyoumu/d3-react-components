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
        global.registerEventListeners = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (reactD3Elements, state, rd3Id, i) {

        for (var key in state[rd3Id]) {

            if (key !== '__data__' && key !== '__zoom' && key !== '__onmount' && key !== '__transition__' && key !== '__chart__' && key !== 'data-react-d3-id') {

                reactD3Elements[i][key] = state[rd3Id][key];
                var index = key.indexOf('.');
                var eventName = index > 0 ? key.slice(4, index) : key.slice(4);
                reactD3Elements[i].addEventListener(eventName, state[rd3Id][key]);
            }
        }
    };
});