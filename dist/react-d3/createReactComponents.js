(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './extractData', './passReactState', 'react'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./extractData'), require('./passReactState'), require('react'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.extractData, global.passReactState, global.react);
        global.createReactComponents = mod.exports;
    }
})(this, function (module, _extractData, _passReactState, _react) {
    'use strict';

    var _extractData2 = _interopRequireDefault(_extractData);

    var _passReactState2 = _interopRequireDefault(_passReactState);

    var _react2 = _interopRequireDefault(_react);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    //Recursively create all nested React components with reactData
    //Child elements are sent back back to extractData and then mapped over to be called recursively
    //TextContent is always passed as a child, if null react ignores it
    function makeChildNodes(reactData, stateData, getState) {

        return reactData.map(function (obj, i) {

            return obj.children.length === 0 ? _react2.default.createElement(obj.tag, (0, _passReactState2.default)(obj, stateData, getState), obj.props.textContent) : _react2.default.createElement(obj.tag, obj.props, (0, _extractData2.default)(obj.children).mappedData.map(function (obj) {
                return makeChildNodes([obj], stateData, getState);
            }));
        });
    }

    module.exports = makeChildNodes;
});