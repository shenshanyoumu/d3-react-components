'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseComponent = require('../baseComponent');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _createReactComponents = require('../react-d3/createReactComponents');

var _createReactComponents2 = _interopRequireDefault(_createReactComponents);

var _applyData = require('../react-d3/element-properties/applyData');

var _applyData2 = _interopRequireDefault(_applyData);

var _applyZoomData = require('../react-d3/element-properties/applyZoomData');

var _applyZoomData2 = _interopRequireDefault(_applyZoomData);

var _applyTransitionData = require('../react-d3/element-properties/applyTransitionData');

var _applyTransitionData2 = _interopRequireDefault(_applyTransitionData);

var _applyChartData = require('../react-d3/element-properties/applyChartData');

var _applyChartData2 = _interopRequireDefault(_applyChartData);

var _mountD3Functions = require('../react-d3/element-properties/mountD3Functions');

var _mountD3Functions2 = _interopRequireDefault(_mountD3Functions);

var _registerOnListeners = require('../react-d3/element-properties/registerOnListeners');

var _registerOnListeners2 = _interopRequireDefault(_registerOnListeners);

var _registerEventListeners = require('../react-d3/element-properties/registerEventListeners');

var _registerEventListeners2 = _interopRequireDefault(_registerEventListeners);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_BaseComponent) {
    _inherits(_class, _BaseComponent);

    function _class(props) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

        _this.state = { reactComponents: [] };
        return _this;
    }

    _createClass(_class, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var props = nextProps.data;
            var reactComponents = (0, _createReactComponents2.default)(props.d3DOM, props.state, nextProps.getState);

            this.setState({ reactComponents: reactComponents });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var reactD3Elements = document.querySelectorAll('[data-react-d3-id]');
            var state = this.props.data.state;

            for (var i = 0; i < reactD3Elements.length; i++) {
                var rd3Id = reactD3Elements[i].getAttribute('data-react-d3-id');
                var that = this;

                if (!state[rd3Id]) continue;

                (0, _applyData2.default)(reactD3Elements, state, rd3Id, i);
                (0, _applyZoomData2.default)(reactD3Elements, state, rd3Id, i);
                (0, _applyTransitionData2.default)(reactD3Elements, state, rd3Id, i);
                (0, _applyChartData2.default)(reactD3Elements, state, rd3Id, i);
                (0, _mountD3Functions2.default)(state, rd3Id, that);
                (0, _registerOnListeners2.default)(reactD3Elements, state, rd3Id, i);
                (0, _registerEventListeners2.default)(reactD3Elements, state, rd3Id, i);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.hasTimer) this.hasTimer = false;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'react-component' },
                this.state.reactComponents || ''
            );
        }
    }]);

    return _class;
}(_baseComponent2.default);

exports.default = _class;