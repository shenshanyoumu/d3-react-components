'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj, stateData, getState) {
    var reactId = obj.props['data-react-d3-id'];

    if (stateData[reactId] instanceof Object) {
        for (var key in stateData[reactId]) {
            if (obj.props[key]) {
                obj.props[key] = stateData[reactId][key];
            }
        }
    }

    return obj.props;
};