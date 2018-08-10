"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return spinalCaseValue.replace(/-[a-zA-Z]/g, function (match) {
        return match[1].toUpperCase();
    });
};