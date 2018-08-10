'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

// parse html tag string
exports.default = function (string) {
    return string.slice(string.indexOf('<'), string.indexOf('>') + 1);
};