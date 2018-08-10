(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.chartConst = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var flowMonitor = {
        OPACITY: {
            NODE_DEFAULT: 0.9,
            NODE_FADED: 0.1,
            NODE_HIGHLIGHT: 0.8,
            LINK_DEFAULT: 0.6,
            LINK_FADED: 0.05,
            LINK_HIGHLIGHT: 0.9
        },
        TYPES: ["Asset", "Expense", "Revenue", "Equity", "Liability"],
        TYPE_COLORS: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d"],
        TYPE_HIGHLIGHT_COLORS: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"],
        // default link color
        LINK_COLOR: "#b3b3b3",
        // link has attribute indicate inflow or outflow
        INFLOW_COLOR: '#2E86D1',
        OUTFLOW_COLOR: '#D63028',
        NODE_WIDTH: 36,
        COLLAPSER: {
            RADIUS: 18
        },
        OUTER_MARGIN: 10,
        MARGIN: {
            TOP: 15,
            RIGHT: 10,
            BOTTOM: 10,
            LEFT: 10
        },
        // default transiton duration time 
        TRANSITION_DURATION: 400,
        LAYOUT_INTERACTIONS: 32
    };

    exports.flowMonitor = flowMonitor;
});