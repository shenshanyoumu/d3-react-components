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