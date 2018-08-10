(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'd3', '../utils/biHiSankey', '../chartConst'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('d3'), require('../utils/biHiSankey'), require('../chartConst'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.d3, global.biHiSankey, global.chartConst);
        global.createSankeyChart = mod.exports;
    }
})(this, function (exports, _d, _biHiSankey, _chartConst) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.update = update;

    var _biHiSankey2 = _interopRequireDefault(_biHiSankey);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _ref, _ref2, _ref3;

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    var svg = void 0,
        tooltip = void 0,
        biHiSankey = void 0,
        path = void 0,
        defs = void 0,
        colorScale = void 0,
        highlightColorScale = void 0,
        isTransitioning = void 0;

    // define chart size
    var MARGIN = _extends({}, _chartConst.flowMonitor.MARGIN);
    var TRANSITION_DURATION = _chartConst.flowMonitor.TRANSITION_DURATION;
    var COLLAPSER = _extends({}, _chartConst.flowMonitor.COLLAPSER);
    var OPACITY = _extends({}, _chartConst.flowMonitor.COLLAPSER);
    var TYPE_COLORS = (_ref = []).concat.apply(_ref, _toConsumableArray(_chartConst.flowMonitor.TYPE_COLORS));
    var TYPES = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(_chartConst.flowMonitor.TYPES));
    var TYPE_HIGHLIGHT_COLORS = (_ref3 = []).concat.apply(_ref3, _toConsumableArray(_chartConst.flowMonitor.TYPE_HIGHLIGHT_COLORS));
    var NODE_WIDTH = _chartConst.flowMonitor.NODE_WIDTH;
    var LAYOUT_INTERACTIONS = _chartConst.flowMonitor.LAYOUT_INTERACTIONS;
    var INFLOW_COLOR = _chartConst.flowMonitor.INFLOW_COLOR;
    var OUTFLOW_COLOR = _chartConst.flowMonitor.OUTFLOW_COLOR;
    var LINK_COLOR = _chartConst.flowMonitor.LINK_COLOR;

    var HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
    var WIDTH = 960 - MARGIN.LEFT - MARGIN.RIGHT;

    // utils tool for convinent
    var utils = {
        formatFlow: function formatFlow(d) {
            var flowFormat = (0, _d.format)(",.0f"); // zero decimal places with sign
            return "£" + flowFormat(Math.abs(d)) + (d < 0 ? " CR" : " DR");
        },
        formatNumber: function formatNumber(d) {
            // zero decimal places
            var numberFormat = (0, _d.format)(",.0f");
            return "£" + numberFormat(d);
        },
        hideTooltip: function hideTooltip() {
            return tooltip.transition().duration(TRANSITION_DURATION).style("opacity", 0);
        },
        showTooltip: function showTooltip() {
            return tooltip.style("left", _d.event.pageX + 'px').style("top", _d.event.pageY + 15 + 'px').transition().duration(TRANSITION_DURATION).style("opacity", 1);
        },
        disableUserInterractions: function disableUserInterractions(time) {
            isTransitioning = true;
            setTimeout(function () {
                isTransitioning = false;
            }, time);
        }
    };

    // node is in-memory DOM 
    function preDrawer(node) {
        //todo:TYPES is node showName
        colorScale = (0, _d.scaleOrdinal)(TYPE_COLORS).domain(TYPES);
        highlightColorScale = (0, _d.scaleOrdinal)(TYPE_HIGHLIGHT_COLORS).domain(TYPES);

        // add svg element into container
        svg = (0, _d.select)(node).append("svg").attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT).attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM).append("g").attr("transform", 'translate(' + MARGIN.LEFT + ',' + MARGIN.TOP + ')');

        // 在SVG元素上针对图表中的links、nodes和collapsed添加不同的group
        svg.append("g").attr("id", "links");
        svg.append("g").attr("id", "nodes");
        svg.append("g").attr("id", "collapsers");

        // 在元素chart添加子元素，用于显示/隐藏提示信息
        tooltip = (0, _d.select)(node).append("div").attr("id", "tooltip");

        // 提示信息利用p元素封装，默认情况不显示提示信息
        tooltip.style("opacity", 0).append("p").attr("class", "value");

        // 初始化第三方库
        biHiSankey = (0, _biHiSankey2.default)();

        // 下面设置节点/link的空白区域，以及link连线箭头与对应node的距离
        // 同时设置图表的尺寸
        biHiSankey.nodeWidth(NODE_WIDTH).nodeSpacing(20).linkSpacing(4).arrowheadScaleFactor(0.5).size([WIDTH, HEIGHT]);

        // specified link path with curvature
        path = biHiSankey.link().curvature(0.45);
    }

    // define defs in svg
    function allDefs() {
        defs = svg.append("defs");

        defs.append("marker").style("fill", LINK_COLOR).attr("id", "arrowHead").attr("viewBox", "0 0 6 10").attr("refX", "1").attr("refY", "5").attr("markerUnits", "strokeWidth").attr("markerWidth", "1").attr("markerHeight", "1").attr("orient", "auto").append("path").attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");

        defs.append("marker").style("fill", OUTFLOW_COLOR).attr("id", "arrowHeadInflow").attr("viewBox", "0 0 6 10").attr("refX", "1").attr("refY", "5").attr("markerUnits", "strokeWidth").attr("markerWidth", "1").attr("markerHeight", "1").attr("orient", "auto").append("path").attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");

        defs.append("marker").style("fill", INFLOW_COLOR).attr("id", "arrowHeadOutlow").attr("viewBox", "0 0 6 10").attr("refX", "1").attr("refY", "5").attr("markerUnits", "strokeWidth").attr("markerWidth", "1").attr("markerHeight", "1").attr("orient", "auto").append("path").attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");
    }

    // data is all pass PieChart creator
    var createSankeyChart = function createSankeyChart(data) {

        // create a in-memory node as chart container
        var node = document.createElement('div');

        // const nodes = data.nodes;
        // const links = data.links;

        var nodes = [{ "type": "Asset", "id": "a", "parent": null, "name": "Assets" }, { "type": "Asset", "id": 1, "parent": "a", "number": "101", "name": "Cash" }, { "type": "Asset", "id": 2, "parent": "a", "number": "120", "name": "Accounts Receivable" }, { "type": "Asset", "id": 3, "parent": "a", "number": "140", "name": "Merchandise Inventory" }, { "type": "Asset", "id": 4, "parent": "a", "number": "150", "name": "Supplies" }, { "type": "Asset", "id": 5, "parent": "a", "number": "160", "name": "Prepaid Insurance" }, { "type": "Asset", "id": 6, "parent": "a", "number": "170", "name": "Land" }, { "type": "Asset", "id": 7, "parent": "a", "number": "175", "name": "Buildings" }, { "type": "Asset", "id": 8, "parent": "a", "number": "178", "name": "Acc. Depreciation Buildings" }, { "type": "Asset", "id": 9, "parent": "a", "number": "180", "name": "Equipment" }, { "type": "Asset", "id": 10, "parent": "a", "number": "188", "name": "Acc. Depreciation Equipment" }, { "type": "Liability", "id": "l", "parent": null, "number": "l", "name": "Liabilities" }, { "type": "Liability", "id": 11, "parent": "l", "number": "210", "name": "Notes Payable" }, { "type": "Liability", "id": 12, "parent": "l", "number": "215", "name": "Accounts Payable" }, { "type": "Liability", "id": 13, "parent": "l", "number": "220", "name": "Wages Payable" }, { "type": "Liability", "id": 14, "parent": "l", "number": "230", "name": "Interest Payable" }, { "type": "Liability", "id": 15, "parent": "l", "number": "240", "name": "Unearned Revenues" }, { "type": "Liability", "id": 16, "parent": "l", "number": "250", "name": "Mortage Loan Payable" }, { "type": "Equity", "id": "eq", "parent": null, "number": "eq", "name": "Equity" }, { "type": "Revenue", "id": "r", "parent": null, "number": "r", "name": "Revenues" }, { "type": "Revenue", "id": "or", "parent": "r", "number": "", "name": "Operating Revenue" }, { "type": "Revenue", "id": 17, "parent": "or", "number": "310", "name": "Service Revenues" }, { "type": "Revenue", "id": "nor", "parent": "r", "number": "", "name": "Non-Operating Revenue" }, { "type": "Revenue", "id": 18, "parent": "nor", "number": "810", "name": "Interest Revenues" }, { "type": "Revenue", "id": 19, "parent": "nor", "number": "910", "name": "Asset Sale Gain" }, { "type": "Revenue", "id": 20, "parent": "nor", "number": "960", "name": "Asset Sale Loss" }, { "type": "Expense", "id": "ex", "parent": null, "number": "ex", "name": "Expenses" }, { "type": "Expense", "id": 21, "parent": "ex", "number": "500", "name": "Salaries Expense" }, { "type": "Expense", "id": 22, "parent": "ex", "number": "510", "name": "Wages Expense" }, { "type": "Expense", "id": 23, "parent": "ex", "number": "540", "name": "Supplies Expense" }, { "type": "Expense", "id": 24, "parent": "ex", "number": "560", "name": "Rent Expense" }, { "type": "Expense", "id": 25, "parent": "ex", "number": "570", "name": "Utilities Expense" }, { "type": "Expense", "id": 26, "parent": "ex", "number": "576", "name": "Telephone Expense" }, { "type": "Expense", "id": 27, "parent": "ex", "number": "610", "name": "Advertising Expense" }, { "type": "Expense", "id": 28, "parent": "ex", "number": "750", "name": "Depreciation Expense" }];

        var links = [{ "source": 8, "target": 28, "value": Math.floor(Math.random() * 100) }, { "source": 17, "target": 18, "value": Math.floor(Math.random() * 100) }, { "source": 22, "target": 24, "value": Math.floor(Math.random() * 100) }, { "source": 3, "target": 13, "value": Math.floor(Math.random() * 100) }, { "source": 24, "target": 24, "value": Math.floor(Math.random() * 100) }, { "source": 5, "target": 4, "value": Math.floor(Math.random() * 100) }, { "source": 15, "target": 5, "value": Math.floor(Math.random() * 100) }, { "source": 18, "target": 8, "value": Math.floor(Math.random() * 100) }, { "source": 3, "target": 20, "value": Math.floor(Math.random() * 100) }, { "source": 17, "target": 18, "value": Math.floor(Math.random() * 100) }, { "source": 22, "target": 5, "value": Math.floor(Math.random() * 100) }, { "source": 4, "target": 24, "value": Math.floor(Math.random() * 100) }, { "source": 26, "target": 16, "value": Math.floor(Math.random() * 100) }, { "source": 27, "target": 6, "value": Math.floor(Math.random() * 100) }, { "source": 23, "target": 4, "value": Math.floor(Math.random() * 100) }, { "source": 10, "target": 24, "value": Math.floor(Math.random() * 100) }, { "source": 17, "target": 16, "value": Math.floor(Math.random() * 100) }, { "source": 5, "target": 12, "value": Math.floor(Math.random() * 100) }, { "source": 12, "target": 16, "value": Math.floor(Math.random() * 100) }, { "source": 19, "target": 5, "value": Math.floor(Math.random() * 100) }, { "source": 15, "target": 24, "value": Math.floor(Math.random() * 100) }, { "source": 27, "target": 2, "value": Math.floor(Math.random() * 100) }, { "source": 26, "target": 28, "value": Math.floor(Math.random() * 100) }, { "source": 22, "target": 24, "value": Math.floor(Math.random() * 100) }, { "source": 3, "target": 18, "value": Math.floor(Math.random() * 100) }, { "source": 18, "target": 5, "value": Math.floor(Math.random() * 100) }, { "source": 25, "target": 28, "value": Math.floor(Math.random() * 100) }, { "source": 12, "target": 1, "value": Math.floor(Math.random() * 100) }, { "source": 28, "target": 21, "value": Math.floor(Math.random() * 100) }, { "source": 9, "target": 16, "value": Math.floor(Math.random() * 100) }, { "source": 14, "target": 23, "value": Math.floor(Math.random() * 100) }, { "source": 6, "target": 1, "value": Math.floor(Math.random() * 100) }, { "source": 9, "target": 15, "value": Math.floor(Math.random() * 100) }, { "source": 16, "target": 24, "value": Math.floor(Math.random() * 100) }, { "source": 22, "target": 28, "value": Math.floor(Math.random() * 100) }, { "source": 8, "target": 21, "value": Math.floor(Math.random() * 100) }, { "source": 22, "target": 7, "value": Math.floor(Math.random() * 100) }, { "source": 18, "target": 10, "value": Math.floor(Math.random() * 100) }, { "source": "eq", "target": 1, "value": Math.floor(Math.random() * 100) }, { "source": 1, "target": 21, "value": Math.floor(Math.random() * 100) }, { "source": 1, "target": 24, "value": Math.floor(Math.random() * 100) }, { "source": 17, "target": 1, "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }, { "source": Math.ceil(Math.random() * 28), "target": Math.ceil(Math.random() * 28), "value": Math.floor(Math.random() * 100) }];

        preDrawer(node);
        allDefs();

        biHiSankey.nodes(nodes).links(links).initializeNodes(function (node) {
            node.state = node.parent ? 'expanded' : 'collapsed';
        }).layout(LAYOUT_INTERACTIONS);

        // disable user interaction when draw links
        utils.disableUserInterractions(2 * TRANSITION_DURATION);
        update();

        return node;
    };

    // when redraw chart,invoke this function
    function update() {
        var link = void 0,
            linkEnter = void 0,
            node = void 0,
            nodeEnter = void 0,
            collapser = void 0,
            collapserEnter = void 0;

        // 拖拽当前node，同时修改图表重布局，以及所有link的曲线
        function dragmove(node) {
            node.x = Math.max(0, Math.min(WIDTH - node.width, _d.event.x));
            node.y = Math.max(0, Math.min(HEIGHT - node.height, _d.event.y));
            (0, _d.select)(this).attr("transform", 'translate(' + node.x + ',' + node.y + ')');
            biHiSankey.relayout();
            svg.selectAll(".node").selectAll("rect").attr("height", function (d) {
                return d.height;
            });
            link.attr("d", path);
        }

        // 递归节点的子节点，并标记状态为contained。注意forEach第二个参数node绑定this对象
        function containChildren(node) {
            node.children.forEach(function (child) {
                child.state = "contained";
                child.parent = this;
                child._parent = null;
                containChildren(child);
            }, node);
        }

        // 当前节点状态为expanded，而其子节点状态为collapsed，然后递归后代节点
        function expand(node) {
            node.state = "expanded";
            node.children.forEach(function (child) {
                child.state = "collapsed";
                child._parent = this;
                child.parent = null;
                containChildren(child);
            }, node);
        }
        // 当前节点状态为collapsed
        function collapse(node) {
            node.state = "collapsed";
            containChildren(node);
        }

        // 鼠标离开link/node，恢复显示
        function restoreLinksAndNodes() {
            link.style("stroke", LINK_COLOR).style("marker-end", function () {
                return "url(#arrowHead)";
            }).transition().duration(TRANSITION_DURATION).style("opacity", OPACITY.LINK_DEFAULT);

            node.selectAll("rect").style("fill", function (d) {
                d.color = colorScale(d.type.replace(/ .*/, ""));
                return d.color;
            }).style("stroke", function (d) {
                return (0, _d.rgb)(colorScale(d.type.replace(/ .*/, ""))).darker(0.1);
            }).style("fill-opacity", OPACITY.NODE_DEFAULT);

            node.filter(function (n) {
                return n.state === "collapsed";
            }).transition().duration(TRANSITION_DURATION).style("opacity", OPACITY.NODE_DEFAULT);
        }

        // 隐藏/显示当前节点
        function showHideChildren(node) {
            utils.disableUserInterractions(2 * TRANSITION_DURATION);
            utils.hideTooltip();
            if (node.state === "collapsed") {
                expand(node);
            } else {
                collapse(node);
            }

            // 图表重新布局，并且递归update方法
            biHiSankey.relayout();
            update();

            // 设置link的曲线路径
            link.attr("d", path);
            restoreLinksAndNodes();
        }

        // 当鼠标移动到某个node节点，则相邻的link高亮
        function highlightConnected(g) {
            link.filter(function (d) {
                return d.source === g;
            }).style("marker-end", function () {
                return "url(#arrowHeadInflow)";
            }).style("stroke", OUTFLOW_COLOR).style("opacity", OPACITY.LINK_DEFAULT);

            link.filter(function (d) {
                return d.target === g;
            }).style("marker-end", function () {
                return "url(#arrowHeadOutlow)";
            }).style("stroke", INFLOW_COLOR).style("opacity", OPACITY.LINK_DEFAULT);
        }

        // 鼠标点击某个节点，与该节点没有连接关系的link透明度变淡
        // 同理，与鼠标浮动的节点不邻接的其他节点的透明度也会变淡
        function fadeUnconnected(g) {
            link.filter(function (d) {
                return d.source !== g && d.target !== g;
            }).style("marker-end", function () {
                return "url(#arrowHead)";
            }).transition().duration(TRANSITION_DURATION).style("opacity", OPACITY.LINK_FADED);

            node.filter(function (d) {
                return d.name === g.name ? false : !biHiSankey.connected(d, g);
            }).transition().duration(TRANSITION_DURATION).style("opacity", OPACITY.NODE_FADED);
        }

        // link数据绑定，并且data()第二个参数表示对数据元素增加唯一主键
        link = svg.select("#links").selectAll("path.link").data(biHiSankey.visibleLinks(), function (d) {
            return d.id;
        });

        // 注意，link的thickness表示线宽
        link.transition().duration(TRANSITION_DURATION)
        // .style('stroke-width', d => Math.max(1, d.thickness))
        .style('stroke-width', 5).attr("d", path).style("opacity", OPACITY.LINK_DEFAULT);

        // link的动态变化
        link.exit().remove();

        linkEnter = link.enter().append("path").attr("class", "link").style("fill", "none");

        // 鼠标hover对应的link，显示提示信息
        linkEnter.on("mouseenter", function (d) {
            if (!isTransitioning) {
                utils.showTooltip().select(".value").text(function () {
                    if (d.direction > 0) {
                        return d.source.name + ' \u2192 ' + d.target.name + '\n' + utils.formatNumber(d.value);
                    }
                    return d.target.name + ' \u2190 ' + d.source.name + '\n' + utils.formatNumber(d.value);
                });

                (0, _d.select)(this).style("stroke", LINK_COLOR).transition().duration(TRANSITION_DURATION / 2).style("opacity", OPACITY.LINK_HIGHLIGHT);
            }
        });

        // 鼠标leave对应的link，则提示信息隐藏。并且link险段颜色和透明度变化
        linkEnter.on("mouseleave", function () {
            if (!isTransitioning) {
                utils.hideTooltip();

                (0, _d.select)(this).style("stroke", LINK_COLOR).transition().duration(TRANSITION_DURATION / 2).style("opacity", OPACITY.LINK_DEFAULT);
            }
        });

        // link线段具有direction特性，
        linkEnter.sort(function (a, b) {
            return b.thickness - a.thickness;
        }).classed("leftToRight", function (d) {
            return d.direction > 0;
        }).classed("rightToLeft", function (d) {
            return d.direction < 0;
        }).style("marker-end", function () {
            return "url(#arrowHead)";
        }).style("stroke", LINK_COLOR).style("opacity", 0).transition().delay(TRANSITION_DURATION).duration(TRANSITION_DURATION).attr("d", path)
        // .style("stroke-width", d => Math.max(1, d.thickness))
        .style('stroke-width', 5).style("opacity", OPACITY.LINK_DEFAULT);

        // 设置node数据绑定
        node = svg.select("#nodes").selectAll(".node").data(biHiSankey.collapsedNodes(), function (d) {
            return d.id;
        });

        // 每个node的位置由第三方库计算得到，每个node具有特定的颜色
        node.transition().duration(TRANSITION_DURATION).attr("transform", function (d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        }).style("opacity", OPACITY.NODE_DEFAULT).select("rect").style("fill", function (d) {
            d.color = colorScale(d.type.replace(/ .*/, ""));
            return d.color;
        }).style("stroke", function (d) {
            return (0, _d.rgb)(colorScale(d.type.replace(/ .*/, ""))).darker(0.1);
        }).style("stroke-WIDTH", "1px").attr("height", function (d) {
            return d.height;
        }).attr("width", biHiSankey.nodeWidth());

        // 当node状态为collapsed时，发生收缩则需要先进行收缩动画，然后在删除
        node.exit().transition().duration(TRANSITION_DURATION).attr("transform", function (d) {
            var collapsedAncestor = void 0,
                endX = void 0,
                endY = void 0;
            collapsedAncestor = d.ancestors.filter(function (a) {
                return a.state === "collapsed";
            })[0];
            endX = collapsedAncestor ? collapsedAncestor.x : d.x;
            endY = collapsedAncestor ? collapsedAncestor.y : d.y;
            return 'translate(' + endX + ',' + endY + ')';
        }).remove();

        // 增加node
        nodeEnter = node.enter().append("g").attr("class", "node");

        // 当node状态为expand，则当前node从父节点位置开始动画过渡到自身位置
        nodeEnter.attr("transform", function (d) {
            var startX = d._parent ? d._parent.x : d.x,
                startY = d._parent ? d._parent.y : d.y;
            return 'translate(' + startX + ',' + startY + ')';
        }).style("opacity", 1e-6).transition().duration(TRANSITION_DURATION).style("opacity", OPACITY.NODE_DEFAULT).attr("transform", function (d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });

        nodeEnter.append("text");

        // 新增的node颜色
        nodeEnter.append("rect").style("fill", function (d) {
            d.color = colorScale(d.type.replace(/ .*/, ""));
            return d.color;
        }).style("stroke", function (d) {
            return (0, _d.rgb)(colorScale(d.type.replace(/ .*/, ""))).darker(0.1);
        }).style("stroke-WIDTH", "1px").attr("height", function (d) {
            return d.height;
        }).attr("width", biHiSankey.nodeWidth());

        // 鼠标hover到特定node，
        nodeEnter.on("mouseenter", function (g) {
            if (!isTransitioning) {
                restoreLinksAndNodes();
                highlightConnected(g);
                fadeUnconnected(g);

                (0, _d.select)(this).select("rect").style("fill", function (d) {
                    d.color = d.netFlow > 0 ? INFLOW_COLOR : OUTFLOW_COLOR;
                    return d.color;
                }).style("stroke", function (d) {
                    return (0, _d.rgb)(d.color).darker(0.1);
                }).style("fill-opacity", OPACITY.LINK_DEFAULT);

                // 显示当前node的提示信息
                tooltip.style("left", g.x + MARGIN.LEFT + 'px').style("top", g.y + g.height + MARGIN.TOP + 15 + 'px').transition().duration(TRANSITION_DURATION).style("opacity", 1).select(".value").text(function () {
                    var additionalInstructions = g.children.length ? "\n(Double click to expand)" : "";
                    return g.name + '\nNet flow: ' + utils.formatFlow(g.netFlow) + additionalInstructions;
                });
            }
        });

        // 鼠标leave当前node，则隐藏提示信息
        nodeEnter.on("mouseleave", function () {
            if (!isTransitioning) {
                utils.hideTooltip();
                restoreLinksAndNodes();
            }
        });

        // 如果node具有子节点，则双击当前node，所有子节点的提示信息都会显示
        node.filter(function (d) {
            return d.children.length;
        }).on("dblclick", showHideChildren);

        // 拖动当前node的行为
        node.call((0, _d.drag)().subject(function (d) {
            return d;
        }).on("start", function () {
            this.parentNode.appendChild(this);
        }).on("drag", dragmove));

        // node对应的提示信息的定位坐标计算
        node.filter(function (d) {
            return d.value !== 0;
        }).select("text").attr("x", -6).attr("y", function (d) {
            return d.height / 2;
        }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function (d) {
            return d.name;
        }).filter(function (d) {
            return d.x < WIDTH / 2;
        }).attr("x", 6 + biHiSankey.nodeWidth()).attr("text-anchor", "start");

        // 增加collapsed
        collapser = svg.select("#collapsers").selectAll(".collapser").data(biHiSankey.expandedNodes(), function (d) {
            return d.id;
        });

        collapserEnter = collapser.enter().append("g").attr("class", "collapser");

        // 发生收缩的node节点变成一个圆形
        collapserEnter.append("circle").attr("r", COLLAPSER.RADIUS).style("fill", function (d) {
            d.color = colorScale(d.type.replace(/ .*/, ""));
            return d.color;
        });

        collapserEnter.style("opacity", OPACITY.NODE_DEFAULT).attr("transform", function (d) {
            return 'translate(' + (d.x + d.width / 2) + ',' + (d.y + COLLAPSER.RADIUS) + ')';
        });

        // 双击该圆形区域的收缩节点，则显示提示信息
        collapserEnter.on("dblclick", showHideChildren);

        collapser.select("circle").attr("r", COLLAPSER.RADIUS);

        // 
        collapser.transition().delay(TRANSITION_DURATION).duration(TRANSITION_DURATION).attr("transform", function (d, i) {
            return 'translate(' + (COLLAPSER.RADIUS + i * 2 * (COLLAPSER.RADIUS + COLLAPSER.SPACING)) + ',' + (-COLLAPSER.RADIUS - OUTER_MARGIN) + ')';
        });

        // 鼠标hover当前圆形区域
        collapser.on("mouseenter", function (g) {
            if (!isTransitioning) {
                utils.showTooltip().select(".value").text(function () {
                    return g.name + '\n(Double click to collapse)';
                });

                var highlightColor = highlightColorScale(g.type.replace(/ .*/, ""));

                (0, _d.select)(this).style("opacity", OPACITY.NODE_HIGHLIGHT).select("circle").style("fill", highlightColor);

                node.filter(function (d) {
                    return d.ancestors.indexOf(g) >= 0;
                }).style("opacity", OPACITY.NODE_HIGHLIGHT).select("rect").style("fill", highlightColor);
            }
        });

        // 鼠标leave当前圆形区域节点
        collapser.on("mouseleave", function (g) {
            if (!isTransitioning) {
                utils.hideTooltip();
                (0, _d.select)(this).style("opacity", OPACITY.NODE_DEFAULT).select("circle").style("fill", function (d) {
                    return d.color;
                });

                node.filter(function (d) {
                    return d.ancestors.indexOf(g) >= 0;
                }).style("opacity", OPACITY.NODE_DEFAULT).select("rect").style("fill", function (d) {
                    return d.color;
                });
            }
        });

        collapser.exit().remove();
    }

    exports.default = createSankeyChart;
});