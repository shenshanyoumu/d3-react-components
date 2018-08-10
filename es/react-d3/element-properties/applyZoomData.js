'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (reactD3Elements, state, rd3Id, i) {
    if (state[rd3Id]['__zoom']) {
        reactD3Elements[i]['__zoom'] = state[rd3Id]['__zoom'];
    }
};