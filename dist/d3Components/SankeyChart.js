(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../baseComponent', '../react-d3/d3DataToJSX', './ChildComponent', '../charts/createSankeyChart'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../baseComponent'), require('../react-d3/d3DataToJSX'), require('./ChildComponent'), require('../charts/createSankeyChart'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.baseComponent, global.d3DataToJSX, global.ChildComponent, global.createSankeyChart);
        global.SankeyChart = mod.exports;
    }
})(this, function (exports, _baseComponent, _d3DataToJSX, _ChildComponent, _createSankeyChart) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _baseComponent2 = _interopRequireDefault(_baseComponent);

    var _d3DataToJSX2 = _interopRequireDefault(_d3DataToJSX);

    var _ChildComponent2 = _interopRequireDefault(_ChildComponent);

    var _createSankeyChart2 = _interopRequireDefault(_createSankeyChart);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var _class = function (_BaseComponent) {
        _inherits(_class, _BaseComponent);

        function _class(props) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            _this.state = { d3DOM: [], state: [] };
            return _this;
        }

        _createClass(_class, [{
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                var d3Data = (0, _d3DataToJSX2.default)((0, _createSankeyChart2.default)(nextProps.data));
                this.setState({ d3DOM: d3Data.mappedData, state: d3Data.state });
            }
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(_ChildComponent2.default, { data: this.state })
                );
            }
        }]);

        return _class;
    }(_baseComponent2.default);

    exports.default = _class;
    ;
});